# The master router that orchestrates whether to query Pinecone (for documents) or SQL (for databases), passes the context to Gemini, and generates the structured JSON/text response for your dashboard and AI Analyst page.

from app.services.vector_store import query_pinecone
from app.services.sql_agent import text_to_sql_and_execute
from app.services.gemini import client

async def run_ai_analyst_query(question: str, data_source_type: str, workspace_id: str, source_identifier: str = "", extra_context: str = ""):
    """
    Multi-tenant analyst engine supporting dynamic companies/workspaces.
    """
    context = ""
    
    if data_source_type == "sql":
        sql_result = await text_to_sql_and_execute(question, source_identifier, extra_context)
        if sql_result["success"]:
            context = f"SQL Query Executed: {sql_result['sql_query']}\nResults Data: {sql_result['data']}"
        else:
            context = f"Error executing SQL query: {sql_result['error']}"
            
    elif data_source_type == "documents":
        # Uses dynamic workspace_id filtering for Pinecone search
        chunks = await query_pinecone(query_text=question, workspace_id=workspace_id, top_k=4)
        context = "\n---\n".join(chunks) if chunks else "No relevant document context found for this organization."

    prompt = f"""
    You are DocIQ, an elite enterprise AI Business Analyst designed to help SMEs evaluate metrics, customer behavior, and revenue trends.
    You are currently analyzing data for workspace/company: '{workspace_id}'.
    
    User Question: "{question}"
    
    Retrieved Business Context / Data:
    {context}
    
    Provide a professional, clear, and actionable business response tailored to this company.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "workspace_id": workspace_id,
        "question": question,
        "source_type": data_source_type,
        "insights": response.text,
        "raw_context_used": context
    }