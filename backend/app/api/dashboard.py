from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.assignment import Assignment
from app.models.quiz_attempt import QuizAttempt
from app.models.notification import Notification


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pending_assignments = db.query(Assignment).filter(
        Assignment.user_id == current_user.id,
        Assignment.status == "pending"
    ).count()

    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).all()

    unread_notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read.is_(False)
    ).count()

    return {
        "pending_assignments": pending_assignments,
        "quiz_attempts": len(attempts),
        "average_quiz_score": round(
            sum(a.score for a in attempts) / len(attempts), 2
        ) if attempts else 0.0,
        "unread_notifications": unread_notifications
    }
