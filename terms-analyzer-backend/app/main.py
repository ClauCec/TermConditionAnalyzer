from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import analyzer
from app.core.config import settings

app = FastAPI(
    title="Terms Analyzer API",
    description="API for analyzing terms and conditions using Mistral AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyzer.router, prefix="/api/v1", tags=["analyzer"])

@app.get("/")
async def root():
    return {"message": "Welcome to Terms Analyzer API"} 