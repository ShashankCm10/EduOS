from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    study_material_id = Column(
        Integer,
        ForeignKey("study_materials.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title = Column(
        String(200),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )