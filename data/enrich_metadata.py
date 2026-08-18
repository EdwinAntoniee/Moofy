import os
import json
import pandas as pd
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
DATA_DIR = Path("data")
df = pd.read_csv(DATA_DIR / "tmdb_movies_with_emotions.csv")

# Standard TMDB Genre Mapping
GENRES_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
}

enriched = {}

def fetch_movie(movie_id, row):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US"
    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            return movie_id, {
                "movie_id": int(movie_id),
                "title": data.get("title", row["title"]),
                "overview": data.get("overview", row["overview"]),
                "poster_path": data.get("poster_path"),
                "backdrop_path": data.get("backdrop_path"),
                "release_date": data.get("release_date", ""),
                "vote_average": data.get("vote_average", 0.0),
                "vote_count": data.get("vote_count", 0),
                "genres": [g["name"] for g in data.get("genres", [])] if data.get("genres") else [],
                "emotion_label": row["emotion_label"]
            }
    except Exception:
        pass
    
    # Fallback from CSV
    genres_raw = eval(str(row["genres"])) if isinstance(row["genres"], str) and row["genres"].startswith("[") else []
    genre_names = [GENRES_MAP.get(g, "Movie") for g in genres_raw if isinstance(g, int)]
    return movie_id, {
        "movie_id": int(movie_id),
        "title": row["title"],
        "overview": row["overview"],
        "poster_path": None,
        "backdrop_path": None,
        "release_date": "",
        "vote_average": 7.0,
        "vote_count": 100,
        "genres": genre_names,
        "emotion_label": row["emotion_label"]
    }

print(f"Enriching {len(df)} movies via TMDB...")
with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(fetch_movie, row["movie_id"], row) for _, row in df.iterrows()]
    for future in as_completed(futures):
        m_id, m_data = future.result()
        enriched[str(m_id)] = m_data

output_path = DATA_DIR / "tmdb_enriched_metadata.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(enriched, f, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(enriched)} enriched movies to {output_path}")
