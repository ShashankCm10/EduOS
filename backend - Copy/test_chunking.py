from app.config.database import SessionLocal
from app.models.study_material import StudyMaterial
from app.services.pdf_service import extract_pages_from_pdf
from app.services.text_service import clean_text
from app.services.chunk_service import split_pages_into_chunks


db = SessionLocal()

material = db.query(StudyMaterial).filter(
    StudyMaterial.id == 4
).first()

if not material:
    print("Study material not found")
else:
    pages = extract_pages_from_pdf(material.file_path)

    cleaned_pages = []

    for page in pages:
        cleaned_pages.append({
            "page_number": page["page_number"],
            "text": clean_text(page["text"])
        })

    chunks = split_pages_into_chunks(
        cleaned_pages,
        chunk_size=1000,
        overlap=200
    )

    print("Number of pages:", len(cleaned_pages))
    print("Number of chunks:", len(chunks))

    for i, chunk in enumerate(chunks[:10], start=1):
        print(f"\n--- Chunk {i} ---")
        print("Page:", chunk["page_number"])
        print("Text:", chunk["text"][:500])

db.close()