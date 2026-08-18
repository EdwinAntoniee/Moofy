from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.db.session import engine, Base
from app.api import auth, recommend, history, watchlist
from app.services.recommender import RecommenderService

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize Database Tables
    print("[Startup] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Warm up Recommender Service (Loads DistilBERT & ChromaDB)
    print("[Startup] Warming up RecommenderService...")
    RecommenderService.get_instance()
    print("[Startup] Moofy Backend is ready to serve!")
    yield
    print("[Shutdown] Cleaning up resources...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent emotion-aware movie recommendation platform backend",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development and flexible frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(recommend.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(watchlist.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Moofy API", "version": settings.VERSION}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
