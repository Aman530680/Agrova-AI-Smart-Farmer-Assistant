from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.api.deps import get_current_user
from app.services.gemini import GeminiService
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/chatbot", tags=["AI Chatbot"])

class ChatMessage(BaseModel):
    role: str  # 'user' or 'model'
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: Optional[List[ChatMessage]] = None

@router.post("/query")
async def query_chatbot(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):
    """
    Accepts user prompts and returns a live word-by-word streaming text response
    representing AI agriculture suggestions.
    """
    async def event_generator():
        formatted_history = []
        if request.history:
            for item in request.history:
                formatted_history.append({
                    "role": item.role,
                    "content": item.content
                })
        
        async for chunk in GeminiService.chat_stream(request.prompt, formatted_history):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")
