from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.notes import router as notes_router
from app.api.auth import router as auth_router
from app.api.subjects import router as subjects_router
from app.config.database import Base, engine
from app.models.user import User
app = FastAPI(
    title="EduOS API",
    description="Backend API for the EduOS platform.",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(notes_router)
app.include_router(subjects_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to EduOS 🚀",
        "status": "Running",
        "version": "1.0.0",
    }