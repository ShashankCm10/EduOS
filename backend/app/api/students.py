from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.models.subject import Subject
from app.models.study_material import StudyMaterial
from app.schemas.student import StudentDashboardResponse
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get(
    "/me/dashboard",
    response_model=StudentDashboardResponse
)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_subjects = (
        db.query(Subject)
        .filter(
            Subject.user_id == current_user.id
        )
        .count()
    )

    total_study_materials = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.user_id == current_user.id
        )
        .count()
    )

    return {
        "profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "total_subjects": total_subjects,
        "total_study_materials": total_study_materials
    }