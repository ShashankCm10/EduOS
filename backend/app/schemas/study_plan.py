from datetime import date, datetime
from pydantic import BaseModel, Field


class StudyPlanCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    target_date: date | None = None


class StudyPlanUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    target_date: date | None = None
    status: str | None = None


class StudyPlanResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    target_date: date | None = None
    status: str
    created_at: datetime
    updated_at: datetime


class StudyPlanSuggestion(BaseModel):
    title: str
    reason: str
    priority: str
