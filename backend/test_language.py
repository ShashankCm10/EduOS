from app.services.language_service import detect_language


english_text = """
Agentic AI systems use perception, reasoning and action
to interact with their environment.
"""

kannada_text = """
ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವ್ಯವಸ್ಥೆಗಳು ಮಾಹಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು
ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.
"""

print("English:", detect_language(english_text))
print("Kannada:", detect_language(kannada_text))