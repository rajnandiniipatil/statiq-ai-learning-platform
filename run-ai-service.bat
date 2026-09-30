@echo off
echo ===================================================
echo Starting StatIQ AI Microservice (FastAPI)...
echo Port: 8000
echo ===================================================
cd ai-service
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
