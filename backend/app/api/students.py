from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import User
from app.models.subject import Subject
from app.models.study_material import StudyMaterial
from app.schemas.student import (
    StudentDashboardResponse,
    StudentSubjectResponse,
    StudentMaterialResponse,
    StudentMaterialDetailResponse
)
from app.api.auth import get_current_user
from app.schemas.search import RAGRequest
from app.schemas.rag import RAGResponse
from app.services.rag_service import answer_question


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get(
    "/me/dashboard",
    response_model=StudentDashboardResponse
)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_subjects = (
        db.query(Subject)
        .filter(
            Subject.user_id == current_user.id
        )
        .count()
    )

    total_study_materials = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.user_id == current_user.id
        )
        .count()
    )

    return {
        "profile": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "total_subjects": total_subjects,
        "total_study_materials": total_study_materials
    }


@router.get(
    "/me/subjects",
    response_model=List[StudentSubjectResponse]
)
def get_student_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subjects = (
        db.query(Subject)
        .filter(
            Subject.user_id == current_user.id
        )
        .order_by(Subject.name)
        .all()
    )

    return subjects


@router.get(
    "/me/materials",
    response_model=List[StudentMaterialResponse]
)
def get_student_materials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    materials = (
        db.query(StudyMaterial, Subject)
        .join(
            Subject,
            StudyMaterial.subject_id == Subject.id
        )
        .filter(
            StudyMaterial.user_id == current_user.id,
            Subject.user_id == current_user.id
        )
        .order_by(StudyMaterial.title)
        .all()
    )

    return [
        {
            "id": material.id,
            "title": material.title,
            "description": material.description,
            "original_filename": material.original_filename,
            "language": material.language,
            "subject": {
                "id": subject.id,
                "name": subject.name
            }
        }
        for material, subject in materials
    ]


@router.get(
    "/me/materials/{material_id}",
    response_model=StudentMaterialDetailResponse
)
def get_student_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = (
        db.query(StudyMaterial, Subject)
        .join(
            Subject,
            StudyMaterial.subject_id == Subject.id
        )
        .filter(
            StudyMaterial.id == material_id,
            StudyMaterial.user_id == current_user.id,
            Subject.user_id == current_user.id
        )
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    material, subject = result

    return {
        "id": material.id,
        "title": material.title,
        "description": material.description,
        "original_filename": material.original_filename,
        "language": material.language,
        "subject": {
            "id": subject.id,
            "name": subject.name
        }
    }

@router.post(
    "/me/materials/{material_id}/ask",
    response_model=RAGResponse
)
def ask_student_material(
    material_id: int,
    request: RAGRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.id == material_id,
            StudyMaterial.user_id == current_user.id
        )
        .first()
    )

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    try:
        result = answer_question(
            db=db,
            material_id=material_id,
            question=request.question,
            limit=request.limit
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )

    return {
        "material_id": material_id,
        "question": request.question,
        "answer": result["answer"],
        "sources": result["sources"],
        "metadata": result["metadata"]
    }

    