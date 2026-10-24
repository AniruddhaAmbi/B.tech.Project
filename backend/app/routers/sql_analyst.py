from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.sql_manager import SQLManagerService

router = APIRouter(prefix="/api/sql", tags=["SQL Analytics"])

class SQLQueryRequest(BaseModel):
    db_url: str = "sqlite:///./test/test.db"  # Defaults directly to your test.db inside test/
    question: str

@router.post("/query")
async def execute_text_to_sql(payload: SQLQueryRequest):
    try:
        manager = SQLManagerService(payload.db_url)
        analysis_result = manager.translate_and_execute(payload.question)
        return {
            "status": "success",
            "query_analysis": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))