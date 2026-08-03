from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="EduOS API",
    description="Backend API for the EduOS platform.",
    version="1.0.0",
)

app.include_router(health_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to EduOS 🚀",
        "status": "Running",
        "version": "1.0.0",
    }