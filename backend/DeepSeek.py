from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import Optional, Dict, Any

class DeepSeekAI:
    _instance: Optional['DeepSeekAI'] = None
    _client: Optional[OpenAI] = None

    def __new__(cls) -> 'DeepSeekAI':
        if cls._instance is None:
            cls._instance = super(DeepSeekAI, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self) -> None:
        load_dotenv('.env')
        api_key = os.getenv("API_KEY")
        if not api_key:
            raise ValueError("API_KEY not found in environment variables")
        
        self._client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

    def generate_completion(self, prompt: str, site_url: str = "", site_name: str = "") -> str:
        if not self._client:
            raise RuntimeError("OpenAI client not initialized")

        completion = self._client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": site_url,
                "X-Title": site_name,
            },
            extra_body={},
            model="deepseek/deepseek-r1-zero:free",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return completion.choices[0].message.content