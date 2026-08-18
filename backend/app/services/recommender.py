import json
import pickle
import re
import torch
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from sentence_transformers import SentenceTransformer
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import chromadb

from app.core.config import settings, MODELS_DIR, CHROMA_DB_DIR, ENRICHED_METADATA_FILE, MOVIES_CSV_FILE
from app.schemas.recommend import RecommendResponse, MovieCard, EmotionScore

# Comprehensive adult, erotic, NSFW and explicit content keywords to strictly filter out
ADULT_KEYWORDS = [
    r'\bxxx\b', r'erotic', r'\bporn', r'\bhentai\b', r'\bsoftcore\b', r'\bhardcore\b',
    r'\bhooker\b', r'\bstripper\b', r'\bstriptease\b', r'\bplayboy\b', r'\bvixen\b', r'\bprostitute\b',
    r'\bsex\b', r'\bsexual', r'\bseduction\b', r'\billicit\b', r'\bsensual',
    r'\btaboo\b', r'\bnude\b', r'\bnudity\b', r'\bbrothel\b', r'\bescort\b', r'\borgy\b',
    r'\blust\b', r'\bpeepshow\b', r'\bbondage\b', r'\bfetish\b'
]
ADULT_REGEX = re.compile('|'.join(ADULT_KEYWORDS), re.IGNORECASE)

class RecommenderService:
    _instance = None

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[RecommenderService] Initializing on device: {self.device}")

        # 1. Load DistilBERT Emotion Classifier
        print(f"[RecommenderService] Loading DistilBERT from {MODELS_DIR}")
        self.tokenizer = DistilBertTokenizer.from_pretrained(str(MODELS_DIR))
        self.distilbert_model = DistilBertForSequenceClassification.from_pretrained(str(MODELS_DIR))
        self.distilbert_model.to(self.device)
        self.distilbert_model.eval()

        with open(MODELS_DIR / "label_encoder.pkl", "rb") as f:
            self.label_encoder = pickle.load(f)
        self.emotion_classes = list(self.label_encoder.classes_)

        # 2. Load Sentence-BERT
        print("[RecommenderService] Loading SentenceTransformer all-MiniLM-L6-v2")
        self.sbert_model = SentenceTransformer("all-MiniLM-L6-v2")

        # 3. Connect to ChromaDB
        print(f"[RecommenderService] Connecting to ChromaDB at {CHROMA_DB_DIR}")
        self.chroma_client = chromadb.PersistentClient(path=str(CHROMA_DB_DIR))
        self.collection = self.chroma_client.get_or_create_collection(name="movie_synopses")
        print(f"[RecommenderService] ChromaDB collection count: {self.collection.count()}")

        # 4. Load Enriched Metadata
        self.enriched_metadata: Dict[str, dict] = {}
        if ENRICHED_METADATA_FILE.exists():
            with open(ENRICHED_METADATA_FILE, "r", encoding="utf-8") as f:
                self.enriched_metadata = json.load(f)
            print(f"[RecommenderService] Loaded {len(self.enriched_metadata)} enriched movie records.")
        else:
            if MOVIES_CSV_FILE.exists():
                df = pd.read_csv(MOVIES_CSV_FILE)
                for _, row in df.iterrows():
                    m_id = str(row["movie_id"])
                    self.enriched_metadata[m_id] = {
                        "movie_id": int(row["movie_id"]),
                        "title": row["title"],
                        "overview": row["overview"],
                        "poster_path": None,
                        "backdrop_path": None,
                        "release_date": "",
                        "vote_average": 7.0,
                        "vote_count": 100,
                        "genres": [],
                        "emotion_label": row["emotion_label"]
                    }

    @classmethod
    def get_instance(cls) -> "RecommenderService":
        if cls._instance is None:
            cls._instance = RecommenderService()
        return cls._instance

    def is_safe_and_high_quality(self, title: str, overview: str, vote_avg: float, vote_count: int) -> bool:
        """Filter out adult/erotic content, unvetted placeholder releases, and very low quality films."""
        # 1. Quality threshold: Must have rating >= 5.8 and at least 15 votes
        if vote_avg < 5.8 or vote_count < 15:
            return False

        # 2. Adult / Explicit content filter
        combined_text = f"{title} {overview}"
        if ADULT_REGEX.search(combined_text):
            return False

        return True

    def predict_emotion(self, text: str) -> Tuple[str, Dict[str, float], List[EmotionScore]]:
        """Predict emotion probabilities for an emotion prompt."""
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        ).to(self.device)

        with torch.no_grad():
            outputs = self.distilbert_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]

        pred_idx = int(np.argmax(probs))
        primary_emotion = self.emotion_classes[pred_idx]

        emotion_dict = {}
        breakdown = []
        
        # Sort emotions by probability descending
        sorted_indices = np.argsort(probs)[::-1]
        for idx in sorted_indices:
            emo_name = self.emotion_classes[idx]
            prob = float(probs[idx])
            emotion_dict[emo_name] = prob
            breakdown.append(EmotionScore(
                emotion=emo_name,
                score=round(prob, 4),
                percentage=int(round(prob * 100))
            ))

        return primary_emotion, emotion_dict, breakdown

    def recommend(
        self,
        prompt: str,
        alpha: float = 0.5,
        top_k: int = 12,
        filter_emotion: Optional[str] = None
    ) -> RecommendResponse:
        """
        Execute high-quality hybrid recommendation:
        1. Predict query emotion distribution via DistilBERT
        2. Compute dense query embedding via Sentence-BERT
        3. Query ChromaDB for candidate movies
        4. Apply Adult & Quality filters (Rating >= 5.8, Votes >= 15, no explicit keywords)
        5. Calculate hybrid score: Score = alpha * SemanticSim + (1 - alpha) * EmotionResonance
        6. Return top-K MovieCards
        """
        primary_emotion, emotion_dict, breakdown = self.predict_emotion(prompt)

        # 2. Encode query via Sentence-BERT
        user_embedding = self.sbert_model.encode(prompt).tolist()

        # 3. Retrieve Candidate Pool from ChromaDB
        n_candidates = min(max(top_k * 6, 80), self.collection.count())
        
        where_filter = None
        if filter_emotion and filter_emotion in self.emotion_classes:
            where_filter = {"emotion": filter_emotion}

        query_params = {
            "query_embeddings": [user_embedding],
            "n_results": n_candidates
        }
        if where_filter:
            query_params["where"] = where_filter

        query_results = self.collection.query(**query_params)

        candidate_ids = query_results["ids"][0]
        candidate_docs = query_results["documents"][0]
        candidate_metas = query_results["metadatas"][0]
        candidate_distances = query_results["distances"][0]

        scored_movies: List[MovieCard] = []

        for i, (m_id_str, doc, meta, dist) in enumerate(zip(candidate_ids, candidate_docs, candidate_metas, candidate_distances)):
            meta_enriched = self.enriched_metadata.get(str(m_id_str), {})
            title = meta_enriched.get("title", meta.get("title", "Untitled"))
            overview = meta_enriched.get("overview", doc)
            vote_average = float(meta_enriched.get("vote_average", 7.0))
            vote_count = int(meta_enriched.get("vote_count", 100))

            # Quality and Adult Safety Filter
            if not self.is_safe_and_high_quality(title, overview, vote_average, vote_count):
                continue

            semantic_sim = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
            movie_emotion = meta.get("emotion", "Joy")
            emotion_resonance = emotion_dict.get(movie_emotion, 0.0)
            hybrid_score = (alpha * semantic_sim) + ((1.0 - alpha) * emotion_resonance)

            poster_path = meta_enriched.get("poster_path")
            backdrop_path = meta_enriched.get("backdrop_path")
            release_date = meta_enriched.get("release_date", "")
            genres = meta_enriched.get("genres", [])

            card = MovieCard(
                movie_id=int(m_id_str),
                title=title,
                overview=overview,
                poster_path=poster_path,
                backdrop_path=backdrop_path,
                release_date=release_date,
                vote_average=vote_average,
                vote_count=vote_count,
                genres=genres,
                emotion_label=movie_emotion,
                semantic_similarity=round(semantic_sim, 4),
                emotion_resonance=round(emotion_resonance, 4),
                hybrid_score=round(hybrid_score, 4)
            )
            scored_movies.append(card)

        # Sort initially by hybrid score
        scored_movies.sort(key=lambda x: x.hybrid_score, reverse=True)
        top_movies = scored_movies[:top_k]

        return RecommendResponse(
            prompt=prompt,
            primary_emotion=primary_emotion,
            emotion_breakdown=breakdown,
            alpha=alpha,
            total_results=len(top_movies),
            movies=top_movies
        )
