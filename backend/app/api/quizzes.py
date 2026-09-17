from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion
from app.models.subject import Subject
from app.models.user import User
from app.schemas.quiz import (
    QuizCreate,
    QuizResponse,
    QuizDetailResponse,
    QuizQuestionResponse
)
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"]
)


@router.post(
    "",
    response_model=QuizDetailResponse
)
def create_quiz(
    request: QuizCreate,
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

    quiz = Quiz(
        title=request.title,
        description=request.description,
        subject_id=request.subject_id,
        user_id=current_user.id
    )

    db.add(quiz)
    db.flush()

    for question in request.questions:

        quiz_question = QuizQuestion(
            quiz_id=quiz.id,
            question_text=question.question_text,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_option=question.correct_option,
            explanation=question.explanation,
            question_order=question.question_order
        )

        db.add(quiz_question)

    db.commit()
    db.refresh(quiz)

    questions = (
        db.query(QuizQuestion)
        .filter(
            QuizQuestion.quiz_id == quiz.id
        )
        .order_by(
            QuizQuestion.question_order.asc()
        )
        .all()
    )

    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "subject_id": quiz.subject_id,
        "created_at": quiz.created_at,
        "updated_at": quiz.updated_at,
        "questions": questions
    }


@router.get(
    "",
    response_model=list[QuizResponse]
)
def get_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    quizzes = (
        db.query(Quiz)
        .filter(
            Quiz.user_id == current_user.id
        )
        .order_by(
            Quiz.created_at.desc()
        )
        .all()
    )

    return quizzes


@router.get(
    "/{quiz_id}",
    response_model=QuizDetailResponse
)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    quiz = (
        db.query(Quiz)
        .filter(
            Quiz.id == quiz_id,
            Quiz.user_id == current_user.id
        )
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found"
        )

    questions = (
        db.query(QuizQuestion)
        .filter(
            QuizQuestion.quiz_id == quiz.id
        )
        .order_by(
            QuizQuestion.question_order.asc()
        )
        .all()
    )

    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "subject_id": quiz.subject_id,
        "created_at": quiz.created_at,
        "updated_at": quiz.updated_at,
        "questions": questions
    }


@router.delete(
    "/{quiz_id}"
)
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    quiz = (
        db.query(Quiz)
        .filter(
            Quiz.id == quiz_id,
            Quiz.user_id == current_user.id
        )
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found"
        )

    db.delete(quiz)
    db.commit()

    return {
        "message": "Quiz deleted successfully"
    }