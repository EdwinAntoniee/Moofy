from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class RecommendRequest(BaseModel):
    prompt: str = Field(..., min_length=2, description="User's emotion prompt or mood query")
    alpha: float = Field(0.5, ge=0.0, le=1.0, description="Balance between Semantic Similarity (alpha) and Emotion Resonance (1 - alpha)")
    top_k: int = Field(12, ge=1, le=50, description="Number of movie recommendations to return")
    filter_emotion: Optional[str] = Field(None, description="Optional manual override to filter movies by a specific emotion")

class EmotionScore(BaseModel):
    emotion: str
    score: float
    percentage: int

class MovieCard(BaseModel):
    movie_id: int
    title: str
    overview: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = ""
    vote_average: float = 0.0
    vote_count: int = 0
    genres: List[str] = []
    emotion_label: str
    semantic_similarity: float = 0.0
    emotion_resonance: float = 0.0
    hybrid_score: float = 0.0

class RecommendResponse(BaseModel):
    prompt: str
    primary_emotion: str
    emotion_breakdown: List[EmotionScore]
    alpha: float
    total_results: int
    movies: List[MovieCard]
