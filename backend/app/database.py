import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

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
    db_type = "in-memory"
    status_message = "Active (Local In-Memory Mode)"

    def __init__(self) -> None:
        self.users: Dict[str, Dict[str, Any]] = {
            DEMO_USER_ID: DEMO_USER.copy(),
            "00000000-0000-0000-0000-000000000001": {**DEMO_USER, "id": "00000000-0000-0000-0000-000000000001"},
        }
        self.crop_calendars: Dict[str, Dict[str, Any]] = {}
        self.saved_markets: Dict[str, Dict[str, Any]] = {}
        self.bookmarked_schemes: Dict[str, Dict[str, Any]] = {}


class MongoCollectionDict:
    """Dictionary-compatible wrapper for a MongoDB collection."""
    def __init__(self, collection):
        self.col = collection

    def values(self) -> List[Dict[str, Any]]:
        return list(self.col.find({}, {"_id": 0}))

    def get(self, key: Any, default=None):
        doc = self.col.find_one({"id": str(key)}, {"_id": 0})
        if doc is None and isinstance(key, str) and "@" in key:
            doc = self.col.find_one({"email": key}, {"_id": 0})
        return doc if doc is not None else default

    def __getitem__(self, key: Any):
        val = self.get(key)
        if val is None:
            raise KeyError(key)
        return val

    def __setitem__(self, key: Any, value: Dict[str, Any]):
        doc = dict(value)
        doc["id"] = str(key)
        to_store = {k: v for k, v in doc.items() if k != "_id"}
        self.col.replace_one({"id": str(key)}, to_store, upsert=True)

    def pop(self, key: Any, default=None):
        val = self.get(key)
        if val is not None:
            self.col.delete_one({"id": str(key)})
            return val
        return default

    def __contains__(self, key: Any) -> bool:
        return self.col.count_documents({"id": str(key)}, limit=1) > 0

    def __len__(self) -> int:
        return self.col.count_documents({})


class MongoStore:
    """MongoDB Atlas persistent store."""
    db_type = "mongodb"

    def __init__(self, uri: str, db_name: str) -> None:
        import pymongo
        self.client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Verify connection
        self.client.admin.command("ping")
        self.db = self.client[db_name]
        self.status_message = f"Connected to MongoDB Atlas ({db_name})"
        
        self.users = MongoCollectionDict(self.db["users"])
        self.crop_calendars = MongoCollectionDict(self.db["crop_calendars"])
        self.saved_markets = MongoCollectionDict(self.db["saved_markets"])
        self.bookmarked_schemes = MongoCollectionDict(self.db["bookmarked_schemes"])

        # Create indexes for optimal queries
        try:
            self.db["users"].create_index("id", unique=True)
            self.db["crop_calendars"].create_index("id", unique=True)
            self.db["crop_calendars"].create_index("user_id")
            self.db["saved_markets"].create_index("id", unique=True)
            self.db["saved_markets"].create_index("user_id")
            self.db["bookmarked_schemes"].create_index("id", unique=True)
            self.db["bookmarked_schemes"].create_index("user_id")
        except Exception as e:
            logger.warning("Could not create mongo indexes: %s", e)

        # Seed demo user if not exists
        if not self.users.get("demo-rajesh"):
            self.users["demo-rajesh"] = DEMO_USER.copy()


def init_store():
    # If MongoDB URI is configured and not forced to in-memory:
    if settings.MONGODB_URI and not settings.USE_IN_MEMORY_STORE:
        try:
            print("\n" + "=" * 60)
            print("[Database] Connecting to MongoDB Atlas cluster...")
            mongo_store = MongoStore(settings.MONGODB_URI, settings.DATABASE_NAME)
            print(f"[Database] [SUCCESS] Connected to MongoDB Atlas cluster!")
            print(f"[Database] Database Name: {settings.DATABASE_NAME}")
            print(f"[Database] Persistent Collections: users, crop_calendars, saved_markets, bookmarked_schemes")
            print("=" * 60 + "\n")
            return mongo_store
        except Exception as e:
            print("\n" + "=" * 60)
            print(f"[Database] [WARNING] Could not connect to MongoDB Atlas: {e}")
            print("[Database] Falling back safely to InMemoryStore.")
            print("=" * 60 + "\n")
            return InMemoryStore()

    print("\n" + "=" * 60)
    print("[Database] Running in In-Memory Mode (USE_IN_MEMORY_STORE=true).")
    print("[Database] Pre-seeded demo farmer Rajesh Kumar is active.")
    print("=" * 60 + "\n")
    return InMemoryStore()


store = init_store()


async def get_db():
    """Compatibility dependency for the existing API layer."""
    yield store
