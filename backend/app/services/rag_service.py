from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.models.study_material import StudyMaterial
from app.services.embedding_service import generate_embedding
from app.services.llm_service import generate_answer


RELEVANCE_THRESHOLD = 0.40


def answer_question(
    db: Session,
    material_id: int,
    question: str,
    limit: int = 5
):
    material = (
        db.query(StudyMaterial)
        .filter(StudyMaterial.id == material_id)
        .first()
    )

    if not material:
        return {
            "answer": "Study material not found.",
            "sources": [],
            "metadata": {
                "chunks_retrieved": 0,
                "chunks_used": 0
            }
        }

    question_embedding = generate_embedding(question)

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
        .limit(limit)
        .all()
    )

    if not results:
        return {
            "answer": "This information is not available in the provided study material.",
            "sources": [],
            "metadata": {
                "chunks_retrieved": 0,
                "chunks_used": 0
            }
        }

    best_distance = results[0][1]
    best_similarity = 1 - best_distance

    if best_similarity < RELEVANCE_THRESHOLD:
        return {
            "answer": "This information is not available in the provided study material.",
            "sources": [],
            "metadata": {
                "chunks_retrieved": len(results),
                "chunks_used": 0
            }
        }

    context_parts = []
    sources = []
    seen_sources = set()

    for chunk, distance in results:

        similarity = 1 - distance

        if similarity < RELEVANCE_THRESHOLD:
            continue

        context_parts.append(
            f"""
Page: {chunk.page_number}

{chunk.text}
"""
        )

        source_key = (
            material.id,
            chunk.page_number
        )

        if source_key not in seen_sources:
            sources.append({
                "document": material.original_filename or material.title,
                "page": chunk.page_number,
                "relevance": round(similarity, 4)
            })

            seen_sources.add(source_key)

    if not context_parts:
        return {
            "answer": "This information is not available in the provided study material.",
            "sources": [],
            "metadata": {
                "chunks_retrieved": len(results),
                "chunks_used": 0
            }
        }

    context = "\n\n".join(context_parts)

    answer = generate_answer(
        question=question,
        context=context
    )

    return {
        "answer": answer,
        "sources": sources,
        "metadata": {
            "chunks_retrieved": len(results),
            "chunks_used": len(context_parts)
        }
    }