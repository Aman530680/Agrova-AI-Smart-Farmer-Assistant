from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database import get_db
from app.core.security import decode_access_token
from app.core.config import settings

# Define standard OAuth2 security extraction from headers (auto_error=False allows demo fallback)
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False
)

def _get_or_create_demo_user(db):
    demo = db.users.get("demo-rajesh")
    if not demo:
        demo = {
            "id": "demo-rajesh",
            "name": "Rajesh Kumar",
            "email": "rajesh@agrova.ai",
            "primary_language": "en",
            "created_at": "2024-01-01T00:00:00+00:00",
        }
        db.users["demo-rajesh"] = demo
    return demo

async def get_current_user(
    db=Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """
    Validates token from Authorization header and yields the authenticated User object.
    Supports standard JWT tokens, demo tokens ('demo-token'), and in-memory demo fallback.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expired or invalid token. Please sign in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 1. Handle missing token
    if not token:
        if settings.USE_IN_MEMORY_STORE:
            return _get_or_create_demo_user(db)
        raise credentials_exception

    # 2. Handle demo token (from frontend demo session)
    if token in ("demo-token", "Bearer demo-token"):
        return _get_or_create_demo_user(db)

    # 3. Handle JWT token
    user_id = decode_access_token(token)
    if not user_id:
        if settings.USE_IN_MEMORY_STORE:
            return _get_or_create_demo_user(db)
        raise credentials_exception

    user = db.users.get(str(user_id)) or next((u for u in db.users.values() if str(u.get("id")) == str(user_id)), None)
    if not user:
        if settings.USE_IN_MEMORY_STORE or str(user_id) in ("demo-rajesh", "00000000-0000-0000-0000-000000000001"):
            return _get_or_create_demo_user(db)
        raise credentials_exception

    return user
