from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Terms Analyzer"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]  # Add your frontend URL
    
    # Mistral AI Configuration
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
    
    # API Security
    API_KEY_HEADER: str = "X-API-Key"
    API_KEY: str = os.getenv("API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings() 