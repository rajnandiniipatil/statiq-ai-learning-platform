@echo off
echo ===================================================
echo Starting StatIQ Spring Boot Backend...
echo Port: 8080
echo ===================================================
cd backend
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else (
    call "C:\Users\HOME\maven\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
)
pause
