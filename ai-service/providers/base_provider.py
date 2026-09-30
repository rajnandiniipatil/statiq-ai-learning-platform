from abc import ABC, abstractmethod
from typing import List
from models.schemas import GeneratedQuestion, GenerateMcqRequest, AiAssistantRequest, AiAssistantResponse

class AIProvider(ABC):
    """Abstract base provider for LLM and Mock inferences."""

    @abstractmethod
    def generate_mcqs(self, request: GenerateMcqRequest) -> List[GeneratedQuestion]:
        """Generate structured MCQs from source material."""
        pass

    @abstractmethod
    def answer_query(self, request: AiAssistantRequest) -> AiAssistantResponse:
        """Answer learner queries regarding statistical competencies and guidelines."""
        pass
