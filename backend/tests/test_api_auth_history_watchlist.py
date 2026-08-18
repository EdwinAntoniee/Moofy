import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.db.session import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_guest_recommendation():
    response = client.post(
        "/api/recommend",
        json={"prompt": "I feel excited and full of energy", "alpha": 0.5, "top_k": 4}
    )
    assert response.status_code == 200
    data = response.json()
    assert "primary_emotion" in data
    assert len(data["movies"]) == 4
    assert data["alpha"] == 0.5

def test_auth_history_watchlist_flow():
    import uuid
    rand_suffix = str(uuid.uuid4())[:8]
    email = f"filmlover_{rand_suffix}@cinema.io"
    username = f"filmfan_{rand_suffix}"
    password = "secretpassword123"

    # 1. Register User
    reg_res = client.post(
        "/api/auth/register",
        json={"email": email, "username": username, "password": password}
    )
    assert reg_res.status_code == 201
    token_data = reg_res.json()
    token = token_data["access_token"]
    assert token is not None

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == username

    # 3. Authenticated Recommendation (should auto-save to history)
    rec_res = client.post(
        "/api/recommend",
        json={"prompt": "Looking for a heartbreaking drama that makes me cry", "alpha": 0.4, "top_k": 3},
        headers=headers
    )
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert len(rec_data["movies"]) == 3

    # 4. Check Emotion History
    hist_res = client.get("/api/history", headers=headers)
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["total"] >= 1
    assert hist_data["items"][0]["prompt"] == "Looking for a heartbreaking drama that makes me cry"

    # 5. Add Movie to Watchlist
    recommended_movie = rec_data["movies"][0]
    watch_res = client.post(
        "/api/watchlist",
        json={
            "movie_id": recommended_movie["movie_id"],
            "title": recommended_movie["title"],
            "poster_path": recommended_movie["poster_path"],
            "backdrop_path": recommended_movie["backdrop_path"],
            "overview": recommended_movie["overview"],
            "release_date": recommended_movie["release_date"],
            "vote_average": recommended_movie["vote_average"],
            "genres": recommended_movie["genres"],
            "emotion_label": recommended_movie["emotion_label"],
            "status": "plan_to_watch"
        },
        headers=headers
    )
    assert watch_res.status_code in [200, 201]

    # 6. Verify Watchlist Listing
    list_res = client.get("/api/watchlist", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 7. Update Watchlist Status to Watched
    patch_res = client.patch(
        f"/api/watchlist/{recommended_movie['movie_id']}",
        json={"status": "watched"},
        headers=headers
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "watched"

    # 8. Remove from Watchlist
    del_res = client.delete(
        f"/api/watchlist/{recommended_movie['movie_id']}",
        headers=headers
    )
    assert del_res.status_code == 204
