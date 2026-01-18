EMERGENCY_WORDS = [
"suicide",
"kill myself",
"end my life",
"self harm",
"i will die",
]




def detect_emergency(text: str) -> bool:
    t = (text or "").lower()
    for w in EMERGENCY_WORDS:
        if w in t:
            return True
    return False
