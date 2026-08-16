from langdetect import detect


def detect_language(text: str) -> str:
    if not text or not text.strip():
        return "unknown"

    return detect(text)