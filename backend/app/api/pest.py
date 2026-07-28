from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.api.deps import get_current_user
from app.services.gemini import GeminiService
from typing import Optional

router = APIRouter(prefix="/pest", tags=["Pest Management"])

@router.post("/diagnose")
async def diagnose_leaf(
    image: UploadFile = File(...),
    notes: Optional[str] = Form(None),
    current_user=Depends(get_current_user)
):
    """
    Accepts crop image uploads, runs them through Gemini's multi-modal vision system,
    and returns a structured diagnosis list containing organic and chemical solutions.
    """
    image_bytes = await image.read()
    mime_type = image.content_type or "image/jpeg"
    
    analysis_results = await GeminiService.analyze_crop_image(
        image_bytes=image_bytes,
        mime_type=mime_type,
        user_text=notes
    )
    return analysis_results
