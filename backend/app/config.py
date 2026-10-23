from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    MONGODB_URL: str
    DB_NAME: str = "dociq_db"
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str = "dociq-index"
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
