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
    limit: int = 5,
    conversation_history=None
):
    # ---------------------------------------------------------
    # 1. Get study material
    # ---------------------------------------------------------

    material = (
        db.query(StudyMaterial)
        .filter(
            StudyMaterial.id == material_id
        )
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

    # ---------------------------------------------------------
    # 2. Generate embedding for the question
    # ---------------------------------------------------------

    question_embedding = generate_embedding(question)

    # ---------------------------------------------------------
    # 3. Semantic search using pgvector
    # ---------------------------------------------------------

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

    # ---------------------------------------------------------
    # 4. No chunks found
    # ---------------------------------------------------------

    if not results:
        return {
            "answer": (
                "This information is not available "
                "in the provided study material."
            ),
            "sources": [],
            "metadata": {
                "chunks_retrieved": 0,
                "chunks_used": 0
            }
        }

    # ---------------------------------------------------------
    # 5. Check relevance of best result
    # ---------------------------------------------------------

    best_distance = results[0][1]

    best_similarity = 1 - best_distance

    if best_similarity < RELEVANCE_THRESHOLD:
        return {
            "answer": (
                "This information is not available "
                "in the provided study material."
            ),
            "sources": [],
            "metadata": {
                "chunks_retrieved": len(results),
                "chunks_used": 0
            }
        }

    # ---------------------------------------------------------
    # 6. Build RAG context
    # ---------------------------------------------------------

    context_parts = []

    sources = []

    seen_sources = set()

    for chunk, distance in results:

        similarity = 1 - distance

        # Ignore chunks below relevance threshold
        if similarity < RELEVANCE_THRESHOLD:
            continue

        context_parts.append(
            f"""
Page: {chunk.page_number}

{chunk.text}
"""
        )

        # -----------------------------------------------------
        # Add source information
        # -----------------------------------------------------

        source_key = (
            material.id,
            chunk.page_number
        )

        if source_key not in seen_sources:

            sources.append(
                {
                    "document": (
                        material.original_filename
                        or material.title
                    ),
                    "page": chunk.page_number,
                    "relevance": round(
                        similarity,
                        4
                    )
                }
            )

            seen_sources.add(source_key)

    # ---------------------------------------------------------
    # 7. Make sure usable context exists
    # ---------------------------------------------------------

    if not context_parts:
        return {
            "answer": (
                "This information is not available "
                "in the provided study material."
            ),
            "sources": [],
            "metadata": {
                "chunks_retrieved": len(results),
                "chunks_used": 0
            }
        }

    # ---------------------------------------------------------
    # 8. Combine document chunks
    # ---------------------------------------------------------

    rag_context = "\n\n".join(context_parts)

    # ---------------------------------------------------------
    # 9. Add previous conversation history
    # ---------------------------------------------------------

    history_text = ""

    if conversation_history:

        history_parts = []

        for message in conversation_history:

            role = message["role"].capitalize()

            content = message["content"]

            history_parts.append(
                f"{role}: {content}"
            )

        history_text = "\n".join(
            history_parts
        )

    # ---------------------------------------------------------
    # 10. Build final context for Gemini
    # ---------------------------------------------------------

    context = rag_context

    if history_text:

        context = (
            "Previous conversation:\n"
            + history_text
            + "\n\n"
            + "Relevant study material:\n"
            + rag_context
        )

    # ---------------------------------------------------------
    # 11. Generate answer using Gemini
    # ---------------------------------------------------------

    answer = generate_answer(
        question=question,
        context=context
    )

    # ---------------------------------------------------------
    # 12. Return RAG result
    # ---------------------------------------------------------

    return {
        "answer": answer,
        "sources": sources,
        "metadata": {
            "chunks_retrieved": len(results),
            "chunks_used": len(context_parts)
        }
    }