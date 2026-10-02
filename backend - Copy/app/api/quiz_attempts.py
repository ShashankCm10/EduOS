from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion
from app.models.quiz_attempt import QuizAttempt
from app.models.user import User
from app.schemas.quiz_attempt import (
    QuizAttemptCreate,
    QuizAttemptResponse
)
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/quiz-attempts",
    tags=["Quiz Attempts"]
)


@router.post(
    "/{quiz_id}",
    response_model=QuizAttemptResponse
)
def submit_quiz(
    quiz_id: int,
    request: QuizAttemptCreate,
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
        .all()
    )

    if not questions:
        raise HTTPException(
            status_code=400,
            detail="Quiz has no questions"
        )

    question_map = {
        question.id: question
        for question in questions
    }

    correct_answers = 0

    for answer in request.answers:

        question = question_map.get(
            answer.question_id
        )

        if not question:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Question {answer.question_id} "
                    f"does not belong to this quiz"
                )
            )

        if answer.selected_option == question.correct_option:
            correct_answers += 1

    total_questions = len(questions)

    score = (
        correct_answers / total_questions
    ) * 100

    attempt = QuizAttempt(
        quiz_id=quiz.id,
        user_id=current_user.id,
        score=score,
        total_questions=total_questions,
        correct_answers=correct_answers
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return attempt

@router.get(
    "",
    response_model=list[QuizAttemptResponse]
)
def get_quiz_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    attempts = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.user_id == current_user.id
        )
        .order_by(
            QuizAttempt.completed_at.desc()
        )
        .all()
    )

    return attempts


@router.get(
    "/{attempt_id}",
    response_model=QuizAttemptResponse
)
def get_quiz_attempt(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    attempt = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.id == attempt_id,
            QuizAttempt.user_id == current_user.id
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=404,
            detail="Quiz attempt not found"
        )

    return attempt