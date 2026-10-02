from pydantic import BaseModel, Field
from datetime import datetime


class QuizQuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(
        ...,
        pattern="^[ABCD]$"
    )
    explanation: str | None = None
    question_order: int = Field(..., ge=1)


class QuizCreate(BaseModel):
    title: str
    description: str | None = None
    subject_id: int
    questions: list[QuizQuestionCreate] = Field(
        default_factory=list
    )


class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    question_order: int


class QuizResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    subject_id: int
    created_at: datetime
    updated_at: datetime


class QuizDetailResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    subject_id: int
    created_at: datetime
    updated_at: datetime
    questions: list[QuizQuestionResponse]