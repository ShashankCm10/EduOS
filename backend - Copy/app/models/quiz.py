from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
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