from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.notes import router as notes_router
from app.api.auth import router as auth_router
from app.api.subjects import router as subjects_router
from app.config.database import Base, engine
from app.models.user import User
from app.api.study_materials import router as study_materials_router
from app.models.document_chunk import DocumentChunk
app = FastAPI(
    title="EduOS API",
    description="Backend API for the EduOS platform.",
    version="1.0.0",
    swagger_ui_parameters={
        "persistAuthorization": True
    }
)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(notes_router)
app.include_router(subjects_router)
app.include_router(study_materials_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to EduOS 🚀",
        "status": "Running",
        "version": "1.0.0",
    }