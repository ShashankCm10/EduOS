from fastapi import FastAPI

app = FastAPI(
    title="EduOS API",
    description="Backend API for the EduOS platform.",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Welcome to EduOS 🚀",
        "status": "Running",
        "version": "1.0.0"
    }