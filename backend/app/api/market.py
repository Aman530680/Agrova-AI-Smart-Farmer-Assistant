from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from app.database import get_db
from app.api.deps import get_current_user
from app.schemas.schemas import SavedMarketCreate, SavedMarketResponse
from app.services.market import MarketService

router = APIRouter(prefix="/market", tags=["Market Prices"])

@router.get("/prices")
async def get_prices(
    query: str = None,
    state: str = None,
    current_user=Depends(get_current_user)
):
    """
    Returns live pricing lists matching optional query and state parameters.
    """
    prices = await MarketService.get_live_prices(query, state)
    return prices

@router.get("/favorites", response_model=list[SavedMarketResponse])
async def get_favorites(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retrieves the user's bookmarked commodity items.
    """
    return [item for item in db.saved_markets.values() if item.get("user_id") == current_user["id"]]

@router.post("/favorites", response_model=SavedMarketResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    favorite_in: SavedMarketCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Adds a crop commodity to the watch list.
    """
    # Check if duplicate item exists
    if any(
        item.get("user_id") == current_user["id"]
        and item.get("commodity") == favorite_in.commodity
        and item.get("market_name") == favorite_in.market_name
        for item in db.saved_markets.values()
    ):
        raise HTTPException(
            status_code=400,
            detail="This commodity is already on your watch list."
        )

    favorite_id = str(uuid.uuid4())
    db_fav = {
        "id": favorite_id,
        "user_id": current_user["id"],
        "commodity": favorite_in.commodity,
        "market_name": favorite_in.market_name,
        "created_at": "now",
    }
    db.saved_markets[favorite_id] = db_fav
    return db_fav

@router.delete("/favorites/{fav_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    fav_id: uuid.UUID,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Deletes a watched commodity item from the favorites list.
    """
    # Delete where ID matches and belongs to the authenticated user
    db_fav = next((item for item in db.saved_markets.values() if item.get("id") == str(fav_id) and item.get("user_id") == current_user["id"]), None)
    if not db_fav:
        raise HTTPException(status_code=404, detail="Saved market item not found.")
    
    db.saved_markets.pop(str(fav_id), None)
    return
