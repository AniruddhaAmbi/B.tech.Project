# to process questions using Gemini and Pinecone

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.config import settings
from google import genai
from google.genai import types
from pinecone import Pinecone

router = APIRouter(prefix="/api/ai", tags=["AI Analyst"])

ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

class QueryRequest(BaseModel):
    question: str
    workspace_id: str = "GreenLeaf Retail"

@router.post("/query")
async def query_ai_analyst(payload: QueryRequest):
    try:
        # 1. Generate embedding for the user's question
        embed_response = ai_client.models.embed_content(
            model="gemini-embedding-001",
            contents=payload.question,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        question_embedding = embed_response.embeddings[0].values

        # 2. Query Pinecone for relevant document chunks in this workspace
        query_result = index.query(
            vector=question_embedding,
            top_k=3,
            include_metadata=True,
            filter={"workspace_id": {"$eq": payload.workspace_id}}
        )

        # 3. Extract context from matched chunks
        context_texts = []
        for match in query_result.get("matches", []):
            if match.get("metadata") and "text" in match["metadata"]:
                context_texts.append(match["metadata"]["text"])

        context_str = "\n\n".join(context_texts) if context_texts else "No specific documents found for this workspace yet."

        # 4. Construct prompt for Gemini 2.5/1.5 Flash
        prompt = f"""
        You are DOCIQ, an expert AI Business Analyst. Answer the user's question professionally based on the provided business documents/data context. If the context doesn't contain the exact answer, use your professional business reasoning while noting limitations.
        
        Business Context:
        {context_str}
        
        User Question: {payload.question}
        
        Provide a clear, structured, and actionable business response:
        """

        # 5. Generate response using Gemini
        chat_response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {
            "question": payload.question,
            "answer": chat_response.text,
            "sources_used": len(context_texts)
        }

    except Exception as e:
        print(f"Error in AI Analyst query: {e}")
        raise HTTPException(status_code=500, detail=str(e))