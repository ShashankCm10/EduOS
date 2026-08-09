from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.config.database import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False
    )