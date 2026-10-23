import io
import pandas as pd
from pypdf import PdfReader
from docx import Document

class DocumentIngestionService:
    @staticmethod
    def extract_text(file_bytes: bytes, filename: str) -> str:
        ext = filename.split(".")[-1].lower()
        text = ""

        if ext == "pdf":
            reader = PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        
        elif ext in ["docx", "doc"]:
            doc = Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        
        elif ext in ["xlsx", "xls", "csv"]:
            if ext == "csv":
                df = pd.read_csv(io.BytesIO(file_bytes))
            else:
                df = pd.read_excel(io.BytesIO(file_bytes))
            # Convert tabular data into a readable summary string for RAG/Analysis
            text = df.to_string(index=False)
        
        elif ext == "txt":
            text = file_bytes.decode("utf-8", errors="ignore")
        
        else:
            raise ValueError(f"Unsupported file format: .{ext}")

        return text