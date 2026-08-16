import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.study_material import StudyMaterial
from app.models.subject import Subject
from app.models.user import User
from app.schemas.study_material import StudyMaterialCreate
from app.services.pdf_service import (
    extract_text_from_pdf,
    extract_pages_from_pdf
)
from app.services.language_service import detect_language
from app.models.document_chunk import DocumentChunk
from app.services.text_service import clean_text
from app.services.chunk_service import split_pages_into_chunks
from app.schemas.search import SearchRequest
from app.services.embedding_service import generate_embedding

router = APIRouter(
    prefix="/study-materials",
    tags=["Study Materials"]
)


@router.post("/")
def create_study_material(
    title: str = Form(...),
    description: str = Form(None),
    subject_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    upload_dir = "uploads"

    original_filename = file.filename

    file_extension = os.path.splitext(original_filename)[1].lower()

    stored_filename = f"{uuid.uuid4()}{file_extension}"

    file_path = os.path.join(
        upload_dir,
        stored_filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    new_material = StudyMaterial(
        title=title,
        description=description,
        original_filename=original_filename,
        stored_filename=stored_filename,
        file_path=file_path,
        user_id=current_user.id,
        subject_id=subject_id
    )

    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    return {
        "message": "Study material uploaded successfully",
        "material_id": new_material.id,
        "file_name": original_filename
    }


@router.get("/")
def get_study_materials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    materials = db.query(StudyMaterial).filter(
        StudyMaterial.user_id == current_user.id
    ).all()

    return materials


@router.get("/{material_id}")
def get_study_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    return material

@router.post("/{material_id}/process")
def process_study_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    if material.extracted_text:
        return {
            "message": "PDF already processed",
            "material_id": material.id,
            "language": material.language,
            "characters_extracted": len(material.extracted_text)
        }

    if not material.file_path or not os.path.exists(material.file_path):
        raise HTTPException(
            status_code=404,
            detail="PDF file not found"
        )

    extracted_text = extract_text_from_pdf(
        material.file_path
    )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from this PDF"
        )

    language = detect_language(extracted_text)

    material.extracted_text = extracted_text
    material.language = language

    db.commit()
    db.refresh(material)

    return {
        "message": "PDF processed successfully",
        "material_id": material.id,
        "language": language,
        "characters_extracted": len(extracted_text)
    }


@router.get("/{material_id}/file")
def get_study_material_file(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    if not material.file_path or not os.path.exists(material.file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    return FileResponse(
        path=material.file_path,
        filename=material.original_filename,
        media_type="application/pdf"
    )


@router.put("/{material_id}")
def update_study_material(
    material_id: int,
    material_data: StudyMaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    subject = db.query(Subject).filter(
        Subject.id == material_data.subject_id,
        Subject.user_id == current_user.id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    material.title = material_data.title
    material.description = material_data.description
    material.subject_id = material_data.subject_id

    db.commit()
    db.refresh(material)

    return {
        "message": "Study material updated successfully",
        "material_id": material.id
    }


@router.delete("/{material_id}")
def delete_study_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    if material.file_path and os.path.exists(material.file_path):
        os.remove(material.file_path)

    db.delete(material)
    db.commit()

    return {
        "message": "Study material and file deleted successfully"
    }
    
@router.post("/{material_id}/chunks")
def create_document_chunks(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    if not material.file_path or not os.path.exists(material.file_path):
        raise HTTPException(
            status_code=404,
            detail="PDF file not found"
        )

    existing_chunks = db.query(DocumentChunk).filter(
        DocumentChunk.study_material_id == material.id
    ).count()

    if existing_chunks > 0:
        return {
            "message": "Document already chunked",
            "material_id": material.id,
            "chunks_created": existing_chunks
        }

    pages = extract_pages_from_pdf(
        material.file_path
    )

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

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No chunks could be created from this PDF"
        )

    for index, chunk in enumerate(chunks):
        new_chunk = DocumentChunk(
            study_material_id=material.id,
            chunk_index=index,
            page_number=chunk["page_number"],
            text=chunk["text"]
        )

        db.add(new_chunk)

    db.commit()

    return {
        "message": "Document chunks created successfully",
        "material_id": material.id,
        "chunks_created": len(chunks)
    }
    
@router.post("/{material_id}/search")
def search_study_material(
    material_id: int,
    search_data: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(StudyMaterial).filter(
        StudyMaterial.id == material_id,
        StudyMaterial.user_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Study material not found"
        )

    question_embedding = generate_embedding(
        search_data.question
    )

    results = (
        db.query(
            DocumentChunk,
            DocumentChunk.embedding.cosine_distance(
                question_embedding
            ).label("distance")
        )
        .filter(
            DocumentChunk.study_material_id == material_id,
            DocumentChunk.embedding.is_not(None)
        )
        .order_by(
            DocumentChunk.embedding.cosine_distance(
                question_embedding
            )
        )
        .limit(search_data.limit)
        .all()
    )

    search_results = []

    for chunk, distance in results:

        similarity = 1 - distance

        search_results.append({
            "chunk_id": chunk.id,
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number,
            "similarity": round(similarity, 4),
            "source": material.original_filename,
            "title": material.title,
            "text": chunk.text
        })

    return {
        "material_id": material_id,
        "question": search_data.question,
        "results": search_results
    }