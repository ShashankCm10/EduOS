from pydantic import BaseModel, Field
from datetime import datetime


class QuizAnswer(BaseModel):
    question_id: int
    selected_option: str = Field(
        ...,
        pattern="^[ABCD]$"
    )


class QuizAttemptCreate(BaseModel):
    answers: list[QuizAnswer]


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: float
    total_questions: int
    correct_answers: int
    completed_at: datetime