from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.assignment import Assignment
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz import Quiz
from app.models.subject import Subject


router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recommendations = []

    pending = db.query(Assignment).filter(
        Assignment.user_id == current_user.id,
        Assignment.status == "pending"
    ).order_by(Assignment.due_date.asc().nullslast()).limit(5).all()

    for assignment in pending:
        recommendations.append({
            "type": "assignment",
            "priority": "high",
            "title": f"Complete: {assignment.title}",
            "reason": "This assignment is still pending."
        })

    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).order_by(QuizAttempt.completed_at.desc()).limit(20).all()

    weak_quizzes = [a for a in attempts if a.score < 60]
    for attempt in weak_quizzes[:5]:
        quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
        if quiz:
            subject = db.query(Subject).filter(Subject.id == quiz.subject_id).first()
            recommendations.append({
                "type": "revision",
                "priority": "medium",
                "title": f"Revise: {subject.name if subject else quiz.title}",
                "reason": f"Your recent quiz score was {round(attempt.score, 1)}%."
            })

    if not recommendations:
        recommendations.append({
            "type": "general",
            "priority": "low",
            "title": "Keep learning",
            "reason": "No urgent academic actions were detected from your current data."
        })

    return {"recommendations": recommendations}
