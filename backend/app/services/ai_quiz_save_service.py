from sqlalchemy.orm import Session

from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion


def save_generated_quiz(
    db: Session,
    user_id: int,
    subject_id: int,
    title: str,
    description: str | None,
    questions: list
):
    quiz = Quiz(
        title=title,
        description=description,
        subject_id=subject_id,
        user_id=user_id
    )

    db.add(quiz)
    db.flush()

    for index, question in enumerate(questions, start=1):

        quiz_question = QuizQuestion(
            quiz_id=quiz.id,
            question_text=question["question_text"],
            option_a=question["option_a"],
            option_b=question["option_b"],
            option_c=question["option_c"],
            option_d=question["option_d"],
            correct_option=question["correct_option"],
            explanation=question.get("explanation"),
            question_order=index
        )

        db.add(quiz_question)

    db.commit()
    db.refresh(quiz)

    return quiz