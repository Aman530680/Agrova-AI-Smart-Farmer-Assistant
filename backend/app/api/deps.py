from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import uuid
from app.database import get_db
from app.core.security import decode_access_token

# Define standard OAuth2 security extraction from headers
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)

async def get_current_user(
    db=Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    """
    Validates token from Authorization header and yields the authenticated User object.
    Raises 401 exception if authentication fails.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expired or invalid token. Please sign in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id = decode_access_token(token)
    if not user_id:
        raise credentials_exception
        
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise credentials_exception
        
    user = next((u for u in db.users.values() if u["id"] == str(user_uuid)), None)
    if not user:
        raise credentials_exception

    return user
