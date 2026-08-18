from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any
from datetime import datetime
from app.schemas.recommend import MovieCard, EmotionScore

class HistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    prompt: str
    detected_emotion: str
    emotion_scores: List[EmotionScore]
    recommendations: List[MovieCard]
    alpha: float
    created_at: datetime

class HistoryListResponse(BaseModel):
    total: int
    items: List[HistoryItem]
