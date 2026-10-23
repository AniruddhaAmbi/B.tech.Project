from google import genai
from app.config import settings

class TextToSQLService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_sql(self, schema_description: str, user_question: str) -> str:
        prompt = f"""
        You are an expert Text-to-SQL engine for SMEs. 
        Given the following database schema, write a clean, secure, read-only SQL query (SELECT statements only) to answer the user question.
        
        Database Schema:
        {schema_description}

        User Question:
        {user_question}

        Return ONLY the raw SQL query string without markdown backticks or extra text.
        """
        response = self.client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text.strip().replace("```sql", "").replace("```", "").strip()