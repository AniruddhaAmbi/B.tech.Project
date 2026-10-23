from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.vector_store import upsert_document_to_pinecone
from app.services.analyst_engine import run_ai_analyst_query

router = APIRouter(prefix="/api/test", tags=["Test Analyst"])

class IngestRequest(BaseModel):
    workspace_id: str  # e.g., "GreenLeaf", "ApexTech", "GlobalRetail" - completely dynamic!
    doc_id: str
    text: str

class QueryRequest(BaseModel):
    workspace_id: str
    question: str
    source_type: str  # "documents" or "sql"
    source_identifier: str = ""
    extra_context: str = ""

@router.post("/ingest")
async def test_ingest(payload: IngestRequest):
    try:
        chunks_count = await upsert_document_to_pinecone(
            doc_id=payload.doc_id, 
            text=payload.text, 
            workspace_id=payload.workspace_id
        )
        return {"status": "success", "workspace_id": payload.workspace_id, "chunks_created": chunks_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def test_query(payload: QueryRequest):
    try:
        result = await run_ai_analyst_query(
            question=payload.question,
            data_source_type=payload.source_type,
            workspace_id=payload.workspace_id,
            source_identifier=payload.source_identifier,
            extra_context=payload.extra_context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))