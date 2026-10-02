from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.study_plan import StudyPlan
from app.models.user import User
from app.schemas.study_plan import StudyPlanCreate, StudyPlanUpdate, StudyPlanResponse


router = APIRouter(prefix="/study-plans", tags=["Study Plans"])


@router.post("", response_model=StudyPlanResponse)
def create_study_plan(
    request: StudyPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = StudyPlan(
        title=request.title,
        description=request.description,
        target_date=request.target_date,
        user_id=current_user.id
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("", response_model=list[StudyPlanResponse])
def get_study_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(StudyPlan)
        .filter(StudyPlan.user_id == current_user.id)
        .order_by(StudyPlan.target_date.asc().nullslast(), StudyPlan.created_at.desc())
        .all()
    )


@router.get("/{plan_id}", response_model=StudyPlanResponse)
def get_study_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(StudyPlan).filter(
        StudyPlan.id == plan_id,
        StudyPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    return plan


@router.put("/{plan_id}", response_model=StudyPlanResponse)
def update_study_plan(
    plan_id: int,
    request: StudyPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(StudyPlan).filter(
        StudyPlan.id == plan_id,
        StudyPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    if request.status is not None and request.status not in {"active", "completed", "archived"}:
        raise HTTPException(status_code=400, detail="Invalid study plan status")

    for field in ("title", "description", "target_date", "status"):
        value = getattr(request, field)
        if value is not None:
            setattr(plan, field, value)

    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}")
def delete_study_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(StudyPlan).filter(
        StudyPlan.id == plan_id,
        StudyPlan.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    db.delete(plan)
    db.commit()
    return {"message": "Study plan deleted successfully"}
