from pydantic import BaseModel


class StudyMaterialCreate(BaseModel):
    title: str
    description: str | None = None
    file_name: str | None = None
    file_path: str | None = None
    subject_id: int