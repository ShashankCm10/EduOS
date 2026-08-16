from sqlalchemy import Column, Integer, Text, ForeignKey
from app.config.database import Base
from pgvector.sqlalchemy import Vector

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    study_material_id = Column(
        Integer,
        ForeignKey("study_materials.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    chunk_index = Column(
        Integer,
        nullable=False
    )

    page_number = Column(
        Integer,
        nullable=False
    )

    text = Column(
        Text,
        nullable=False
    )
    
    embedding = Column(Vector(384), nullable=True)