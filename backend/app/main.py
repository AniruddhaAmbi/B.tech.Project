from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings
from app.routers import sources
from app.routers import sql_analyst
from app.routers import reports
from app.routers.analyst_test import router as test_router

app = FastAPI(
    title="DocIQ Backend API",
    version="1.0.0",
    description="AI-powered Document Intelligence & Multi-Source Analytics Backend"
)

# Enable CORS for your frontend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB on startup: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {
        "message": "Welcome to DocIQ API",
        "status": "active",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# start from here 
app.include_router(sources.router)
app.include_router(sql_analyst.router)
app.include_router(reports.router)
app.include_router(test_router)