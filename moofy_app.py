import os
import sys
from pathlib import Path

# Disable Gradio telemetry to prevent premature container shutdown signals
os.environ["GRADIO_ANALYTICS_ENABLED"] = "False"

# Add backend directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / "backend"))

import gradio as gr
from app.main import app as fastapi_app

def check_api_status():
    return "Moofy Emotion-Aware Cinema API is running and healthy."

with gr.Blocks(title="Moofy API") as demo:
    gr.Markdown("# 🎬 Moofy Backend API Server")
    gr.Markdown("FastAPI backend with fine-tuned DistilBERT NLP + ChromaDB vector retrieval.")
    status_btn = gr.Button("Check Status")
    status_out = gr.Textbox(label="API Status")
    status_btn.click(fn=check_api_status, inputs=[], outputs=status_out)

# Mount Gradio interface onto FastAPI app at /gradio
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
