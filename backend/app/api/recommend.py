from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.history import EmotionSearchHistory
from app.schemas.recommend import RecommendRequest, RecommendResponse
from app.services.recommender import RecommenderService
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

@router.post("", response_model=RecommendResponse)
def get_recommendations(
    req: RecommendRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    recommender = RecommenderService.get_instance()
    response = recommender.recommend(
        prompt=req.prompt,
        alpha=req.alpha,
        top_k=req.top_k,
        filter_emotion=req.filter_emotion
    )

    # If the user is logged in, automatically save or update this discovery in their Emotion History
    if current_user is not None:
        try:
            emotion_scores_dict = {item.emotion: item.score for item in response.emotion_breakdown}
            movies_list_dict = [m.model_dump() for m in response.movies]
            clean_prompt = req.prompt.strip()

            # Check if an entry with the identical prompt already exists for this user
            existing_entry = (
                db.query(EmotionSearchHistory)
                .filter(
                    EmotionSearchHistory.user_id == current_user.id,
                    EmotionSearchHistory.prompt == clean_prompt
                )
                .first()
            )

            if existing_entry:
                # Update the existing entry with latest emotion, movies, alpha, and refresh timestamp
                existing_entry.detected_emotion = response.primary_emotion
                existing_entry.emotion_scores_json = json.dumps(emotion_scores_dict)
                existing_entry.recommendations_json = json.dumps(movies_list_dict)
                existing_entry.alpha = req.alpha
                existing_entry.created_at = datetime.utcnow()
            else:
                # Create a new unique history record
                history_entry = EmotionSearchHistory(
                    user_id=current_user.id,
                    prompt=clean_prompt,
                    detected_emotion=response.primary_emotion,
                    emotion_scores_json=json.dumps(emotion_scores_dict),
                    recommendations_json=json.dumps(movies_list_dict),
                    alpha=req.alpha,
                    created_at=datetime.utcnow()
                )
                db.add(history_entry)

            db.commit()
        except Exception as e:
            print(f"[Warning] Failed to log emotion search history: {e}")
            db.rollback()

    return response
