from fastapi import APIRouter, Depends, Query
from app.api.deps import get_current_user
from app.services.weather import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather Forecast"])

@router.get("/forecast")
async def get_forecast(
    lat: float = Query(..., description="Latitude of location"),
    lon: float = Query(..., description="Longitude of location"),
    current_user=Depends(get_current_user)
):
    """
    Returns current weather data, multi-day forecast summaries,
    warnings, and crop-saving management actions for user coordinate.
    """
    data = await WeatherService.get_weather_by_coords(lat, lon)
    return data
