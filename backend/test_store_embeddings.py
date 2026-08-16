from app.config.database import SessionLocal
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import generate_embedding


def store_embeddings():
    db = SessionLocal()

    try:
        chunks = db.query(DocumentChunk).filter(
            DocumentChunk.embedding.is_(None)
        ).all()

        print("Chunks without embeddings:", len(chunks))

        for index, chunk in enumerate(chunks, start=1):
            print(
                f"Generating embedding "
                f"{index}/{len(chunks)} "
                f"(chunk {chunk.chunk_index})"
            )

            embedding = generate_embedding(chunk.text)

            chunk.embedding = embedding

        db.commit()

        print("\nEmbeddings stored successfully!")

    except Exception as e:
        db.rollback()
        print("\nError:", e)

    finally:
        db.close()


if __name__ == "__main__":
    store_embeddings()