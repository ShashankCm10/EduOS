from pydantic import BaseModel, Field


class AIQuizGenerateRequest(BaseModel):
    study_material_id: int
    number_of_questions: int = Field(
        default=5,
        ge=1,
        le=20
    )
    difficulty: str = Field(
        default="medium",
        pattern="^(easy|medium|hard)$"
    )


class AIQuizQuestion(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(
        pattern="^[ABCD]$"
    )
    explanation: str | None = None


class AIQuizGenerateResponse(BaseModel):
    title: str
    description: str | None = None
    subject_id: int
    questions: list[AIQuizQuestion]