import pytest
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.recommender import RecommenderService

def test_recommender_service_emotion_prediction():
    service = RecommenderService.get_instance()
    prompt = "I just got promoted at work and I want to celebrate with pure joy!"
    primary_emo, emo_dict, breakdown = service.predict_emotion(prompt)

    assert primary_emo in ["Joy", "Love", "Surprise", "Sadness", "Fear", "Anger"]
    assert "Joy" in emo_dict
    assert len(breakdown) == 6
    assert sum([b.score for b in breakdown]) > 0.95

def test_recommender_service_hybrid_ranking():
    service = RecommenderService.get_instance()
    prompt = "A spooky, thrilling adventure exploring dark caves"
    res = service.recommend(prompt=prompt, alpha=0.6, top_k=6)

    assert res.total_results == 6
    assert len(res.movies) == 6
    assert res.alpha == 0.6
    # Verify scores are sorted in descending order
    scores = [m.hybrid_score for m in res.movies]
    assert scores == sorted(scores, reverse=True)

    # Verify movie fields
    first_movie = res.movies[0]
    assert first_movie.movie_id > 0
    assert len(first_movie.title) > 0
    assert first_movie.emotion_label in service.emotion_classes
