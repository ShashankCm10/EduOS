from pydantic import BaseModel


class StudentProfileResponse(BaseModel):
    id: int
    name: str
    email: str


class StudentDashboardResponse(BaseModel):
    profile: StudentProfileResponse
    total_subjects: int
    total_study_materials: int


class StudentSubjectResponse(BaseModel):
    id: int
    name: str
    description: str | None = None


class StudentMaterialSubjectResponse(BaseModel):
    id: int
    name: str


class StudentMaterialResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    original_filename: str | None = None
    language: str | None = None
    subject: StudentMaterialSubjectResponse

class StudentMaterialDetailResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    original_filename: str | None = None
    language: str | None = None
    subject: StudentMaterialSubjectResponse
    
class StudentAskRequest(BaseModel):
    question: str
    limit: int = 5