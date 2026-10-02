from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.assignment import Assignment
from app.models.subject import Subject
from app.models.user import User
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentResponse
)
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


@router.post(
    "",
    response_model=AssignmentResponse
)
def create_assignment(
    request: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    subject = (
        db.query(Subject)
        .filter(
            Subject.id == request.subject_id,
            Subject.user_id == current_user.id
        )
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    assignment = Assignment(
        title=request.title,
        description=request.description,
        due_date=request.due_date,
        subject_id=request.subject_id,
        user_id=current_user.id
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


@router.get(
    "",
    response_model=list[AssignmentResponse]
)
def get_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    assignments = (
        db.query(Assignment)
        .filter(
            Assignment.user_id == current_user.id
        )
        .order_by(
            Assignment.due_date.asc()
        )
        .all()
    )

    return assignments


@router.get(
    "/{assignment_id}",
    response_model=AssignmentResponse
)
def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.user_id == current_user.id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    return assignment


@router.put(
    "/{assignment_id}",
    response_model=AssignmentResponse
)
def update_assignment(
    assignment_id: int,
    request: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.user_id == current_user.id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    if request.subject_id is not None:

        subject = (
            db.query(Subject)
            .filter(
                Subject.id == request.subject_id,
                Subject.user_id == current_user.id
            )
            .first()
        )

        if not subject:
            raise HTTPException(
                status_code=404,
                detail="Subject not found"
            )

        assignment.subject_id = request.subject_id

    if request.title is not None:
        assignment.title = request.title

    if request.description is not None:
        assignment.description = request.description

    if request.due_date is not None:
        assignment.due_date = request.due_date

    if request.status is not None:

        allowed_statuses = {
            "pending",
            "completed"
        }

        if request.status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid assignment status"
            )

        assignment.status = request.status

    db.commit()
    db.refresh(assignment)

    return assignment


@router.delete(
    "/{assignment_id}"
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.user_id == current_user.id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found"
        )

    db.delete(assignment)
    db.commit()

    return {
        "message": "Assignment deleted successfully"
    }