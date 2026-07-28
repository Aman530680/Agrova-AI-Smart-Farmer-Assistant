import uuid
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    primary_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Crop Calendar Schemas
class CropCalendarBase(BaseModel):
    crop_name: str
    sowing_date: date
    current_stage: Optional[str] = "Sowing"

class CropCalendarCreate(CropCalendarBase):
    pass

class CropCalendarUpdate(BaseModel):
    current_stage: Optional[str] = None

class CropCalendarResponse(CropCalendarBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Saved Market Schemas
class SavedMarketBase(BaseModel):
    commodity: str
    market_name: str

class SavedMarketCreate(SavedMarketBase):
    pass

class SavedMarketResponse(SavedMarketBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Bookmarked Scheme Schemas
class BookmarkedSchemeBase(BaseModel):
    scheme_id: str

class BookmarkedSchemeCreate(BookmarkedSchemeBase):
    pass

class BookmarkedSchemeResponse(BookmarkedSchemeBase):
    id: uuid.UUID
    user_id: uuid.UUID
    bookmarked_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
