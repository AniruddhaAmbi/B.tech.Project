# manages document embeddings and vector search in Pinecone. Specifically, it breaks text into chunks, uses Gemini to convert them into 768-dimension vectors, and handles upserting and retrieving those vectors by workspace ID.


from pinecone import Pinecone, ServerlessSpec
from app.config import settings
from app.services.gemini import client
from google.genai import types

pc = Pinecone(api_key=settings.PINECONE_API_KEY)

def get_pinecone_index():
    index_name = settings.PINECONE_INDEX_NAME
    existing_indexes = [idx["name"] for idx in pc.list_indexes()]
    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=768, 
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
    return pc.Index(index_name)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

async def generate_embedding(text: str):
    """Generates 768-dimension vector embeddings using Gemini."""
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=768)  # Truncate output vector to 768 dimensions
    )
    return response.embeddings[0].values

async def upsert_document_to_pinecone(doc_id: str, text: str, workspace_id: str):
    """Dynamically accepts workspace_id so any company can ingest documents."""
    index = get_pinecone_index()
    chunks = chunk_text(text)
    
    vectors = []
    for i, chunk in enumerate(chunks):
        vector_values = await generate_embedding(chunk)
        vector_id = f"{workspace_id}_{doc_id}_chunk_{i}"
        chunk_metadata = {
            "workspace_id": workspace_id, 
            "doc_id": doc_id, 
            "chunk_index": i, 
            "text": chunk
        }
        vectors.append({"id": vector_id, "values": vector_values, "metadata": chunk_metadata})
        
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i+100])
        
    return len(chunks)

async def query_pinecone(query_text: str, workspace_id: str, top_k: int = 3):
    """Isolates vector search strictly to the requesting company's workspace_id."""
    index = get_pinecone_index()
    query_vector = await generate_embedding(query_text)
    
    # Filter metadata so Company A cannot search Company B's proprietary data
    filter_dict = {"workspace_id": workspace_id} if workspace_id else None
    
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter=filter_dict
    )
    
    matched_chunks = [match["metadata"]["text"] for match in results.get("matches", [])]
    return matched_chunks