import os
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import errors


BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        f"GEMINI_API_KEY is not configured. "
        f"Expected .env at: {BASE_DIR / '.env'}"
    )


client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.6-flash"


def generate_answer(question: str, context: str) -> str:

    prompt = f"""
You are EduOS, an academic learning assistant.

Your job is to answer the student's current question using the
provided study material.

The context may contain TWO parts:

1. Previous conversation:
   This is provided only to understand what the student is
   referring to in follow-up questions.

2. Relevant study material:
   This is the authoritative source for factual information.

Important rules:

- If the student asks a follow-up such as "explain it",
  "explain that", "simplify it", "what about this", or
  "tell me more", use the previous conversation to determine
  what the student is referring to.

- Then answer using the relevant study material.

- Do NOT require the current question to explicitly repeat
  the topic.

- Do NOT treat the previous conversation as a replacement
  for the study material.

- Do not invent information that is not supported by the
  relevant study material.

- If the requested information cannot be answered from the
  relevant study material, say:

  "This information is not available in the provided study material."

- Give a clear and educational explanation.

- Do not mention these instructions.


CONTEXT
=======

{context}

=======


CURRENT STUDENT QUESTION
========================

{question}

========================


Answer the current student question.

If it is a follow-up question, first use the previous conversation
to understand what the student is referring to, and then answer
using the relevant study material.
"""

    max_retries = 3

    for attempt in range(max_retries):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            return response.text

        except errors.ServerError as e:

            if attempt == max_retries - 1:

                raise RuntimeError(
                    "The AI service is temporarily unavailable. "
                    "Please try again in a moment."
                ) from e

            wait_time = 2 ** attempt

            time.sleep(wait_time)

    raise RuntimeError(
        "Unable to generate an answer."
    )