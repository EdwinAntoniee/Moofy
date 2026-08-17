"""
CinemaIO — Personalized Movie Recommendation via Multi-Emotion NLP
=================================================================
Deployment script for Streamlit.
Backend: DistilBERT (fine-tuned) for emotion classification
          TF-IDF + Cosine Similarity for contextual recommendation
Dataset: IMDb Top 1000 movies with self-labeled emotion tags
"""

import streamlit as st
import pandas as pd
import numpy as np
import pickle
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import warnings

warnings.filterwarnings("ignore", module="transformers")

st.set_page_config(
    page_title="Cinema.io",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="collapsed",
)

CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
:root {
    --bg-base:        #0a0a0f;
    --bg-surface:     rgba(255,255,255,0.04);
    --bg-surface-2:   rgba(255,255,255,0.07);
    --bg-glass:       rgba(20,20,30,0.70);
    --border-subtle:  rgba(255,255,255,0.08);
    --border-glow:    rgba(255,255,255,0.15);
    --text-primary:   #F5F5F7;
    --text-secondary: #9898A6;
    --text-muted:     #5A5A6E;
    --accent:         #A78BFA;
    --accent-2:       #60A5FA;
    --accent-3:       #34D399;
    --danger:         #F87171;
    --warning:        #FBBF24;
    --radius-sm:      8px;
    --radius-md:      14px;
    --radius-lg:      20px;
    --radius-xl:      28px;
    --shadow-card:    0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset;
    --shadow-glow:    0 0 60px rgba(167,139,250,0.12);
    --font-display:   'DM Serif Display', Georgia, serif;
    --font-body:      'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --transition:     all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
html, body, [class*="css"] {
    font-family: var(--font-body) !important;
    background-color: var(--bg-base) !important;
    color: var(--text-primary) !important;
}
#MainMenu, footer, header,
[data-testid="stHeader"],
[data-testid="stToolbar"],
[data-testid="stDecoration"],
[data-testid="stStatusWidget"] { 
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    visibility: hidden !important;
}
.block-container,
[data-testid="stMainBlockContainer"],
[data-testid="stMain"],
[data-testid="stAppViewContainer"],
.stMainBlockContainer,
.main .block-container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    max-width: 100% !important;
}
html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
}

section[data-testid="stSidebar"] { display: none !important; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 2px; }
[data-testid="stAppViewContainer"],
[data-testid="stMain"] {
    background: var(--bg-base) !important;
    background-image:
        radial-gradient(ellipse 80% 50% at 20% -10%, rgba(167,139,250,0.10) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(96,165,250,0.07) 0%, transparent 60%) !important;
}

[data-testid="stMainBlockContainer"],
.block-container {
    padding-left: clamp(16px, 4vw, 60px) !important;
    padding-right: clamp(16px, 4vw, 60px) !important;
    padding-bottom: 80px !important;
    max-width: 100% !important;
}
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0 32px;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 0;
}
.navbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
}
.navbar-logo-mark {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 16px rgba(167,139,250,0.30);
}
.navbar-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: var(--text-primary);
}
.navbar-badge {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: 5px 12px;
    border-radius: 100px;
}
.hero {
    text-align: center;
    padding: 72px 0 56px;
}
.hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--accent);
    background: rgba(167,139,250,0.10);
    border: 1px solid rgba(167,139,250,0.20);
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
}

.hero-eyebrow::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
}

.hero-headline {
    font-family: var(--font-display);
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 400;
    line-height: 1.10;
    letter-spacing: -1.5px;
    color: var(--text-primary);
    margin-bottom: 20px;
}
.hero-headline em {
    font-style: italic;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.hero-subline {
    font-size: 17px;
    font-weight: 300;
    color: var(--text-secondary);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.65;
}
.typewriter-card {
    max-width: 780px;
    margin: 0 auto 32px;
    background: var(--bg-glass);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: 22px 32px;
    box-shadow: var(--shadow-card), var(--shadow-glow);
    font-size: 16px;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.7;
    min-height: 62px;
}
.typewriter-cursor {
    display: inline-block;
    color: var(--accent);
    font-weight: 300;
    margin-left: 1px;
    animation: blink 0.9s step-end infinite;
}
@keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
}
.input-label {
    max-width: 780px;
    margin: 0 auto 10px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-muted);
}
div[data-testid="stTextArea"] {
    max-width: 780px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    background: var(--bg-glass) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--border-subtle) !important;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
    padding: 24px 24px 16px !important;
    box-shadow: var(--shadow-card) !important; 
    transition: var(--transition) !important;
}
div[data-testid="stTextArea"]:hover {
    border-color: var(--border-glow) !important;
}
div[data-testid="stButton"] {
    max-width: 780px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    background: var(--bg-glass) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid var(--border-subtle) !important;
    border-top: none !important;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl) !important;
    padding: 4px 24px 24px !important;
    box-shadow: var(--shadow-card) !important;
    margin-bottom: 48px !important;
}


/* Override Streamlit textarea */
div[data-testid="stTextArea"] textarea {
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid var(--border-subtle) !important;
    border-radius: var(--radius-md) !important;
    color: var(--text-primary) !important;
    font-family: var(--font-body) !important;
    font-size: 16px !important;
    font-weight: 300 !important;
    line-height: 1.7 !important;
    resize: none !important;
    caret-color: var(--accent) !important;
    padding: 18px 20px !important;
    transition: var(--transition) !important;
}

div[data-testid="stTextArea"] textarea:focus {
    border-color: rgba(167,139,250,0.40) !important;
    box-shadow: 0 0 0 3px rgba(167,139,250,0.10) !important;
    background: rgba(255,255,255,0.06) !important;
    outline: none !important;
}
div[data-testid="stTextArea"] textarea::placeholder {
    color: var(--text-muted) !important;
    font-style: italic !important;
}

div[data-testid="stTextArea"] label { display: none !important; }
div[data-testid="stButton"] > button {
    width: 100% !important;
    background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%) !important;
    color: #FFFFFF !important;
    font-family: var(--font-body) !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    letter-spacing: 0.02em !important;
    border: none !important;
    border-radius: var(--radius-md) !important;
    padding: 14px 28px !important;
    height: auto !important;
    min-height: 52px !important;
    cursor: pointer !important;
    transition: all 0.20s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 4px 24px rgba(124,58,237,0.40), 0 1px 0 rgba(255,255,255,0.15) inset !important;
    margin-top: 18px !important;
}
div[data-testid="stButton"] > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 32px rgba(124,58,237,0.50), 0 1px 0 rgba(255,255,255,0.15) inset !important;
    filter: brightness(1.08) !important;
}
div[data-testid="stButton"] > button:active {
    transform: translateY(0px) !important;
    filter: brightness(0.95) !important;
}
.emotion-panel {
    max-width: 780px;
    margin: 0 auto 56px;
}
.emotion-panel-title {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 20px;
    padding-left: 4px;
}
.emotion-badge-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
}
.emotion-badge-main {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 24px;
    border-radius: var(--radius-lg);
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.1px;
    border: 1px solid;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
.emotion-context-text {
    font-size: 14px;
    font-weight: 300;
    color: var(--text-secondary);
    font-style: italic;
    flex: 1;
    min-width: 200px;
}
.emo-joy     { background: rgba(251,191,36,0.12);  border-color: rgba(251,191,36,0.25);  color: #FCD34D; }
.emo-sadness { background: rgba(96,165,250,0.12);   border-color: rgba(96,165,250,0.25);  color: #93C5FD; }
.emo-anger   { background: rgba(248,113,113,0.12);  border-color: rgba(248,113,113,0.25); color: #FCA5A5; }
.emo-fear    { background: rgba(167,139,250,0.12);  border-color: rgba(167,139,250,0.25); color: #C4B5FD; }
.emo-surprise{ background: rgba(52,211,153,0.12);   border-color: rgba(52,211,153,0.25);  color: #6EE7B7; }
.emo-love    { background: rgba(244,114,182,0.12);  border-color: rgba(244,114,182,0.25); color: #F9A8D4; }
.section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 28px;
}
.section-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 400;
    letter-spacing: -0.5px;
    color: var(--text-primary);
}
.section-count {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 400;
}
.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}
.movie-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 28px;
    box-shadow: var(--shadow-card);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    cursor: default;
    animation: card-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.movie-card:hover {
    border-color: var(--border-glow);
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset;
}
@keyframes card-in {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
}

.movie-card:nth-child(1) { animation-delay: 0.05s; }
.movie-card:nth-child(2) { animation-delay: 0.10s; }
.movie-card:nth-child(3) { animation-delay: 0.15s; }
.movie-card:nth-child(4) { animation-delay: 0.20s; }
.movie-card:nth-child(5) { animation-delay: 0.25s; }
.card-rank {
    position: absolute;
    top: 20px; right: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: 4px 9px;
    border-radius: 6px;
}
.card-rank.rank-1 { color: #FCD34D; border-color: rgba(251,191,36,0.25); background: rgba(251,191,36,0.08); }
.card-rank.rank-2 { color: #D1D5DB; border-color: rgba(209,213,219,0.20); background: rgba(209,213,219,0.06); }
.card-rank.rank-3 { color: #C9A84C; border-color: rgba(201,168,76,0.20); background: rgba(201,168,76,0.06); }

.card-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: var(--text-primary);
    margin-bottom: 14px;
    padding-right: 48px;
    line-height: 1.25;
}

.card-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 16px;
}

.genre-pill {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 4px 11px;
    border-radius: 100px;
    background: var(--bg-surface-2);
    border: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    white-space: nowrap;
}

.card-overview {
    font-size: 13.5px;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.65;
    margin-bottom: 22px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid var(--border-subtle);
    gap: 12px;
}

.similarity-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.similarity-bar-track {
    flex: 1;
    height: 4px;
    background: var(--bg-surface-2);
    border-radius: 2px;
    overflow: hidden;
}

.similarity-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    box-shadow: 0 0 8px rgba(167,139,250,0.5);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.similarity-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    min-width: 40px;
    text-align: right;
}
div[data-testid="stSpinner"] > div {
    color: var(--accent) !important;
}
.info-box {
    max-width: 780px;
    margin: 0 auto 32px;
    background: rgba(167,139,250,0.07);
    border: 1px solid rgba(167,139,250,0.18);
    border-radius: var(--radius-md);
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.6;
}
.empty-state {
    text-align: center;
    padding: 64px 32px;
    color: var(--text-muted);
}
.empty-state-icon { font-size: 42px; margin-bottom: 16px; }
.empty-state-text { font-size: 16px; font-weight: 300; }
.stTextArea label p { display: none; }
.divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 56px 0;
    max-width: 1200px;
}
.app-footer {
    text-align: center;
    padding: 32px 0 0;
    border-top: 1px solid var(--border-subtle);
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 300;
    max-width: 1200px;
    margin: 56px auto 0;
}
@media (max-width: 640px) {
    .movies-grid { grid-template-columns: 1fr; }
    .hero-headline { font-size: 36px; letter-spacing: -1px; }
    .input-card { padding: 24px 20px; }
}
</style>
"""

EMOTION_META = {
    "Joy":      {"emoji": "☀️", "css_class": "emo-joy",      "desc": "You're radiating warmth and optimism."},
    "Sadness":  {"emoji": "🌧️", "css_class": "emo-sadness",  "desc": "There's a quiet ache in your words."},
    "Anger":    {"emoji": "🔥", "css_class": "emo-anger",    "desc": "Something's burning — and rightfully so."},
    "Fear":     {"emoji": "🌑", "css_class": "emo-fear",     "desc": "Unease and tension thread through your thoughts."},
    "Surprise": {"emoji": "⚡", "css_class": "emo-surprise", "desc": "Something unexpected has shifted your world."},
    "Love":     {"emoji": "🌸", "css_class": "emo-love",     "desc": "Warmth and tenderness colour your feeling."},
}

from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="winniedepoo/emotion-movie-distilbert",
    tokenizer="winniedepoo/emotion-movie-distilbert"
)

DATA_PATH = "data/imdb_movies_with_emotions.csv"

@st.cache_resource(show_spinner=False)
@st.cache_resource(show_spinner=False)
def load_emotion_model():
    """Load model directly from Hugging Face Hub via pipeline."""
    classifier = pipeline(
        "text-classification",
        model="winniedepoo/emotion-movie-distilbert",
        tokenizer="winniedepoo/emotion-movie-distilbert"
    )
    return classifier

@st.cache_data(show_spinner=False)
def load_movie_data():
    """Load the self-labeled IMDb dataset and fit TF-IDF once."""
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["clean_overview", "Overview", "Series_Title"])
    df = df.reset_index(drop=True)

    tfidf = TfidfVectorizer(stop_words="english", max_features=15_000)
    tfidf.fit(df["clean_overview"].astype(str))

    return df, tfidf


def predict_emotion(text: str, classifier) -> str:
    result = classifier(text)
    raw_label = result[0]["label"]
    label_mapping = {
        "LABEL_0": "Anger",
        "LABEL_1": "Fear",
        "LABEL_2": "Joy",
        "LABEL_3": "Love",
        "LABEL_4": "Sadness",
        "LABEL_5": "Surprise"
    }
    emotion_name = label_mapping.get(raw_label, raw_label)
    return emotion_name

def recommend_movies(
    user_text: str,
    df: pd.DataFrame,
    tfidf: TfidfVectorizer,
    emotion: str,
    top_n: int = 5,
) -> pd.DataFrame:
    filtered = df[df["predicted_emotion"] == emotion].copy()
    if filtered.empty:
        return pd.DataFrame()

    user_vec = tfidf.transform([user_text])
    movie_vecs = tfidf.transform(filtered["clean_overview"].astype(str))
    scores = cosine_similarity(user_vec, movie_vecs).flatten()
    top_idx = scores.argsort()[-top_n:][::-1]

    result = filtered.iloc[top_idx][["Series_Title", "Genre", "Overview"]].copy()
    result["similarity_score"] = scores[top_idx]
    result = result.reset_index(drop=True)
    return result


def render_emotion_panel(emotion: str, user_text: str) -> str:
    meta = EMOTION_META.get(emotion, {"emoji": "🎭", "css_class": "", "desc": ""})
    return f"""
    <div class="emotion-panel">
        <div class="emotion-panel-title">Detected Emotional State</div>
        <div class="emotion-badge-row">
            <div class="emotion-badge-main {meta['css_class']}">
                <span style="font-size:20px">{meta['emoji']}</span>
                <span>{emotion}</span>
            </div>
            <div class="emotion-context-text">"{meta['desc']}"</div>
        </div>
    </div>
    """


def render_movie_card(row, rank: int) -> str:
    title = row["Series_Title"]
    overview = row["Overview"]
    genres = [g.strip() for g in str(row["Genre"]).split(",") if g.strip()]
    score = float(row["similarity_score"])
    pct = int(round(score * 100))
    bar_pct = min(int(score * 100 * 4), 100)

    rank_cls = f"rank-{rank}" if rank <= 3 else ""
    rank_label = {1: "🥇 Best Match", 2: "🥈 Runner Up", 3: "🥉 Top Pick"}.get(rank, f"#{rank}")

    genre_pills = "".join(
        f'<span class="genre-pill">{g}</span>' for g in genres[:4]
    )

    card_html = (
        f'<div class="movie-card">'
        f'<div class="card-rank {rank_cls}">{rank_label}</div>'
        f'<div class="card-title">{title}</div>'
        f'<div class="card-genres">{genre_pills}</div>'
        f'<div class="card-overview">{overview}</div>'
        f'<div class="card-footer">'
        f'<span class="similarity-label">Match</span>'
        f'<div class="similarity-bar-track">'
        f'<div class="similarity-bar-fill" style="style="width:{bar_pct}%""></div>'
        f'</div>'
        f'<span class="similarity-value">{pct}%</span>'
        f'</div>'
        f'</div>'
    )
    return card_html


def main():
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

    st.markdown("""
    <nav class="navbar">
        <div class="navbar-logo">
            <div class="navbar-logo-mark">🎬</div>
            <span class="navbar-title">Cinema.io</span>
        </div>
        <span class="navbar-badge">NLP · Emotion AI · IMDb Top 1000</span>
    </nav>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="hero" style="padding-bottom: 20px;">
        <div class="hero-eyebrow">Multi-Emotion Classification &amp; Semantic Matching</div>
        <h1 class="hero-headline">
            Films that feel<br>
            exactly <em>right</em> for you
        </h1>
    </div>
    """, unsafe_allow_html=True)

    import streamlit.components.v1 as components

    typewriter_code = """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap');
        
        body {
            background-color: transparent;
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .typewriter-card {
            max-width: 780px;
            margin: 0 auto;
            background: rgba(20,20,30,0.70);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 28px;
            padding: 22px 32px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset;
            font-size: 16px;
            font-weight: 300;
            color: #9898A6;
            line-height: 1.7;
            min-height: 62px;
            box-sizing: border-box;
            text-align: center;
        }
        .typewriter-cursor {
            display: inline-block;
            color: #A78BFA;
            font-weight: 300;
            margin-left: 1px;
            animation: blink 0.9s step-end infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
        }
    </style>
    
    <div class="typewriter-card">
        <span id="tw-text"></span><span class="typewriter-cursor">|</span>
    </div>

    <script>
    (function(){
        var msg = "Tell us how you’re feeling — in any words, any language of emotion. Our AI reads your mood and surfaces the five films that will resonate most.";
        var el = document.getElementById("tw-text");
        if (!el) return;
        var i = 0;
        
        function type(){ 
            if (i < msg.length) { 
                el.textContent += msg[i++]; 
                setTimeout(type, 26); // Kecepatan ngetik per huruf
            } else {
                // Setelah selesai mengetik, tunggu 3 detik baru reset & mulai lagi
                setTimeout(resetAndType, 3000);
            } 
        }

        function resetAndType() {
            el.textContent = ""; // Mengosongkan teks
            i = 0;               // Reset hitungan index huruf ke 0
            type();              // Mulai animasi mengetik kembali
        }

        setTimeout(type, 400); // Delay awal pas aplikasi pertama dibuka
    })();
    </script>
    """

    # Render komponen dengan tinggi pas agar responsif & tidak memicu scrollbar iframe
    components.html(typewriter_code, height=135, scrolling=False)

    st.markdown('<div class="input-label">How are you feeling right now?</div>', unsafe_allow_html=True)

    user_input = st.text_area(
        label="mood_input",
        placeholder=(
            "e.g. I feel completely lost after losing someone close to me, "
            "and I just want to be understood..."
        ),
        height=130,
        label_visibility="collapsed",
        key="user_mood_input",
    )

    analyze_clicked = st.button("✦  Discover My Movies", use_container_width=True)

    model_loaded = True
    try:
        classifier = load_emotion_model()
        df_movies, tfidf = load_movie_data()
    except Exception as e:
        model_loaded = False
        st.markdown(f"""
        <div class="info-box">
            ⚠️ <strong>Model loading failed.</strong> Please check your Hugging Face model name or internet connection.<br><br>
            <em>Error: {e}</em>
        </div>
        """, unsafe_allow_html=True)

    if analyze_clicked and model_loaded:
        raw_text = (user_input or "").strip()

        if len(raw_text) < 10:
            st.markdown("""
            <div class="info-box">
                💬 Please write a few more words so the model can understand your mood.
            </div>
            """, unsafe_allow_html=True)
        else:
            with st.spinner("Analysing your emotion…"):
                detected_emotion = predict_emotion(raw_text, classifier)

            # Emotion panel
            st.markdown(
                render_emotion_panel(detected_emotion, raw_text),
                unsafe_allow_html=True,
            )

            with st.spinner("Finding your perfect films…"):
                recommendations = recommend_movies(
                    raw_text, df_movies, tfidf, detected_emotion, top_n=5
                )

            if recommendations.empty:
                st.markdown("""
                <div class="empty-state">
                    <div class="empty-state-icon">🎭</div>
                    <div class="empty-state-text">
                        No matching films found for this emotion in our catalogue.
                        Try rephrasing your input.
                    </div>
                </div>
                """, unsafe_allow_html=True)
            else:
                # Section header
                n = len(recommendations)
                st.markdown(f"""
                <div class="section-header" style="max-width:1200px;margin:0 auto 28px">
                    <span class="section-title">Your Recommendations</span>
                    <span class="section-count">Top {n} films matched to <strong
                        style="color:var(--text-primary)">{detected_emotion}</strong></span>
                </div>
                """, unsafe_allow_html=True)

                # Build grid HTML
                cards_html = '<div class="movies-grid">'
                for i, (_, row) in enumerate(recommendations.iterrows(), start=1):
                    cards_html += render_movie_card(row, i)
                cards_html += "</div>"
                st.markdown(cards_html, unsafe_allow_html=True)

    elif not analyze_clicked:
        st.markdown("""
        <div class="empty-state" style="opacity:0.5">
            <div class="empty-state-icon">🌙</div>
            <div class="empty-state-text">Your story starts with a feeling.</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div class="app-footer">
        Built with DistilBERT · GoEmotions · IMDb Top 1000 
        
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
