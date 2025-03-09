from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("../../New folder/API.env") 
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY not found in environment variables")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key= api_key,
)

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
    },
    extra_body={},
    model="deepseek/deepseek-r1-zero:free",
    messages=[
        {
            "role": "user",
            "content": "Generate me an essay on the benefits of recycling."
        }
    ]
)
print(completion.choices[0].message.content)