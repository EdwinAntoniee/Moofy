from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.session import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    movie_id = Column(Integer, nullable=False, index=True)
    title = Column(String, nullable=False)
    poster_path = Column(String, nullable=True)
    backdrop_path = Column(String, nullable=True)
    overview = Column(Text, nullable=True)
    release_date = Column(String, nullable=True)
    vote_average = Column(Float, default=0.0)
    genres_json = Column(Text, default="[]")  # JSON string of list of genre names
    emotion_label = Column(String, nullable=True)
    status = Column(String, default="plan_to_watch")  # 'plan_to_watch' or 'watched'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="watchlist_items")

    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_user_movie"),
    )
