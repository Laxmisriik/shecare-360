# nlp/chatbot.py

import os
import re
from google import genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found.")

client = genai.Client(api_key=API_KEY)
MODEL_NAME = "models/gemini-2.5-flash"


# -----------------------------
# ACTIVITY EXTRACTION (ROBUST)
# -----------------------------
def extract_activity(text: str):
    """
    Extracts any user-mentioned activity using natural language patterns.
    Works for: 'going to temple', 'drink coffee', 'dance', etc.
    """
    patterns = [
        r"\bi am going to (.+)",
        r"\bi'm going to (.+)",
        r"\bi want to (.+)",
        r"\bi am planning to (.+)",
        r"\bi will (.+)",
        r"\bi feel like (.+)"
    ]

    text_lower = text.lower()

    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            return match.group(1).strip()

    return None


# -----------------------------
# MEMORY SUMMARIZATION
# -----------------------------
def summarize_memory(memory):
    emotions = [m.get("mood") for m in memory if m.get("mood")]
    dominant_emotion = emotions[-1] if emotions else "neutral"

    last_activity = None
    for m in reversed(memory):
        if m.get("activity"):
            last_activity = m["activity"]
            break

    return dominant_emotion, last_activity


# -----------------------------
# FALLBACK (LANGUAGE-SAFE)
# -----------------------------
def fallback_reply(user_text: str) -> str:
    return "I'm here with you. Would you like to share a bit more?"


# -----------------------------
# MAIN REPLY FUNCTION
# -----------------------------
def get_reply(text: str, mood: str, memory: list) -> str:
    activity = extract_activity(text)

    # store activity into memory (caller should persist this)
    if activity:
        memory.append({
            "user": text,
            "mood": mood,
            "activity": activity
        })

    dominant_emotion, last_activity = summarize_memory(memory)
    effective_activity = activity or last_activity

    memory_context = f"""
Recent emotional context: {dominant_emotion}
Recent activity mentioned: {effective_activity if effective_activity else "None"}
"""

    prompt = f"""
You are a supportive, multilingual mental health journaling assistant.

IMPORTANT:
- The user may write in ANY language.
- ALWAYS reply in the SAME language as the user's message.

{memory_context}

Current user mood: {mood}
User message: "{text}"

Rules:
- Respect emotional continuity.
- Gently acknowledge mood changes.
- If an activity is mentioned, respond naturally to it.
- Do NOT assume emotions not stated.
- No medical or clinical advice.
- 1–3 sentences only.
- End with EXACTLY ONE gentle open-ended question.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        reply = response.text.strip()
        return reply if reply else fallback_reply(text)

    except Exception as e:
        print("❌ Gemini error:", e)
        return fallback_reply(text)
