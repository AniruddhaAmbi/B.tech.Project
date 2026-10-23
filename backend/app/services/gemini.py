from google import genai
from app.config import settings

# Initialize the official Google GenAI client
client = genai.Client(api_key=settings.GEMINI_API_KEY)