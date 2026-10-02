def validate_quiz_questions(
    questions: list,
    expected_count: int
):
    if not isinstance(questions, list):
        raise ValueError(
            "Quiz questions must be a list."
        )

    if len(questions) != expected_count:
        raise ValueError(
            f"Expected {expected_count} questions, "
            f"but received {len(questions)}."
        )

    required_fields = [
        "question_text",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_option",
    ]

    for index, question in enumerate(questions, start=1):

        if not isinstance(question, dict):
            raise ValueError(
                f"Question {index} has an invalid format."
            )

        for field in required_fields:

            value = question.get(field)

            if not isinstance(value, str) or not value.strip():
                raise ValueError(
                    f"Question {index} is missing "
                    f"'{field}'."
                )

        correct_option = question["correct_option"].upper()

        if correct_option not in {"A", "B", "C", "D"}:
            raise ValueError(
                f"Question {index} has an invalid "
                f"correct option."
            )

        question["correct_option"] = correct_option

        explanation = question.get("explanation")

        if explanation is not None:
            if not isinstance(explanation, str):
                raise ValueError(
                    f"Question {index} has an invalid "
                    f"explanation."
                )

    return questions