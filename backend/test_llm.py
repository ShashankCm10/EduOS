from app.services.llm_service import generate_answer


context = """
The Perception-Reasoning-Action (PRA) loop is a fundamental
paradigm for designing intelligent agents.

It describes a continuous cycle where an agent senses changes
in its environment, processes information, makes decisions,
and executes actions.

The perception stage gathers information from the environment.
The reasoning module processes the perceived information.
The agent then decides what action to take and executes that
action.
"""

question = "What is the Perception-Reasoning-Action loop?"


answer = generate_answer(
    question,
    context
)

print("\n===== GENERATED ANSWER =====\n")
print(answer)