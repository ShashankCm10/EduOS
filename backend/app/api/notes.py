from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.note import Note
from app.models.subject import Subject
from app.models.user import User
from app.schemas.note import NoteCreate


router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.post("/")
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == note.subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    new_note = Note(
        title=note.title,
        content=note.content,
        user_id=current_user.id,
        subject_id=note.subject_id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "message": "Note created successfully",
        "note_id": new_note.id
    }


@router.get("/")
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notes = db.query(Note).filter(
        Note.user_id == current_user.id
    ).all()

    return notes


@router.get("/{note_id}")
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    return note


@router.put("/{note_id}")
def update_note(
    note_id: int,
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    subject = db.query(Subject).filter(
        Subject.id == note_data.subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    note.title = note_data.title
    note.content = note_data.content
    note.subject_id = note_data.subject_id

    db.commit()
    db.refresh(note)

    return {
        "message": "Note updated successfully",
        "note_id": note.id
    }


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }