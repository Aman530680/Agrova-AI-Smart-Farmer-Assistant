from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.database import get_db

client = TestClient(app)

def test_root():
    """
    Tests that the API root endpoint responds with a health check.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "Agrova AI Farmer Query" in response.json()["service"]

def test_health():
    """
    Tests the health status check endpoint.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@patch("app.api.auth.get_password_hash")
def test_register_mock(mock_hash):
    """
    Mocks the DB execute transactions and verifies registration formats.
    """
    mock_hash.return_value = "hashed_pass_value_here"
    
    # Mocking database session interactions with AsyncMock for awaited calls
    from unittest.mock import AsyncMock
    import uuid
    from datetime import datetime, timezone
    
    mock_db = MagicMock()
    mock_db.execute = AsyncMock()
    mock_db.commit = AsyncMock()
    
    async def mock_refresh(user_obj):
        user_obj.id = uuid.uuid4()
        user_obj.created_at = datetime.now(timezone.utc)
    mock_db.refresh = AsyncMock(side_effect=mock_refresh)
    
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = None  # No existing user
    mock_db.execute.return_value = mock_result
    
    # Override database dependency session
    app.dependency_overrides[get_db] = lambda: mock_db
    
    response = client.post("/api/auth/register", json={
        "name": "Farmer Ram",
        "email": "ram@kisan.com",
        "password": "securepassword123",
        "primary_language": "hi"
      })
    
    assert response.status_code == 201
    json_data = response.json()
    assert "access_token" in json_data
    assert json_data["token_type"] == "bearer"
    assert json_data["user"]["name"] == "Farmer Ram"
    assert json_data["user"]["email"] == "ram@kisan.com"
    
    # Clean up overrides
    app.dependency_overrides.clear()
