from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from app.database import get_db
from app.api.deps import get_current_user
from app.schemas.schemas import CropCalendarCreate, CropCalendarResponse, CropCalendarUpdate
from app.services.crop import CropService

router = APIRouter(prefix="/crop", tags=["Crop Lifecycle Tracker"])

@router.get("/calendars", response_model=list[CropCalendarResponse])
async def get_calendars(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Lists all active crop tracking logs for the current user.
    """
    calendars = [
        item for item in db.crop_calendars.values()
        if item.get("user_id") == current_user["id"]
    ]
    return calendars

@router.post("/calendars", response_model=CropCalendarResponse, status_code=status.HTTP_201_CREATED)
async def create_calendar(
    calendar_in: CropCalendarCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Creates a new crop tracking database record with its initial stage and sowing date.
    """
    calendar_id = str(uuid.uuid4())
    db_cal = {
        "id": calendar_id,
        "user_id": current_user["id"],
        "crop_name": calendar_in.crop_name,
        "sowing_date": calendar_in.sowing_date.isoformat(),
        "current_stage": calendar_in.current_stage,
        "created_at": "now",
    }
    db.crop_calendars[calendar_id] = db_cal
    return db_cal

@router.get("/calendars/{cal_id}/schedule")
async def get_schedule(
    cal_id: uuid.UUID,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Calculates and returns the full sequential farming schedule based on the crop's sowing date.
    """
    result = await db.execute(
        select(CropCalendar).where(
            CropCalendar.id == cal_id,
            CropCalendar.user_id == current_user.id
        )
    )
    cal = result.scalars().first()
    if not cal:
        raise HTTPException(status_code=404, detail="Crop calendar entry not found.")
        
    schedule = CropService.generate_calendar(cal["crop_name"], cal["sowing_date"])
    return {
        "crop_name": cal["crop_name"],
        "sowing_date": cal["sowing_date"],
        "current_stage": cal["current_stage"],
        "schedule": schedule
    }

@router.patch("/calendars/{cal_id}", response_model=CropCalendarResponse)
async def update_calendar_stage(
    cal_id: uuid.UUID,
    calendar_update: CropCalendarUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Updates the active growth stage phase of the crop.
    """
    result = await db.execute(
        select(CropCalendar).where(
            CropCalendar.id == cal_id,
            CropCalendar.user_id == current_user.id
        )
    )
    cal = result.scalars().first()
    if not cal:
        raise HTTPException(status_code=404, detail="Crop calendar entry not found.")
        
    if calendar_update.current_stage is not None:
        cal["current_stage"] = calendar_update.current_stage

    db.crop_calendars[str(cal_id)] = cal
    return cal

@router.delete("/calendars/{cal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_calendar(
    cal_id: uuid.UUID,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Removes a crop tracking entry from the database.
    """
    result = await db.execute(
        select(CropCalendar).where(
            CropCalendar.id == cal_id,
            CropCalendar.user_id == current_user.id
        )
    )
    cal = result.scalars().first()
    if not cal:
        raise HTTPException(status_code=404, detail="Crop calendar entry not found.")
        
    if cal:
        db.crop_calendars.pop(str(cal_id), None)
    return
