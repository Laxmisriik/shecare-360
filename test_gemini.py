import os
from google import genai

# Initialize the Gemini client with the API key from the environment.
# Never hardcode secrets in source. Set GEMINI_API_KEY in your .env / shell.
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise SystemExit("GEMINI_API_KEY is not set. Export it or add it to .env before running.")

client = genai.Client(api_key=API_KEY)

# ✅ Choose a supported model (from your list)
model = "models/gemini-2.5-flash"

# ✅ Send a simple text prompt
response = client.models.generate_content(
    model=model,
    contents="Hello Gemini! How are you?"
)

# ✅ Print the AI's reply
print(response.text)
