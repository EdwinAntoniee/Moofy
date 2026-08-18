"""
Moofy Application Launcher
Runs FastAPI backend on port 8000 and React Vite frontend on port 5173 concurrently.
"""
import subprocess
import sys
import time
import os
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
PYTHON_EXE = BASE_DIR / "emovie" / "Scripts" / "python.exe"
if not PYTHON_EXE.exists():
    PYTHON_EXE = Path(sys.executable)

print("=" * 60)
print("[MOOFY] LAUNCHING MOOFY CINEMA APPLICATION")
print("=" * 60)

# 1. Start Backend (FastAPI)
print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
backend_proc = subprocess.Popen(
    [str(PYTHON_EXE), "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
    cwd=str(BASE_DIR / "backend")
)

time.sleep(2)

# 2. Start Frontend (Vite)
print("\n[2/2] Starting React Vite Frontend on http://localhost:5173 ...")
frontend_proc = subprocess.Popen(
    ["npm.cmd", "run", "dev"],
    cwd=str(BASE_DIR / "frontend"),
    shell=True
)

print("\n>>> Moofy is now running!")
print(">>> Frontend: http://localhost:5173")
print(">>> Backend API Docs: http://localhost:8000/docs")
print("\nPress Ctrl+C to stop both servers.\n")

try:
    backend_proc.wait()
    frontend_proc.wait()
except KeyboardInterrupt:
    print("\nStopping Moofy servers...")
    backend_proc.terminate()
    frontend_proc.terminate()
    print("Moofy stopped.")
