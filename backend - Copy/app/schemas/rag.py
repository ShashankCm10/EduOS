from pydantic import BaseModel, Field
from typing import List


class RAGSource(BaseModel):
    document: str
    page: int
    relevance: float


class RAGMetadata(BaseModel):
    chunks_retrieved: int
    chunks_used: int


class RAGResponse(BaseModel):
    material_id: int
    question: str
    answer: str
    sources: List[RAGSource]
    metadata: RAGMetadata