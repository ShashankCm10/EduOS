from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.models.study_material import StudyMaterial
from app.models.assignment import Assignment
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.note import Note


router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/summary")
def get_progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignments_total = db.query(Assignment).filter(
        Assignment.user_id == current_user.id
    ).count()
    assignments_completed = db.query(Assignment).filter(
        Assignment.user_id == current_user.id,
        Assignment.status == "completed"
    ).count()

    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).all()
    average_score = round(
        sum(a.score for a in attempts) / len(attempts), 2
    ) if attempts else 0.0

    return {
        "subjects": db.query(Subject).filter(Subject.user_id == current_user.id).count(),
        "study_materials": db.query(StudyMaterial).filter(StudyMaterial.user_id == current_user.id).count(),
        "notes": db.query(Note).filter(Note.user_id == current_user.id).count(),
        "quizzes": db.query(Quiz).filter(Quiz.user_id == current_user.id).count(),
        "quiz_attempts": len(attempts),
        "average_quiz_score": average_score,
        "assignments_total": assignments_total,
        "assignments_completed": assignments_completed,
        "assignment_completion_rate": round(
            (assignments_completed / assignments_total) * 100, 2
        ) if assignments_total else 0.0
    }


@router.get("/subjects")
def get_subject_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subjects = db.query(Subject).filter(Subject.user_id == current_user.id).all()
    result = []

    for subject in subjects:
        material_count = db.query(StudyMaterial).filter(
            StudyMaterial.subject_id == subject.id,
            StudyMaterial.user_id == current_user.id
        ).count()
        assignment_total = db.query(Assignment).filter(
            Assignment.subject_id == subject.id,
            Assignment.user_id == current_user.id
        ).count()
        assignment_completed = db.query(Assignment).filter(
            Assignment.subject_id == subject.id,
            Assignment.user_id == current_user.id,
            Assignment.status == "completed"
        ).count()

        quiz_ids = [
            q.id for q in db.query(Quiz).filter(
                Quiz.subject_id == subject.id,
                Quiz.user_id == current_user.id
            ).all()
        ]
        subject_attempts = db.query(QuizAttempt).filter(
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.quiz_id.in_(quiz_ids)
        ).all() if quiz_ids else []

        result.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "study_materials": material_count,
            "assignments_total": assignment_total,
            "assignments_completed": assignment_completed,
            "average_quiz_score": round(
                sum(a.score for a in subject_attempts) / len(subject_attempts), 2
            ) if subject_attempts else 0.0,
            "quiz_attempts": len(subject_attempts)
        })

    return result
