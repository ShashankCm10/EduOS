from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):
    study_material_id: int
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    study_material_id: int
    title: str | None
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime


class ConversationDetailResponse(BaseModel):
    id: int
    study_material_id: int
    title: str | None
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse]
    
class ConversationAskRequest(BaseModel):
    question: str
    limit: int = 5    