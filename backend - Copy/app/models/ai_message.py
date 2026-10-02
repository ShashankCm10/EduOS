from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    conversation_id = Column(
        Integer,
        ForeignKey("ai_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    role = Column(
        String(20),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )