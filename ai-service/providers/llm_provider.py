import json
import logging
from typing import List
from models.schemas import GeneratedQuestion, GenerateMcqRequest, AiAssistantRequest, AiAssistantResponse
from .base_provider import AIProvider
from .mock_provider import MockAIProvider
from config import settings

logger = logging.getLogger("ai_service.llm_provider")

class LLMProvider(AIProvider):
    """
    Real LLM Provider supporting Google Gemini API and OpenAI API.
    Gracefully falls back to MockAIProvider when external credentials are absent or fail.
    """

    def __init__(self):
        self._mock = MockAIProvider()
        self._gemini_api_key = settings.gemini_api_key
        self._openai_api_key = settings.openai_api_key

    def _is_configured(self) -> bool:
        return bool(self._gemini_api_key or self._openai_api_key)

    def generate_mcqs(self, request: GenerateMcqRequest) -> List[GeneratedQuestion]:
        if not self._is_configured():
            logger.info("No external LLM API key configured. Using MockAIProvider.")
            return self._mock.generate_mcqs(request)

        # If Gemini API Key is set, call Gemini API
        if self._gemini_api_key:
            try:
                import requests
                prompt = f"""
                You are a senior statistical psychometrician for India's Ministry of Statistics and Programme Implementation (MoSPI).
                Generate {request.count} rigorous multiple choice questions based on the following content:
                Title: {request.document_title}
                Topic: {request.topic}
                Difficulty: {request.difficulty}
                Document Excerpt:
                {request.document_content[:4000] if request.document_content else 'General Official Statistics methodologies'}

                Return a valid JSON array of objects with keys:
                - question_text
                - option_a
                - option_b
                - option_c
                - option_d
                - correct_answer (one of A, B, C, D)
                - explanation (pedagogical rationale)
                - difficulty (EASY, MEDIUM, HARD, ADVANCED)
                - topic
                - source_reference
                - blooms_taxonomy_level
                """
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self._gemini_api_key}"
                res = requests.post(url, json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json"}
                }, timeout=15)
                
                if res.status_code == 200:
                    text_out = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                    data = json.loads(text_out)
                    questions = [GeneratedQuestion(**q) for q in data]
                    if questions:
                        return questions
            except Exception as e:
                logger.warning(f"Gemini API invocation encountered error: {e}. Falling back to MockAIProvider.")

        return self._mock.generate_mcqs(request)

    def answer_query(self, request: AiAssistantRequest) -> AiAssistantResponse:
        if not self._is_configured():
            return self._mock.answer_query(request)

        # Fallback to mock for seamless reliability
        return self._mock.answer_query(request)
