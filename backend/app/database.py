from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from urllib.parse import urlparse, quote_plus

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

def get_sanitized_mongo_url(url: str) -> str:
    """Automatically URL-encode username and password if they contain special characters."""
    try:
        parsed = urlparse(url)
        if parsed.username and parsed.password:
            encoded_username = quote_plus(parsed.username)
            encoded_password = quote_plus(parsed.password)
            # Reconstruct netloc with encoded credentials
            host_port = parsed.hostname + (f":{parsed.port}" if parsed.port else "")
            if parsed.netloc.endswith(host_port) and "@" in parsed.netloc:
                # Has auth part
                new_netloc = f"{encoded_username}:{encoded_password}@{host_port}"
                if parsed.path:
                    new_netloc += parsed.path
                # Replace netloc in the url string safely
                return url.replace(parsed.netloc.split('@')[-1], host_port).replace(parsed.username, encoded_username).replace(parsed.password, encoded_password)
    except Exception:
        pass
    return url

async def connect_to_mongo():
    try:
        safe_url = get_sanitized_mongo_url(settings.MONGODB_URL)
        db_instance.client = AsyncIOMotorClient(safe_url)
        db_instance.db = db_instance.client[settings.DB_NAME]
        # Ping the server to verify connection
        await db_instance.client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB Atlas: {e}")
        raise e

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB Atlas connection.")

def get_database():
    if db_instance.db is None:
        raise RuntimeError("Database connection is not initialized. Check your MongoDB URI.")
    return db_instance.db