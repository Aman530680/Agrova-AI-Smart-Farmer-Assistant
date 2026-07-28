import json
from typing import Optional

from app.core.config import settings

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - optional dependency path
    genai = None


# Initialize the Gemini configuration when the SDK is available
if genai is not None and settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY is not configured or the Gemini SDK is unavailable.")

class GeminiService:
    @staticmethod
    def get_model():
        if genai is None:
            raise RuntimeError("Gemini SDK is not available")

        # Using Gemini 2.0 Flash stable API identifier for fast, multi-modal responses
        return genai.GenerativeModel("gemini-2.0-flash")

    @classmethod
    async def chat_stream(cls, prompt: str, history: list = None):
        """
        Connects to Gemini 2.0 Flash to stream responses.
        """
        if not settings.GEMINI_API_KEY:
            yield "Evaluation Mode: Please configure your GEMINI_API_KEY in the `.env` file to retrieve live responses."
            return

        model = cls.get_model()

        try:
            if history:
                formatted_history = []
                for item in history:
                    formatted_history.append({
                        "role": "user" if item["role"] == "user" else "model",
                        "parts": [item["content"]]
                    })
                chat = model.start_chat(history=formatted_history)
                response = chat.send_message(prompt, stream=True)
            else:
                response = model.generate_content(prompt, stream=True)

            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"\n[Error calling Gemini service: {str(e)}]"

    @classmethod
    async def analyze_crop_image(cls, image_bytes: bytes, mime_type: str, user_text: str = None) -> dict:
        """
        Examines leaf/crop conditions and extracts symptoms, treatment suggestions,
        and organic/chemical pesticide recommendation lists using vision models.
        """
        if not settings.GEMINI_API_KEY:
            return {
                "disease_detected": "Rice Blast (Evaluation Mode)",
                "symptoms": "Leaf spots, lesion formations, gray centers, yellow halo rings.",
                "treatment": "Reduce nitrogen applications and ensure proper plant spacings.",
                "organic_solution": "Apply neem seed kernel extracts (NSKE 5%) or Pseudomonas fluorescens formulations.",
                "chemical_solution": "Spray Tricyclazole 75 WP at 0.6 grams per liter of water.",
                "recommended_pesticides": ["Tricyclazole", "Carbendazim", "Kasugamycin"],
                "warning": "API key missing. Returning diagnostic simulation results."
            }

        model = cls.get_model()
        system_instruction = (
            "You are a professional plant pathologist and agricultural advisor. "
            "Inspect the provided image of the crop leaf, diagnose any disease or pest, and provide details. "
            "Response MUST be in strict JSON format matching this schema: "
            "{\n"
            "  \"disease_detected\": \"Name of the disease / pest\",\n"
            "  \"symptoms\": \"Bullet points detailing visual symptoms\",\n"
            "  \"treatment\": \"General crop advisory actions\",\n"
            "  \"organic_solution\": \"Organic management protocols\",\n"
            "  \"chemical_solution\": \"Chemical treatment controls\",\n"
            "  \"recommended_pesticides\": [\"Pesticide A\", \"Pesticide B\"]\n"
            "}\n"
            "Do not add any markup or chat conversational styling surrounding the JSON response."
        )

        try:
            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }
            
            prompt = system_instruction
            if user_text:
                prompt += f"\nUser description notes: {user_text}"

            # Multimodal call with image and text prompt
            response = model.generate_content([prompt, image_part])
            
            text = response.text.strip()
            # Remove markdown JSON wrappers if present
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            return json.loads(text)
        except Exception as e:
            return {
                "error": f"Failed to diagnose image: {str(e)}",
                "disease_detected": "Diagnostic failure",
                "symptoms": "Unable to extract visual parameters.",
                "treatment": "Please check image clarity and try again.",
                "organic_solution": "N/A",
                "chemical_solution": "N/A",
                "recommended_pesticides": []
            }
