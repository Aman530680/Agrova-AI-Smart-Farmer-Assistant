import os
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()


class Settings:
    PROJECT_NAME: str = "Agrova AI Farmer Query"
    API_V1_STR: str = "/api"

    # Local persistence
    USE_IN_MEMORY_STORE: bool = os.getenv("USE_IN_MEMORY_STORE", "true").lower() == "true"

    # JWT Security Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # API Integration Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")


settings = Settings()
