# ============================================================
# Stage 1: Build React Frontend
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Python Backend Runtime (Hugging Face Spaces Ready)
# ============================================================
FROM python:3.10-slim AS backend-runtime

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user (UID 1000 required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONPATH=/app/backend \
    PORT=7860 \
    HF_HOME=/tmp/cache/huggingface

# Copy application code and datasets
COPY --chown=user:user backend/ ./backend/
COPY --chown=user:user data/ ./data/
COPY --chown=user:user models/ ./models/
COPY --chown=user:user assets/ ./assets/

# Copy compiled frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder --chown=user:user /app/frontend/dist ./frontend/dist

# Set permissions
RUN chown -R user:user /app && chmod -R 777 /app

# Switch to non-root user
USER user

# Expose standard Hugging Face Spaces port
EXPOSE 7860

# Start FastAPI application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
