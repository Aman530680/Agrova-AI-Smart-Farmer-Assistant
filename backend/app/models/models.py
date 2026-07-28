from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timezone
import uuid


@dataclass
class User:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    email: str = ""
    password_hash: str = ""
    primary_language: str = "en"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class CropCalendar:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    crop_name: str = ""
    sowing_date: date = field(default_factory=date.today)
    current_stage: str = "Sowing"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class SavedMarket:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    commodity: str = ""
    market_name: str = ""
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class BookmarkedScheme:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = ""
    scheme_id: str = ""
    bookmarked_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
