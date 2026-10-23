# Handles Text-to-SQL translation for structured datasets/databases.

import pandas as pd
from sqlalchemy import create_engine, text
from app.services.gemini import client

async def text_to_sql_and_execute(question: str, db_connection_string: str, schema_description: str):
    """Translates a user question into SQL, executes it against the database, and returns results."""
    prompt = f"""
    You are an expert SQL data analyst. 
    Given the following database schema description:
    {schema_description}
    
    Write a valid, read-only SQL query to answer this user question: "{question}"
    Return ONLY the raw SQL query inside a markdown code block. No extra commentary.
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    sql_query = response.text.replace("```sql", "").replace("```", "").strip()
    
    try:
        engine = create_engine(db_connection_string)
        with engine.connect() as connection:
            result_df = pd.read_sql(text(sql_query), connection)
            return {
                "success": True,
                "sql_query": sql_query,
                "data": result_df.to_dict(orient="records")
            }
    except Exception as e:
        return {
            "success": False,
            "sql_query": sql_query,
            "error": str(e)
        }