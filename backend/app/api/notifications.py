from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationResponse


router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("", response_model=NotificationResponse)
def create_notification(
    request: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = Notification(
        title=request.title,
        message=request.message,
        notification_type=request.notification_type,
        due_at=request.due_at,
        user_id=current_user.id
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    if unread_only:
        query = query.filter(Notification.is_read.is_(False))
    return query.order_by(Notification.created_at.desc()).all()


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted successfully"}
