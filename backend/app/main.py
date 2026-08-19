import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings, BASE_DIR
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
cors_env = os.getenv("CORS_ORIGINS", "*")
cors_origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(recommend.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(watchlist.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Moofy API", "version": settings.VERSION}

# Optional: Serve production frontend build if dist folder exists
frontend_dist = BASE_DIR / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="static")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
