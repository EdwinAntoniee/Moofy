# Moofy — Emotion-Aware Cinema Recommendation Platform

<p align="center">
  <img src="assets/branding/logo_source.png" alt="Moofy Logo" width="140" />
</p>

<p align="center">
  <strong>Translating human sentiment into resonant cinema through fine-tuned NLP & vector embeddings.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Features</a> •
  <a href="#machine-learning-architecture">ML Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quickstart--installation">Quickstart</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api-reference">API Docs</a>
</p>

---

## 🎬 Overview

**Moofy** is an intelligent, full-stack movie discovery platform designed around human emotion. Rather than relying solely on generic genre tags or static popularity algorithms, Moofy analyzes natural-language prompts expressing how a user is feeling (*"I had an exhausting week and need something comforting and warm"*) and translates that emotional nuance into resonant film recommendations.

The platform blends:
1. **Fine-tuned DistilBERT Emotion Classifier** predicting a 6-class probability distribution across *Joy, Sadness, Anger, Fear, Love, and Surprise*.
2. **Sentence-BERT (`all-MiniLM-L6-v2`) + ChromaDB Vector Engine** performing high-dimensional semantic search over the TMDB movie corpus.
3. **Adaptive Hybrid Scoring Engine** allowing users to dynamically balance emotional resonance against plot semantics.
4. **Editorial Aesthetic** inspired by classic 35mm film archives and modern editorial typography.

---

## ✨ Key Features

* **🎭 Natural Language Emotion Detection**: Express sentiments freely in plain English. The fine-tuned transformer predicts the primary mood and probability breakdown across 6 core emotions.
* **🎛️ Dynamic Recommendation Focus**: Real-time slider adjusting the synthesis between **Mood Focus** (emotional resonance) and **Plot Focus** (semantic plot alignment).
* **📼 35mm Film Tape Visualizer**: Ambient dual-tape 35mm film background streaming 56 high-resolution cinematic backdrops.
* **🛡️ Content Safety & Quality Filtering**: Automatic filtering rejecting adult/erotic content and unvetted placeholder releases (enforcing minimum quality rating and vote thresholds).
* **👤 Guest vs. Authenticated User Flows**:
  * **Guest Mode**: Instant zero-friction emotion search and film exploration.
  * **Authenticated Mode**: Automatically archived **Moods History** timeline, deduplicated re-explorations, and personal **Watchlist & Queue** manager (with distinct *Queue*, *Watched*, and *Unwatch* states).
* **📱 Fully Responsive**: Custom CSS grid and layout optimized across mobile phones, tablets, and wide monitors.

---

## 🧠 Machine Learning Architecture

```
User Sentiment Prompt ("Feeling melancholic after a long rainy day...")
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[DistilBERT Classifier]   [Sentence-BERT (MiniLM)]
       │                         │
6-Emotion Probability     768-dim Embedding Vector
Distribution Breakdown           │
       │                  [ChromaDB Vector Store]
       │                  Semantic Cosine Retrieval
       │                         │
       └────────────┬────────────┘
                    ▼
     [Adaptive Hybrid Scoring Engine]
     Score = α · SemanticSim + (1 - α) · EmotionScore
                    │
     [Quality & Adult Safety Gate]
     Rating ≥ 5.8, Votes ≥ 15, Adult Regex Filter
                    │
                    ▼
     Top-K Curated Film Recommendations
```

### Hybrid Score Formulation
$$\text{Score} = \alpha \cdot \text{SemanticSim}(\vec{u}, \vec{m}) + (1 - \alpha) \cdot P(\text{Emotion}_m \mid \text{Prompt})$$
* **$\alpha = 0.0$**: Pure Emotional Resonance (matches movies that strictly mirror the detected emotional state).
* **$\alpha = 0.5$**: Balanced Synthesis (50% Emotion / 50% Plot semantics).
* **$\alpha = 1.0$**: Pure Semantic Search (matches movies strictly by plot synopsis alignment).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend API** | **FastAPI**, **Uvicorn**, **Pydantic v2**, **SQLAlchemy** (SQLite) |
| **Machine Learning** | **PyTorch**, **Hugging Face Transformers** (DistilBERT), **Sentence-Transformers** (`all-MiniLM-L6-v2`), **ChromaDB** |
| **Frontend UI** | **React 18**, **Vite**, **Lucide React**, **CSS3 Tokens** (`Bodoni Moda`, `Inter`, `JetBrains Mono`) |
| **Security & Auth** | **JWT** (JSON Web Tokens), **Passlib** (PBKDF2/Bcrypt) |
| **DevOps & Containers** | **Docker** (Multi-Stage Build), **Docker Compose**, **Vercel** (`vercel.json`) |

---

## 🚀 Quickstart & Installation

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Clone Repository
```bash
git clone https://github.com/EdwinAntoniee/Moofy.git
cd Moofy
```

### 2. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Backend Server (runs on http://localhost:8000)
python run_app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App is live at http://localhost:5173
```

---

## 🐳 Docker Deployment (1-Click)

Moofy includes a multi-stage production Docker configuration that compiles the React frontend and packages the FastAPI backend into a single lightweight container.

```bash
# Build and run containerized application
docker compose up --build
```
Access the application at `http://localhost:8000`.

---

## 🌐 Cloud Deployment Options

### Option A: Full-Stack Docker Container (Render, Railway, Fly.io, Cloud VPS)
* Deploy the included `Dockerfile` directly.
* Set environment variable: `PORT=8000`, `JWT_SECRET_KEY=<your-secret-key>`.

### Option B: Decoupled Architecture (Vercel + Cloud Backend)
1. **Frontend (Vercel)**:
   * Set Root Directory to `frontend`.
   * Add Environment Variable: `VITE_API_URL=https://your-backend-domain.com/api`.
   * Framework Preset: `Vite`.
2. **Backend (Render / Railway / Hugging Face Spaces)**:
   * Build command: `pip install -r requirements.txt`.
   * Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`.
   * Set `CORS_ORIGINS=https://your-frontend.vercel.app`.

---

## 📚 API Reference

### Health Check
* `GET /health` — Returns API service status and version.

### Recommendation
* `POST /api/recommend`
  ```json
  {
    "prompt": "I want an emotional, reflective story set in space",
    "alpha": 0.5,
    "top_k": 4,
    "filter_emotion": "ALL"
  }
  ```

### Authentication
* `POST /api/auth/register` — Create account (`email`, `username`, `password`).
* `POST /api/auth/login` — Sign in and receive JWT bearer token.
* `GET /api/auth/me` — Retrieve current authenticated user profile.

### Moods History
* `GET /api/history` — Get user's logged sentiment search history timeline.
* `DELETE /api/history/{id}` — Delete a specific history entry.
* `DELETE /api/history` — Clear all search history.

### Watchlist & Queue
* `GET /api/watchlist` — Retrieve saved movies (`status=all`, `plan_to_watch`, `watched`).
* `POST /api/watchlist` — Add film to queue or mark as watched.
* `PATCH /api/watchlist/{movie_id}` — Update status (`plan_to_watch` $\leftrightarrow$ `watched`).
* `DELETE /api/watchlist/{movie_id}` — Remove film from watchlist.

---

## 📄 License & Acknowledgments
* TMDB dataset & imagery provided in accordance with TMDB API terms.
* Fine-tuned on Google Research's **GoEmotions** corpus and curated film synopses.
