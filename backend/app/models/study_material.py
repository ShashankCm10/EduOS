from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.config.database import Base


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=True)

    original_filename = Column(String(255), nullable=True)

    stored_filename = Column(String(255), nullable=True)

    file_path = Column(String(500), nullable=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False
    )
    
    