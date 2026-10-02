from sqlalchemy.orm import Session

from app.models.study_material import StudyMaterial
from app.services.ai_quiz_service import generate_quiz_questions
from app.services.ai_quiz_validator import validate_quiz_questions
from app.services.ai_quiz_save_service import save_generated_quiz


def generate_and_save_quiz(
    db: Session,
    user_id: int,
    study_material_id: int,
    number_of_questions: int,
    difficulty: str
):
    material = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.id == study_material_id,
            StudyMaterial.user_id == user_id
        )
        .first()
    )

    if not material:
        raise ValueError("Study material not found.")

    if not material.extracted_text:
        raise ValueError(
            "Study material does not contain extracted text."
        )

    questions = generate_quiz_questions(
        study_material=material.extracted_text,
        number_of_questions=number_of_questions,
        difficulty=difficulty
    )

    questions = validate_quiz_questions(
        questions=questions,
        expected_count=number_of_questions
    )

    title = f"AI Quiz - {material.title}"

    description = (
        f"AI-generated quiz based on "
        f"{material.title}."
    )

    quiz = save_generated_quiz(
        db=db,
        user_id=user_id,
        subject_id=material.subject_id,
        title=title,
        description=description,
        questions=questions
    )

    return quiz