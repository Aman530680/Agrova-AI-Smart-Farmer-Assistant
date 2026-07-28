from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.chatbot import router as chatbot_router
from app.api.pest import router as pest_router
from app.api.weather import router as weather_router
from app.api.market import router as market_router
from app.api.crop import router as crop_router
from app.api.schemes import router as schemes_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api")
app.include_router(pest_router, prefix="/api")
app.include_router(weather_router, prefix="/api")
app.include_router(market_router, prefix="/api")
app.include_router(crop_router, prefix="/api")
app.include_router(schemes_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "message": "Welcome to the Agrova AI Farmer Query API portal."
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
