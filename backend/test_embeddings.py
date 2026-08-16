from app.services.embedding_service import generate_embedding
import numpy as np


def cosine_similarity(vector1, vector2):
    vector1 = np.array(vector1)
    vector2 = np.array(vector2)

    return np.dot(vector1, vector2) / (
        np.linalg.norm(vector1) *
        np.linalg.norm(vector2)
    )


english_text = "Artificial intelligence can learn from data."

kannada_text = "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ದತ್ತಾಂಶದಿಂದ ಕಲಿಯಬಹುದು."

unrelated_text = "The weather is very hot today."


english_embedding = generate_embedding(english_text)
kannada_embedding = generate_embedding(kannada_text)
unrelated_embedding = generate_embedding(unrelated_text)


english_kannada_similarity = cosine_similarity(
    english_embedding,
    kannada_embedding
)

english_unrelated_similarity = cosine_similarity(
    english_embedding,
    unrelated_embedding
)


print("\nEnglish:")
print(english_text)

print("\nKannada:")
print(kannada_text)

print("\nUnrelated:")
print(unrelated_text)

print("\nEnglish ↔ Kannada similarity:")
print(english_kannada_similarity)

print("\nEnglish ↔ Unrelated similarity:")
print(english_unrelated_similarity)