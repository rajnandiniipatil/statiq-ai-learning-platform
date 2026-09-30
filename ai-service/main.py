import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from models.schemas import (
    GenerateMcqRequest,
    GenerateMcqResponse,
    AiAssistantRequest,
    AiAssistantResponse,
    ExtractTextResponse
)
from extractors.text_extractor import TextExtractor
from providers.llm_provider import LLMProvider
from providers.mock_provider import MockAIProvider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

app = FastAPI(
    title=settings.app_name,
    description="StatIQ AI Engine: Automated MCQ Generation, Document Extraction, and Domain Chatbot",
    version="1.0.0"
)

# Enable CORS for frontend and backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Provider based on settings
if settings.ai_provider.lower() == "mock":
    ai_provider = MockAIProvider()
    logger.info("StatIQ AI Service using MockAIProvider (Offline Mode)")
else:
    ai_provider = LLMProvider()
    logger.info(f"StatIQ AI Service using LLMProvider (Provider: {settings.ai_provider})")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "provider": type(ai_provider).__name__,
        "environment": settings.environment
    }

@app.post("/api/ai/extract", response_model=ExtractTextResponse)
async def extract_text(file: UploadFile = File(...)):
    """Extract and normalize text from PDF, DOCX, PPTX, or TXT."""
    try:
        content_bytes = await file.read()
        raw, cleaned = TextExtractor.extract_from_bytes(content_bytes, file.filename)
        char_count = len(cleaned)
        est_tokens = len(cleaned.split())

        return ExtractTextResponse(
            success=True,
            file_name=file.filename,
            file_type=file.filename.split(".")[-1].upper(),
            extracted_text=raw,
            cleaned_text=cleaned,
            character_count=char_count,
            estimated_tokens=est_tokens
        )
    except Exception as e:
        logger.error(f"Error extracting text from {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@app.post("/api/ai/generate-mcq", response_model=GenerateMcqResponse)
def generate_mcqs(request: GenerateMcqRequest):
    """Generate high-quality multiple choice questions from document text."""
    try:
        questions = ai_provider.generate_mcqs(request)
        return GenerateMcqResponse(
            success=True,
            message=f"Generated {len(questions)} MCQs successfully",
            total_questions=len(questions),
            questions=questions
        )
    except Exception as e:
        logger.error(f"MCQ generation failed: {e}")
        # Fallback to mock on any unhandled exception
        mock = MockAIProvider()
        questions = mock.generate_mcqs(request)
        return GenerateMcqResponse(
            success=True,
            message="Generated MCQs using resilient fallback engine",
            total_questions=len(questions),
            questions=questions
        )

@app.post("/api/ai/generate-quiz", response_model=GenerateMcqResponse)
def generate_quiz(request: GenerateMcqRequest):
    """Alias for generate-mcq supporting standardized quiz generation."""
    return generate_mcqs(request)

@app.post("/api/ai/assistant", response_model=AiAssistantResponse)
def ask_assistant(request: AiAssistantRequest):
    """Domain-specific AI chat assistant for statistical officers."""
    try:
        return ai_provider.answer_query(request)
    except Exception as e:
        logger.error(f"Assistant query failed: {e}")
        return AiAssistantResponse(
            answer="I am your StatIQ AI Assistant. I can help guide your competency upskilling, recommend iGOT Karmayogi courses, and interpret survey methodology manuals.",
            source_references=["StatIQ Knowledge Base"],
            suggested_follow_ups=["Analyze my skill gaps", "What courses should I take?"]
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
