from dotenv import load_dotenv
import os
from typing import Optional, Dict, Any
from google import genai
    
class GeminiLLM:
    _instance: Optional['GeminiLLM'] = None

    def __new__(cls) -> 'GeminiLLM':
        if cls._instance is None:
            cls._instance = super(GeminiLLM, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self) -> None:
        load_dotenv('.env')
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self._client = genai.Client(api_key=api_key)
        
    def generate_completion(self, prompt: str, role: str = "recipe assistant") -> str:
        if not self._client:
            raise RuntimeError("Google AI client not initialized")
        formatted_prompt = f"[{role}]: {prompt}"
        
        response = self._client.models.generate_content(
            model="gemini-2.0-flash", contents=formatted_prompt
        )
        return response.text