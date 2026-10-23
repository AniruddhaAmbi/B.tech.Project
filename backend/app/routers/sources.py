from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ingestion import DocumentIngestionService
from app.database import get_database

router = APIRouter(prefix="/api/sources", tags=["Data Sources"])

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        extracted_text = DocumentIngestionService.extract_text(contents, file.filename)
        
        # Save metadata and extracted text to MongoDB Atlas
        db = get_database()
        doc_record = {
            "filename": file.filename,
            "content_snippet": extracted_text[:1000],  # preview
            "full_text_length": len(extracted_text),
            "status": "processed"
        }
        result = await db.documents.insert_one(doc_record)
        
        return {
            "file_id": str(result.inserted_id),
            "filename": file.filename,
            "status": "success",
            "message": "File successfully uploaded and parsed!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))