from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.models.study_material import StudyMaterial
from app.models.note import Note
from app.models.assignment import Assignment
from app.models.quiz import Quiz


router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
def search_all(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    term = f"%{q.strip()}%"
    results = []

    def add_rows(query, kind, fields):
        remaining = limit - len(results)
        if remaining <= 0:
            return
        rows = query.filter(or_(*[field.ilike(term) for field in fields])).limit(remaining).all()
        for row in rows:
            results.append({
                "type": kind,
                "id": row.id,
                "title": getattr(row, "title", None) or getattr(row, "name", None),
                "description": getattr(row, "description", None),
            })

    add_rows(
        db.query(Subject).filter(Subject.user_id == current_user.id),
        "subject",
        [Subject.name, Subject.description]
    )
    add_rows(
        db.query(StudyMaterial).filter(StudyMaterial.user_id == current_user.id),
        "study_material",
        [StudyMaterial.title, StudyMaterial.description]
    )
    add_rows(
        db.query(Note).filter(Note.user_id == current_user.id),
        "note",
        [Note.title, Note.content]
    )
    add_rows(
        db.query(Assignment).filter(Assignment.user_id == current_user.id),
        "assignment",
        [Assignment.title, Assignment.description]
    )
    add_rows(
        db.query(Quiz).filter(Quiz.user_id == current_user.id),
        "quiz",
        [Quiz.title, Quiz.description]
    )

    return {"query": q, "count": len(results), "results": results}
