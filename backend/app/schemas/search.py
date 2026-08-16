from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    question: str = Field(..., min_length=1)
    limit: int = Field(default=5, ge=1, le=10)