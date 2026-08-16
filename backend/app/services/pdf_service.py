import pymupdf


def extract_pages_from_pdf(file_path: str):
    document = pymupdf.open(file_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        page_text = page.get_text().strip()

        if page_text:
            pages.append({
                "page_number": page_number,
                "text": page_text
            })

    document.close()

    return pages


def extract_text_from_pdf(file_path: str) -> str:
    pages = extract_pages_from_pdf(file_path)

    extracted_text = ""

    for page in pages:
        extracted_text += (
            f"\n--- Page {page['page_number']} ---\n"
            f"{page['text']}"
        )

    return extracted_text