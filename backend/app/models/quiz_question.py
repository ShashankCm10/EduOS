from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.config.database import Base


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

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

    question_text = Column(
        Text,
        nullable=False
    )

    option_a = Column(
        String(500),
        nullable=False
    )

    option_b = Column(
        String(500),
        nullable=False
    )

    option_c = Column(
        String(500),
        nullable=False
    )

    option_d = Column(
        String(500),
        nullable=False
    )

    correct_option = Column(
        String(1),
        nullable=False
    )

    explanation = Column(
        Text,
        nullable=True
    )

    question_order = Column(
        Integer,
        nullable=False
    )