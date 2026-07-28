from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_db, store
from app.schemas.schemas import UserCreate, UserLogin, Token
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db=Depends(get_db)):
    """
    Registers a new farmer user in the local store.
    """
    existing = next((u for u in db.users.values() if u["email"] == user_in.email), None)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists."
        )

    import uuid
    from datetime import datetime, timezone

    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_in.password)
    db_user = {
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": hashed_password,
        "primary_language": user_in.primary_language or "en",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    db.users[user_id] = db_user

    access_token = create_access_token(subject=user_id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user,
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db=Depends(get_db)):
    """
    Verifies farmer credentials and issues a JWT token.
    """
    user = next((u for u in db.users.values() if u["email"] == credentials.email), None)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    access_token = create_access_token(subject=user["id"])
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }
