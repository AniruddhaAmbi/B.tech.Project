import os
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from app.database import get_database
from app.config import settings
from google import genai
from google.genai import types
from pinecone import Pinecone
import pandas as pd
import docx
import PyPDF2

router = APIRouter(prefix="/api/documents", tags=["Documents"])

# Initialize Gemini & Pinecone clients
ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_file(file_path: str, filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    text = ""
    try:
        if ext == "pdf":
            reader = PyPDF2.PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        elif ext in ["docx", "doc"]:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext in ["xlsx", "xls", "csv"]:
            if ext == "csv":
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            text = df.to_string()
        elif ext == "txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
    except Exception as e:
        print(f"Error parsing file {filename}: {e}")
    return text

@router.get("/")
async def get_documents(workspace_id: str = Query("GreenLeaf Retail")):
    db = get_database()
    cursor = db.documents.find({"workspace_id": workspace_id})
    docs = []
    async for document in cursor:
        docs.append({
            "id": str(document["_id"]),
            "name": document["name"],
            "size": document["size"],
            "status": document.get("status", "Available")
        })
    return docs

@router.post("/upload")
async def upload_documents(
    files: List[UploadFile] = File(...),
    workspace_id: str = Query("GreenLeaf Retail")
):
    db = get_database()
    uploaded_response = []

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = os.path.getsize(file_path)
        
        # 1. Extract Text
        extracted_text = extract_text_from_file(file_path, file.filename)
        
        # 2. Chunk text & Generate Gemini Embeddings, then upsert to Pinecone
        if extracted_text.strip():
            chunk_size = 1000
            chunks = [extracted_text[i:i+chunk_size] for i in range(0, len(extracted_text), chunk_size)]
            
            vectors = []
            for idx, chunk in enumerate(chunks):
                # Generate embedding using the correct modern Google GenAI SDK model name & 768 dimensions
                response = ai_client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=chunk,
                    config=types.EmbedContentConfig(output_dimensionality=768)
                )
                embedding = response.embeddings[0].values
                
                vectors.append({
                    "id": f"{file.filename}_{idx}",
                    "values": embedding,
                    "metadata": {"workspace_id": workspace_id, "filename": file.filename, "text": chunk}
                })
            
            # Upsert into Pinecone
            if vectors:
                index.upsert(vectors=vectors)

        # 3. Save metadata to MongoDB Atlas
        doc_meta = {
            "workspace_id": workspace_id,
            "name": file.filename,
            "size": file_size,
            "status": "Available"
        }
        result = await db.documents.insert_one(doc_meta)
        
        uploaded_response.append({
            "id": str(result.inserted_id),
            "name": file.filename,
            "size": file_size,
            "status": "Available"
        })

    return uploaded_response