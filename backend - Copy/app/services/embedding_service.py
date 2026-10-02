from sentence_transformers import SentenceTransformer


MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

model = SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str):
    if not text or not text.strip():
        return []

    embedding = model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()