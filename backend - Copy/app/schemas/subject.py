from pydantic import BaseModel


class SubjectCreate(BaseModel):
    name: str
    description: str | None = None