from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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

    # If the user is logged in, automatically save this discovery to their Emotion History
    if current_user is not None:
        try:
            emotion_scores_dict = {item.emotion: item.score for item in response.emotion_breakdown}
            movies_list_dict = [m.model_dump() for m in response.movies]

            history_entry = EmotionSearchHistory(
                user_id=current_user.id,
                prompt=req.prompt,
                detected_emotion=response.primary_emotion,
                emotion_scores_json=json.dumps(emotion_scores_dict),
                recommendations_json=json.dumps(movies_list_dict),
                alpha=req.alpha
            )
            db.add(history_entry)
            db.commit()
        except Exception as e:
            print(f"[Warning] Failed to log emotion search history: {e}")
            db.rollback()

    return response
