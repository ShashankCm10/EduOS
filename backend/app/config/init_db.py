from app.config.database import Base, engine
from app.models.user import User
from app.models.note import Note


Base.metadata.create_all(bind=engine)

print("EduOS tables created successfully!")