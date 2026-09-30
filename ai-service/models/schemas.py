from typing import List, Optional
from pydantic import BaseModel, Field

class GeneratedQuestion(BaseModel):
    question_text: str = Field(..., description="The stem question text")
    option_a: str = Field(..., description="Option A")
    option_b: str = Field(..., description="Option B")
    option_c: str = Field(..., description="Option C")
    option_d: str = Field(..., description="Option D")
    correct_answer: str = Field(..., description="Correct option key: A, B, C, or D")
    explanation: str = Field(..., description="Pedagogical rationale explaining correctness and distractors")
    difficulty: str = Field("MEDIUM", description="EASY, MEDIUM, HARD, or ADVANCED")
    topic: str = Field("Official Statistics", description="Core topic name")
    source_reference: Optional[str] = Field(None, description="Document section reference")
    blooms_taxonomy_level: Optional[str] = Field("Understanding", description="Bloom's Taxonomy category")

class GenerateMcqRequest(BaseModel):
    material_id: Optional[int] = None
    document_title: Optional[str] = "Statistical Methodology Reference"
    document_content: Optional[str] = ""
    topic: Optional[str] = "Survey Design & Machine Learning"
    difficulty: Optional[str] = "MEDIUM"
    count: int = Field(10, ge=1, le=50)

class GenerateMcqResponse(BaseModel):
    success: bool = True
    message: str = "Questions generated successfully"
    total_questions: int
    questions: List[GeneratedQuestion]

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class AiAssistantRequest(BaseModel):
    query: str
    context_topic: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

class AiAssistantResponse(BaseModel):
    answer: str
    source_references: List[str] = []
    suggested_follow_ups: List[str] = []
    relevant_competencies: List[str] = []

class ExtractTextResponse(BaseModel):
    success: bool = True
    file_name: str
    file_type: str
    extracted_text: str
    cleaned_text: str
    character_count: int
    estimated_tokens: int
