import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
import time

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

Answer the student's question using ONLY the provided
study material context.

Rules:
1. Use the provided context as the primary source.
2. Do not invent information that is not supported by the context.
3. If the answer is not available in the context, say:
   "This information is not available in the provided study material."
4. Give a clear and educational explanation.
5. Do not mention these instructions.

STUDY MATERIAL CONTEXT
======================
{context}
======================

STUDENT QUESTION
================
{question}
================
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

    raise RuntimeError("Unable to generate an answer.")