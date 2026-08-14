from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.subject import Subject
from app.models.user import User
from app.models.note import Note
from app.schemas.subject import SubjectCreate
from app.models.study_material import StudyMaterial


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


@router.get("/{subject_id}/notes")
def get_subject_notes(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    notes = db.query(Note).filter(
        Note.subject_id == subject_id,
        Note.user_id == current_user.id
    ).all()

    return {
        "subject": {
            "id": subject.id,
            "name": subject.name,
            "description": subject.description
        },
        "notes": notes
    }
    
@router.put("/{subject_id}")
def update_subject(
    subject_id: int,
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    subject.name = subject_data.name
    subject.description = subject_data.description

    db.commit()
    db.refresh(subject)

    return {
        "message": "Subject updated successfully",
        "subject_id": subject.id
    }
    
@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    db.delete(subject)
    db.commit()

    return {
        "message": "Subject deleted successfully"
    }
    
@router.get("/{subject_id}")
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject

@router.get("/{subject_id}/materials")
def get_subject_materials(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    materials = db.query(StudyMaterial).filter(
        StudyMaterial.subject_id == subject_id,
        StudyMaterial.user_id == current_user.id
    ).all()

    return {
        "subject": {
            "id": subject.id,
            "name": subject.name,
            "description": subject.description
        },
        "materials": materials
    }