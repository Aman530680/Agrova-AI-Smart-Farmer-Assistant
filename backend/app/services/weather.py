import httpx
import datetime
from app.core.config import settings

class WeatherService:
    @staticmethod
    async def get_weather_by_coords(lat: float, lon: float) -> dict:
        """
        Fetches meteorological data using coordinates and derives crop/soil recommendations.
        """
        if not settings.OPENWEATHER_API_KEY:
            # Simulated weather response for test scenarios
            return {
                "current": {
                    "temp": 28.5,
                    "humidity": 75,
                    "wind_speed": 12.0,
                    "condition": "Clouds",
                    "description": "scattered clouds"
                },
                "forecast": [
                    {"day": "Mon", "temp": 29.0, "condition": "Clear"},
                    {"day": "Tue", "temp": 28.0, "condition": "Rain"},
                    {"day": "Wed", "temp": 27.5, "condition": "Rain"},
                    {"day": "Thu", "temp": 29.5, "condition": "Clear"},
                    {"day": "Fri", "temp": 30.0, "condition": "Clouds"}
                ],
                "alerts": ["Moderate humidity. Keep monitoring soil moisture."],
                "recommendations": "Ideal soil moisture for fertilizer application. Avoid mid-day pesticide sprays."
            }
        
        async with httpx.AsyncClient() as client:
            try:
                # Get current weather conditions
                current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
                r = await client.get(current_url)
                if r.status_code != 200:
                    raise Exception(f"OpenWeather current API failed with status {r.status_code}")
                current_data = r.json()
                
                # Get 5-day / 3-hour forecasts
                forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
                rf = await client.get(forecast_url)
                forecast_data = rf.json()
                
                weather_info = {
                    "temp": current_data["main"]["temp"],
                    "humidity": current_data["main"]["humidity"],
                    "wind_speed": current_data["wind"]["speed"],
                    "condition": current_data["weather"][0]["main"],
                    "description": current_data["weather"][0]["description"]
                }
                
                # Process forecasts by selecting one data point per 24 hours
                forecast_list = []
                if "list" in forecast_data:
                    for i in range(0, len(forecast_data["list"]), 8):
                        item = forecast_data["list"][i]
                        date_obj = datetime.datetime.fromtimestamp(item["dt"])
                        day_name = date_obj.strftime("%a")
                        forecast_list.append({
                            "day": day_name,
                            "temp": item["main"]["temp"],
                            "condition": item["weather"][0]["main"]
                        })
                
                # Derive agricultural rules and warnings
                humidity = weather_info["humidity"]
                temp = weather_info["temp"]
                wind = weather_info["wind_speed"]
                condition_lower = weather_info["condition"].lower()
                
                alerts = []
                recommendations = "Standard farming conditions."
                
                if humidity > 80:
                    alerts.append("High humidity alert. Increases risk of fungal diseases like Blast or Powdery Mildew.")
                    recommendations = "Monitor crop foliage closely. Keep drainage channels clear."
                if wind > 18:
                    alerts.append("Strong wind alert. High drift rates.")
                    recommendations = "Halt all chemical spraying campaigns (pesticides, liquid fertilizers) today."
                if "rain" in condition_lower or "thunderstorm" in condition_lower or "drizzle" in condition_lower:
                    alerts.append("Precipitation expected today.")
                    recommendations = "Do not apply fertilizers or pesticides to prevent run-offs. Cover harvested crops."
                elif temp > 36:
                    alerts.append("Heat stress warning.")
                    recommendations = "Increase irrigation cycles to prevent wilting. Work only in early morning or late evening."
                else:
                    recommendations = "Favorable weather. Recommended for weeding, soil tilling, and planting."
                
                return {
                    "current": weather_info,
                    "forecast": forecast_list,
                    "alerts": alerts,
                    "recommendations": recommendations
                }
            except Exception as e:
                return {"error": f"Failed to retrieve weather reports: {str(e)}"}
