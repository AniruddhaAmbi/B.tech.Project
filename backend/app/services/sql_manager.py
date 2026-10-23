import pandas as pd
from sqlalchemy import create_engine, text
from google import genai
from app.config import settings

class SQLManagerService:
    def __init__(self, db_connection_string: str):
        # Create SQLAlchemy engine (read-only safe practices can be enforced here)
        self.engine = create_engine(db_connection_string)

    def get_schema_description(self) -> str:
        """Automatically inspects database tables and columns to build a schema prompt for Gemini."""
        schema_info = []
        try:
            with self.engine.connect() as connection:
                # Reflect tables using SQLAlchemy or raw SQL depending on DB type
                query = text("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public';")
                # Fallback for SQLite if needed, but let's use generic inspection
                inspector = pd.read_sql("SELECT name FROM sqlite_master WHERE type='table';", connection) if "sqlite" in str(self.engine.url) else None
                
                if "sqlite" in str(self.engine.url):
                    tables = inspector['name'].tolist()
                    for table in tables:
                        cols = pd.read_sql(f"PRAGMA table_info({table});", connection)
                        col_str = ", ".join([f"{row['name']} ({row['type']})" for _, row in cols.iterrows()])
                        schema_info.append(f"Table: {table} | Columns: {col_str}")
                else:
                    df_schema = pd.read_sql("SELECT table_name, column_name, data_type FROM information_schema.columns;", connection)
                    for table, group in df_schema.groupby('table_name'):
                        col_str = ", ".join([f"{row['column_name']} ({row['data_type']})" for _, row in group.iterrows()])
                        schema_info.append(f"Table: {table} | Columns: {col_str}")
        except Exception as e:
            # Fallback mock schema if connection doesn't have standard metadata tables
            schema_info.append("Table: sales_data | Columns: order_id (int), customer_name (text), order_date (date), revenue (float), quantity (int)")

        return "\n".join(schema_info)

    def translate_and_execute(self, user_question: str) -> dict:
        schema = self.get_schema_description()
        
        # 1. Translate Natural Language to SQL using Gemini with robust real-world rules
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""
        You are an expert Text-to-SQL engine for SMEs. 
        Given the following database schema, write a clean, secure, read-only SQL query (SELECT statements only) to answer the user question.
        
        Important Guidelines for Real-World Data:
        - Make all text and category comparisons case-insensitive by using LOWER() on both the column and the value (e.g., WHERE LOWER(category) = LOWER('Electronics')).
        - Ensure numeric aggregations handle nulls or missing rows gracefully.
        
        Database Schema:
        {schema}

        User Question:
        {user_question}

        Return ONLY the raw SQL query string without markdown backticks or extra text.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        sql_query = response.text.strip().replace("```sql", "").replace("```", "").strip()

        # Safety check: Ensure it's a SELECT query
        if not sql_query.lower().startswith("select"):
            raise ValueError("Generated query is not a safe read-only SELECT statement.")

        # 2. Execute query against the connected database
        try:
            with self.engine.connect() as connection:
                df = pd.read_sql(text(sql_query), connection)
                result_data = df.to_dict(orient="records")
                return {
                    "sql_query": sql_query,
                    "rows_returned": len(result_data),
                    "data": result_data
                }
        except Exception as e:
            raise RuntimeError(f"SQL Execution Error: {str(e)}")