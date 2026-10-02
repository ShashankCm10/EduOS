from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone 
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.sql import func

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

from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage

from app.schemas.ai_conversation import (
    ConversationCreate,
    ConversationResponse,
    ConversationDetailResponse,
    ConversationAskRequest
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# ============================================================
# STUDENT DASHBOARD
# ============================================================

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


# ============================================================
# STUDENT SUBJECTS
# ============================================================

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


# ============================================================
# STUDENT MATERIALS
# ============================================================

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


# ============================================================
# STUDY MATERIAL DETAIL
# ============================================================

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


# ============================================================
# DIRECT MATERIAL ASK
# ============================================================

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


# ============================================================
# CREATE AI CONVERSATION
# ============================================================

@router.post(
    "/me/conversations",
    response_model=ConversationResponse
)
def create_conversation(
    request: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    material = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.id == request.study_material_id,
            StudyMaterial.user_id == current_user.id
        )
        .first()
    )

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )
        
    conversation_title = request.title

    if not conversation_title:
        conversation_title = "New Conversation"    

    conversation = AIConversation(
        user_id=current_user.id,
        study_material_id=request.study_material_id,
        title=conversation_title
    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return conversation


# ============================================================
# GET ALL CONVERSATIONS
# ============================================================

@router.get(
    "/me/conversations",
    response_model=list[ConversationResponse]
)
def get_student_conversations(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if skip < 0:
        skip = 0

    if limit < 1:
        limit = 20

    if limit > 100:
        limit = 100

    conversations = (
        db.query(AIConversation)
        .filter(
            AIConversation.user_id == current_user.id
        )
        .order_by(
            AIConversation.updated_at.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    return conversations

# ============================================================
# GET SINGLE CONVERSATION
# ============================================================

@router.get(
    "/me/conversations/{conversation_id}",
    response_model=ConversationDetailResponse
)
def get_student_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = (
        db.query(AIConversation)
        .filter(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id
        )
        .first()
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    messages = (
        db.query(AIMessage)
        .filter(
            AIMessage.conversation_id == conversation.id
        )
        .order_by(
            AIMessage.created_at.asc()
        )
        .all()
    )

    return {
        "id": conversation.id,
        "study_material_id": conversation.study_material_id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": messages
    }


# ============================================================
# DELETE CONVERSATION
# ============================================================

@router.delete(
    "/me/conversations/{conversation_id}"
)
def delete_student_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = (
        db.query(AIConversation)
        .filter(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id
        )
        .first()
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    db.delete(conversation)

    db.commit()

    return {
        "message": "Conversation deleted successfully"
    }


# ============================================================
# ASK INSIDE CONVERSATION
# ============================================================

@router.post(
    "/me/conversations/{conversation_id}/ask",
    response_model=RAGResponse
)
def ask_conversation(
    conversation_id: int,
    request: ConversationAskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = (
        db.query(AIConversation)
        .filter(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    user_message = AIMessage(
        conversation_id=conversation.id,
        role="user",
        content=request.question
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    conversation.updated_at = func.now()
    db.commit()

    previous_messages = (
        db.query(AIMessage)
        .filter(
            AIMessage.conversation_id == conversation.id,
            AIMessage.id != user_message.id
        )
        .order_by(
    AIMessage.created_at.desc()
)
.limit(20)
.all()
    )

    conversation_history = [
    {
        "role": message.role,
        "content": message.content
    }
    for message in reversed(previous_messages)
]

    try:

        result = answer_question(
            db=db,
            material_id=conversation.study_material_id,
            question=request.question,
            limit=request.limit,
            conversation_history=conversation_history
        )

    except RuntimeError as e:

        raise HTTPException(
            status_code=503,
            detail=str(e)
        )

    assistant_message = AIMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=result["answer"]
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return {
        "material_id": conversation.study_material_id,
        "question": request.question,
        "answer": result["answer"],
        "sources": result["sources"],
        "metadata": result["metadata"]
    }