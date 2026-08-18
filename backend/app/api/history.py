from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.models.history import EmotionSearchHistory
from app.schemas.history import HistoryListResponse, HistoryItem
from app.schemas.recommend import MovieCard, EmotionScore
from app.api.deps import get_current_user

router = APIRouter(prefix="/history", tags=["Emotion History"])

@router.get("", response_model=HistoryListResponse)
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = (
        db.query(EmotionSearchHistory)
        .filter(EmotionSearchHistory.user_id == current_user.id)
        .order_by(EmotionSearchHistory.created_at.desc())
        .all()
    )

    items = []
    for entry in entries:
        try:
            scores_raw = json.loads(entry.emotion_scores_json)
            breakdown = [
                EmotionScore(
                    emotion=k,
                    score=float(v),
                    percentage=int(round(float(v) * 100))
                )
                for k, v in sorted(scores_raw.items(), key=lambda x: x[1], reverse=True)
            ]
        except Exception:
            breakdown = []

        try:
            movies_raw = json.loads(entry.recommendations_json)
            movie_cards = [MovieCard(**m) for m in movies_raw]
        except Exception:
            movie_cards = []

        items.append(
            HistoryItem(
                id=entry.id,
                prompt=entry.prompt,
                detected_emotion=entry.detected_emotion,
                emotion_scores=breakdown,
                recommendations=movie_cards,
                alpha=entry.alpha,
                created_at=entry.created_at
            )
        )

    return HistoryListResponse(total=len(items), items=items)

@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = (
        db.query(EmotionSearchHistory)
        .filter(EmotionSearchHistory.id == history_id, EmotionSearchHistory.user_id == current_user.id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History entry not found.")
    
    db.delete(entry)
    db.commit()
    return None

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(EmotionSearchHistory).filter(EmotionSearchHistory.user_id == current_user.id).delete()
    db.commit()
    return None
