from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    quiz_id = Column(
        Integer,
        ForeignKey("quizzes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    score = Column(
        Float,
        nullable=False,
        default=0
    )

    total_questions = Column(
        Integer,
        nullable=False
    )

    correct_answers = Column(
        Integer,
        nullable=False,
        default=0
    )

    completed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )