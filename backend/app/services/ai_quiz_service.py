import json
import time

from google.genai import errors

from app.services.llm_service import client, MODEL_NAME


def generate_quiz_questions(
    study_material: str,
    number_of_questions: int,
    difficulty: str
):
    prompt = f"""
You are EduOS, an academic quiz generation assistant.

Generate exactly {number_of_questions} multiple-choice questions
from the provided study material.

Difficulty:
{difficulty}

IMPORTANT RULES:

- Use ONLY the provided study material.
- Do not invent facts.
- Generate exactly {number_of_questions} questions.
- Every question must have exactly four options.
- Options must be labelled A, B, C and D.
- There must be exactly one correct option.
- Provide a short explanation for each answer.
- Questions should test understanding of the material.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add any text before or after the JSON.

Return this exact JSON structure:

{{
  "questions": [
    {{
      "question_text": "Question here",
      "option_a": "Option A",
      "option_b": "Option B",
      "option_c": "Option C",
      "option_d": "Option D",
      "correct_option": "A",
      "explanation": "Short explanation"
    }}
  ]
}}

STUDY MATERIAL
==============

{study_material}
"""

    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            break

        except errors.ServerError as e:
            if attempt == max_retries - 1:
                raise RuntimeError(
                    "The AI quiz service is temporarily unavailable. "
                    "Please try again in a moment."
                ) from e

            wait_time = 2 ** attempt
            time.sleep(wait_time)

    else:
        raise RuntimeError(
            "Unable to generate the AI quiz."
        )

    text = response.text.strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise RuntimeError(
            "AI returned an invalid quiz format."
        ) from e

    questions = data.get("questions")

    if not isinstance(questions, list):
        raise RuntimeError(
            "AI returned an invalid quiz structure."
        )

    if len(questions) != number_of_questions:
        raise RuntimeError(
            "AI did not generate the requested number of questions."
        )

    return questions