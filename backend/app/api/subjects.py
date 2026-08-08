from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.subject import Subject
from app.models.user import User
from app.schemas.subject import SubjectCreate


router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"]
)


@router.post("/")
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_subject = Subject(
        name=subject.name,
        description=subject.description,
        user_id=current_user.id
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return {
        "message": "Subject created successfully",
        "subject_id": new_subject.id
    }


@router.get("/")
def get_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subjects = db.query(Subject).filter(
        Subject.user_id == current_user.id
    ).all()

    return subjects