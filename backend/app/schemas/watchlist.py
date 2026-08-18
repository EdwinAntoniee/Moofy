from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class WatchlistCreate(BaseModel):
    movie_id: int
    title: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = ""
    vote_average: float = 0.0
    genres: List[str] = []
    emotion_label: Optional[str] = None
    status: str = Field("plan_to_watch", pattern="^(plan_to_watch|watched)$")

class WatchlistUpdate(BaseModel):
    status: str = Field(..., pattern="^(plan_to_watch|watched)$")

class WatchlistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    movie_id: int
    title: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = ""
    vote_average: float = 0.0
    genres: List[str] = []
    emotion_label: Optional[str] = None
    status: str
    created_at: datetime

class WatchlistListResponse(BaseModel):
    total: int
    items: List[WatchlistResponse]
