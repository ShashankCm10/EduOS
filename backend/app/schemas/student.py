from pydantic import BaseModel
from typing import Optional


class StudentProfileResponse(BaseModel):
    id: int
    name: Optional[str] = None
    email: str


class StudentDashboardResponse(BaseModel):
    profile: StudentProfileResponse
    total_subjects: int
    total_study_materials: int