from pydantic import BaseModel
from datetime import datetime


class AssignmentCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    subject_id: int


class AssignmentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    status: str | None = None
    subject_id: int | None = None


class AssignmentResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    due_date: datetime | None = None
    status: str
    subject_id: int
    created_at: datetime
    updated_at: datetime