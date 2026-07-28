from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from app.database import get_db
from app.api.deps import get_current_user
from app.schemas.schemas import BookmarkedSchemeCreate, BookmarkedSchemeResponse
from app.services.schemes import SchemesService

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("")
async def get_schemes(
    category: str = None,
    current_user=Depends(get_current_user)
):
    """
    Returns available schemes with optional category filtration.
    """
    schemes = await SchemesService.get_schemes(category)
    return schemes

@router.get("/bookmarks", response_model=list[BookmarkedSchemeResponse])
async def get_bookmarks(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retrieves the user's bookmarked schemes.
    """
    return [item for item in db.bookmarked_schemes.values() if item.get("user_id") == current_user["id"]]

@router.post("/bookmarks", response_model=BookmarkedSchemeResponse, status_code=status.HTTP_201_CREATED)
async def bookmark_scheme(
    bookmark_in: BookmarkedSchemeCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Saves a scheme bookmark.
    """
    if any(item.get("user_id") == current_user["id"] and item.get("scheme_id") == bookmark_in.scheme_id for item in db.bookmarked_schemes.values()):
        raise HTTPException(
            status_code=400,
            detail="You have already bookmarked this scheme."
        )

    bookmark_id = str(uuid.uuid4())
    db_bookmark = {
        "id": bookmark_id,
        "user_id": current_user["id"],
        "scheme_id": bookmark_in.scheme_id,
        "bookmarked_at": "now",
    }
    db.bookmarked_schemes[bookmark_id] = db_bookmark
    return db_bookmark

@router.delete("/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_bookmark(
    bookmark_id: uuid.UUID,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Removes a bookmarked scheme from the database.
    """
    bookmark = next((item for item in db.bookmarked_schemes.values() if item.get("id") == str(bookmark_id) and item.get("user_id") == current_user["id"]), None)
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark entry not found.")
        
    if bookmark:
        db.bookmarked_schemes.pop(str(bookmark_id), None)
    return
