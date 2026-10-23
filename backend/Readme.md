# 🚀 DocIQ Backend API

Welcome to the backend engine of **DocIQ**—an AI-powered Document Intelligence and Business Analytics platform designed to help SMEs effortlessly analyze documents, query spreadsheets, and run Text-to-SQL operations on relational databases.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python async web framework)
- **Primary Database:** MongoDB Atlas (Async connection via Motor)
- **Vector Search:** Pinecone (For high-speed semantic document retrieval)
- **AI / LLM Intelligence:** Google Gemini (`google-genai` SDK & embeddings)
- **Data Processing:** Pandas & OpenPyXL (Excel, CSV, and tabular parsing)

---

## 📂 Project Structure

```text
backend/
├── app/
│   ├── services/       # Core business logic (Gemini, Pinecone, RAG, Text-to-SQL)
│   ├── __init__.py
│   ├── config.py       # Environment and settings manager
│   ├── database.py     # MongoDB Atlas async client connection
│   └── main.py         # FastAPI application entry point
├── tests/              # Unit and integration tests
├── .env                # Private API keys and connection strings (Do not commit!)
├── requirements.txt    # Python dependencies
└── README.md           # You are here
```

## ⚙️ Getting Started (For Beginners)
1. Prerequisites
Make sure you have Python 3.10+ installed on your machine.

2. Set Up a Virtual Environment
Open your terminal inside the backend/ directory and run:
``` 
python -m venv .venv 
```
Activate the virtual environment:
- Windows (PowerShell):
    ```
    .\.venv\Scripts\Activate.ps1
    ```
- Mac / Linux:

    ```
    source .venv/bin/activate
    ```

3. Install Dependencies
    ```
    pip install -r requirements.txt
    ```
4. Configure Your Environment Variables
Create a ```.env``` file in the root of the ```backend/``` directory and add your credentials:
```
PORT=8000
MONGODB_URL=your_mongodb_atlas_connection_string
DB_NAME=dociq_db
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=dociq-index
GEMINI_API_KEY=your_google_gemini_api_key
```
5. Run the Server
Start the FastAPI development server with hot-reload enabled:

```
uvicorn app.main:app --reload --port 8000
```
Once running, open your browser and visit:
```
API Root: http://localhost:8000
```
Interactive Swagger Docs: ```http://localhost:8000/docs``` (where you can test all your endpoints live!)