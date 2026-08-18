from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class EmotionSearchHistory(Base):
    __tablename__ = "emotion_search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    detected_emotion = Column(String, nullable=False)
    emotion_scores_json = Column(Text, nullable=False)  # JSON string of {emotion: score}
    recommendations_json = Column(Text, nullable=False)  # JSON string of list of movie dicts
    alpha = Column(Float, default=0.5)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="history_entries")
