# StatIQ Production & Local Deployment Guide

## System Requirements
* **RAM:** Minimum 8 GB (16 GB recommended)
* **OS:** Windows 10/11, Ubuntu 22.04 LTS, or macOS
* **Runtime:** Java 21+, Node.js 18+, Python 3.11+, PostgreSQL 15+

## Environment Variables
Review `.env.example` in the repository root. Key variables include:
* `SPRING_DATASOURCE_URL`: PostgreSQL JDBC URL (`jdbc:postgresql://localhost:5432/statiq`)
* `JWT_SECRET`: Base64-encoded secret key for token signing
* `AI_PROVIDER`: `mock` (default offline) or `gemini` / `openai`
* `IGOT_PROVIDER_TYPE`: `MOCK` (standard for hackathon evaluation)

## Multi-Service Startup Procedure

### 1. Database Initialization
Ensure PostgreSQL is active and create the target database:
```bash
psql -U postgres -h localhost -c "CREATE DATABASE statiq;"
```

### 2. Core Backend Service (Spring Boot)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/statiq-backend-1.0.0.jar
# Runs on port 8080. Flyway runs automatically on startup.
```

### 3. AI Microservice (Python FastAPI)
```bash
cd ai-service
python -m venv venv
# Activate virtual environment
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Single-Page Application (Frontend)
```bash
cd frontend
npm install
npm run build
npm run preview -- --port 5173
```
