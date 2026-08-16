import re


def clean_text(text: str) -> str:
    if not text:
        return ""

    # Join words that were split by a line break/hyphen.
    text = re.sub(r"-\s*\n\s*", "", text)

    # Replace remaining line breaks with spaces.
    text = re.sub(r"\s+", " ", text)

    # Remove excessive dots from table-of-contents formatting.
    text = re.sub(r"\.{2,}", " ", text)

    return text.strip()