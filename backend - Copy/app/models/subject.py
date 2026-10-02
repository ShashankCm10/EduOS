from sqlalchemy import Column, Integer, String, ForeignKey
from app.config.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )