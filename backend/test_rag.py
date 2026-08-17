from app.config.database import SessionLocal
from app.services.rag_service import answer_question


MATERIAL_ID = 4


def test_relevant_question(db):
    question = "What is the Perception-Reasoning-Action loop?"

    result = answer_question(
        db=db,
        material_id=MATERIAL_ID,
        question=question,
        limit=5
    )

    assert result["answer"]
    assert result["sources"]
    assert result["metadata"]["chunks_retrieved"] > 0
    assert result["metadata"]["chunks_used"] > 0

    print("\n[PASS] Relevant question")
    print("Answer:", result["answer"])
    print("Sources:", result["sources"])
    print("Metadata:", result["metadata"])


def test_irrelevant_question(db):
    question = "What is the capital of Australia?"

    result = answer_question(
        db=db,
        material_id=MATERIAL_ID,
        question=question,
        limit=5
    )

    assert result["sources"] == []
    assert (
        result["answer"]
        == "This information is not available in the provided study material."
    )

    print("\n[PASS] Irrelevant question")
    print("Answer:", result["answer"])


def test_invalid_material(db):
    result = answer_question(
        db=db,
        material_id=999999,
        question="What is the PRA loop?",
        limit=5
    )

    assert result["sources"] == []
    assert result["metadata"]["chunks_retrieved"] == 0

    print("\n[PASS] Invalid material")


def run_tests():
    db = SessionLocal()

    try:
        test_relevant_question(db)
        test_irrelevant_question(db)
        test_invalid_material(db)

        print("\n==============================")
        print("ALL RAG TESTS PASSED")
        print("==============================")

    finally:
        db.close()


if __name__ == "__main__":
    run_tests()