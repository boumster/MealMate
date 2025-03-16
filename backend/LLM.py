import json
import base64
from dotenv import load_dotenv
import os
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
import logging

    
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


    def calculate_calories(self, image_data: bytes) -> Dict[str, Any]:
        try:
            vision_content = {
                "parts": [
                    {
                        "text": """
                        You are a precise nutrition assistant. Analyze this food image and:

                        1. Identify each visible ingredient
                        2. Calculate approximate calories for each ingredient
                        3. Calculate macros (proteins, fats, carbohydrates) for each ingredient
                        4. Sum up the total calories and macros

                        Format your response exactly like this:
                        Here's the breakdown of calories and macros based on the image:

                        Ingredient: [Ingredient Name]
                        Calories: [Calories]
                        Proteins: [Proteins]
                        Fats: [Fats]
                        Carbohydrates: [Carbohydrates]

                        Total Calories: [Sum]
                        Total Proteins: [Sum]
                        Total Fats: [Sum]
                        Total Carbohydrates: [Sum]
                        """
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64.b64encode(image_data).decode("utf-8")
                        }
                    }
                ]
            }

            # Generate response
            response = self._client.models.generate_content(
                model="gemini-2.0-flash", contents=vision_content)
                
            if not response.text:
                raise ValueError("No response generated from the model")
                
            return response.text

        except Exception as e:
            logging.error(f"Error in calculate_calories: {str(e)}")
            raise RuntimeError(f"Failed to process image: {str(e)}")
                