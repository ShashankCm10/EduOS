from datetime import datetime
from pydantic import BaseModel, Field


class NotificationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    notification_type: str = "general"
    due_at: datetime | None = None


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    due_at: datetime | None = None
    created_at: datetime
