# sentiment.py
from transformers import pipeline

def get_emotion_pipeline():
    return pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True,
    )

_emotion_pipeline = None

def _ensure_pipeline():
    global _emotion_pipeline
    if _emotion_pipeline is None:
        _emotion_pipeline = get_emotion_pipeline()
    return _emotion_pipeline

def detect_emotion(text: str):
    """Return (label, score) — label is emotion string, score is float 0..1."""
    pipe = _ensure_pipeline()
    results = pipe(text)[0]
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    top = results[0]
    return top["label"].lower(), float(top["score"])

def analyze_sentiment(text: str) -> str:
    """Wrapper to keep compatibility with Flask route. Returns only the emotion label."""
    label, score = detect_emotion(text)
    return label
