import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "StatIQ AI Intelligence Microservice"
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    port: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    
    # Provider options: mock | gemini | openai
    ai_provider: str = os.getenv("AI_PROVIDER", "mock")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
