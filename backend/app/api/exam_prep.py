from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.models.assignment import Assignment
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.study_material import StudyMaterial


router = APIRouter(prefix="/exam-prep", tags=["Exam Prep"])


@router.get("/overview")
def exam_prep_overview(
    subject_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject_query = db.query(Subject).filter(Subject.user_id == current_user.id)
    if subject_id is not None:
        subject_query = subject_query.filter(Subject.id == subject_id)
    subjects = subject_query.all()

    overview = []
    for subject in subjects:
        materials = db.query(StudyMaterial).filter(
            StudyMaterial.subject_id == subject.id,
            StudyMaterial.user_id == current_user.id
        ).count()
        assignments = db.query(Assignment).filter(
            Assignment.subject_id == subject.id,
            Assignment.user_id == current_user.id,
            Assignment.status == "pending"
        ).count()
        quizzes = db.query(Quiz).filter(
            Quiz.subject_id == subject.id,
            Quiz.user_id == current_user.id
        ).all()
        quiz_ids = [q.id for q in quizzes]
        attempts = db.query(QuizAttempt).filter(
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.quiz_id.in_(quiz_ids)
        ).all() if quiz_ids else []

        overview.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "study_materials": materials,
            "pending_assignments": assignments,
            "quizzes": len(quizzes),
            "average_quiz_score": round(
                sum(a.score for a in attempts) / len(attempts), 2
            ) if attempts else 0.0,
            "readiness": (
                "strong" if attempts and sum(a.score for a in attempts) / len(attempts) >= 80
                else "needs_revision"
            )
        })

    return {"subjects": overview}
