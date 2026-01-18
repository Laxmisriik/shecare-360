import os
from google import genai

# ✅ Initialize the Gemini client with your API key
client = genai.Client(api_key="AIzaSyD66oZIV1bkwUEuEeR8huU3eOeQu_r39mg")

# ✅ Choose a supported model (from your list)
model = "models/gemini-2.5-flash"

# ✅ Send a simple text prompt
response = client.models.generate_content(
    model=model,
    contents="Hello Gemini! How are you?"
)

# ✅ Print the AI's reply
print(response.text)
