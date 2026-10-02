from app.services.pdf_service import extract_text_from_pdf

file_path = "uploads/a1a61c93-004c-4de2-9927-c1c8feda8fc5.pdf"

text = extract_text_from_pdf(file_path)

print("----- EXTRACTED TEXT -----")
print(text[:3000])