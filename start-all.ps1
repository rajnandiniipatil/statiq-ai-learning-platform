# StatIQ Platform Launcher (PowerShell)
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Launching StatIQ Platform (SIH26101) - All Microservices" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

Write-Host "1. Starting AI Microservice on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "2. Starting Spring Boot Backend on http://localhost:8080 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; & 'C:\Users\HOME\maven\apache-maven-3.9.9\bin\mvn.cmd' spring-boot:run"

Start-Sleep -Seconds 5

Write-Host "3. Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; cmd /c 'npm run dev'"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "StatIQ Platform is starting up!" -ForegroundColor Green
Write-Host "- Frontend UI:  http://localhost:5173" -ForegroundColor White
Write-Host "- Backend API:  http://localhost:8080/api" -ForegroundColor White
Write-Host "- AI Engine:    http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials (Password: Statiq@2025):" -ForegroundColor Cyan
Write-Host "• Learner:  learner@statiq.gov" -ForegroundColor White
Write-Host "• Trainer:  trainer@statiq.gov" -ForegroundColor White
Write-Host "• Admin:    admin@statiq.gov" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
