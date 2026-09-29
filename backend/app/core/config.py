import os
from pathlib import Path
from dotenv import load_dotenv

# Search current directory, backend directory, and workspace root for .env
for env_candidate in [
    Path.cwd() / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent.parent / ".env",
]:
    if env_candidate.exists():
        load_dotenv(dotenv_path=env_candidate)
        break


class Settings:
    PROJECT_NAME: str = "Agrova AI Farmer Query"
    API_V1_STR: str = "/api"

    # Database Configuration
    USE_IN_MEMORY_STORE: bool = os.getenv("USE_IN_MEMORY_STORE", "false").lower() == "true"
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "agrova_kisan_mitra")

    # JWT Security Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # API Integration Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")


settings = Settings()
