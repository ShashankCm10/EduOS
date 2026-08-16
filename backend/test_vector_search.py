from app.config.database import SessionLocal
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import generate_embedding


def search_chunks(question: str, limit: int = 5):
    db = SessionLocal()

    try:
        question_embedding = generate_embedding(question)

        results = (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.study_material_id == 4,
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

        return results

    finally:
        db.close()


if __name__ == "__main__":

    question = "What is the Perception-Reasoning-Action loop?"

    results = search_chunks(question)

    print("\n===== SEARCH RESULTS =====")

    for rank, chunk in enumerate(results, start=1):

        print(f"\n--- Result {rank} ---")
        print("Chunk:", chunk.chunk_index)
        print("Page:", chunk.page_number)
        print("Text:")
        print(chunk.text[:500])