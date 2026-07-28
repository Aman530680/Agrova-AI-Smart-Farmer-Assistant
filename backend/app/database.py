from typing import Any, Dict, List
from app.core.config import settings


class InMemoryStore:
    def __init__(self) -> None:
        self.users: Dict[str, Dict[str, Any]] = {}
        self.crop_calendars: Dict[str, Dict[str, Any]] = {}
        self.saved_markets: Dict[str, Dict[str, Any]] = {}
        self.bookmarked_schemes: Dict[str, Dict[str, Any]] = {}


store = InMemoryStore()


async def get_db():
    """Compatibility dependency for the existing API layer."""
    yield store
