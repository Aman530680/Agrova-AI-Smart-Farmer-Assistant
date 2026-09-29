from typing import Any, Dict, List
from app.core.config import settings
from app.core.security import get_password_hash

DEMO_USER_ID = "demo-rajesh"
DEMO_USER = {
    "id": DEMO_USER_ID,
    "name": "Rajesh Kumar",
    "email": "rajesh@agrova.ai",
    "password_hash": get_password_hash("demo1234"),
    "primary_language": "en",
    "created_at": "2024-01-01T00:00:00+00:00",
}


class InMemoryStore:
    def __init__(self) -> None:
        self.users: Dict[str, Dict[str, Any]] = {
            DEMO_USER_ID: DEMO_USER.copy(),
            "00000000-0000-0000-0000-000000000001": {**DEMO_USER, "id": "00000000-0000-0000-0000-000000000001"},
        }
        self.crop_calendars: Dict[str, Dict[str, Any]] = {}
        self.saved_markets: Dict[str, Dict[str, Any]] = {}
        self.bookmarked_schemes: Dict[str, Dict[str, Any]] = {}


store = InMemoryStore()


async def get_db():
    """Compatibility dependency for the existing API layer."""
    yield store
