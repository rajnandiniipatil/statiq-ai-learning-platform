@echo off
echo ================================================================
echo Launching StatIQ Platform (SIH26101) - All Microservices
echo ================================================================

echo 1. Starting AI Microservice on http://localhost:8000 ...
start "StatIQ AI Service (Port 8000)" cmd /c "run-ai-service.bat"

timeout /t 3 /nobreak > nul

echo 2. Starting Spring Boot Backend on http://localhost:8080 ...
start "StatIQ Backend (Port 8080)" cmd /c "run-backend.bat"

timeout /t 5 /nobreak > nul

echo 3. Starting React Frontend on http://localhost:5173 ...
start "StatIQ Frontend (Port 5173)" cmd /c "run-frontend.bat"

echo.
echo ================================================================
echo StatIQ Platform is starting up!
echo - Frontend UI:        http://localhost:5173
echo - Backend API:        http://localhost:8080/api
echo - AI Engine:          http://localhost:8000/docs
echo.
echo Demo Login Accounts:
echo - Learner:  learner@statiq.gov / Statiq@2025
echo - Trainer:  trainer@statiq.gov / Statiq@2025
echo - Admin:    admin@statiq.gov   / Statiq@2025
echo ================================================================
pause
