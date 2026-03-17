"""
Tests for Google Maps Integration
"""

import pytest
import asyncio
from app.services.maps import GoogleMapsService
from app.config import settings


@pytest.fixture
async def maps_service():
    """Create maps service instance"""
    service = GoogleMapsService()
    yield service
    await service.close()


@pytest.mark.asyncio
async def test_geocoding(maps_service):
    """Test address to coordinates conversion"""
    if not settings.GOOGLE_MAPS_API_KEY:
        pytest.skip("Google Maps API key not configured")
    
    # Test with New Delhi, India Gate
    coords = await maps_service.get_coordinates("India Gate, New Delhi, India")
    
    assert coords is not None
    assert len(coords) == 2
    lat, lng = coords
    assert isinstance(lat, float)
    assert isinstance(lng, float)
    assert 28.0 < lat < 29.0  # New Delhi latitude range
    assert 77.0 < lng < 78.0  # New Delhi longitude range


@pytest.mark.asyncio
async def test_reverse_geocoding(maps_service):
    """Test coordinates to address conversion"""
    if not settings.GOOGLE_MAPS_API_KEY:
        pytest.skip("Google Maps API key not configured")
    
    # Test with known coordinates (India Gate, New Delhi)
    lat, lng = 28.5355, 77.3910
    address = await maps_service.get_address(lat, lng)
    
    assert address is not None
    assert isinstance(address, str)
    assert "India" in address or "New Delhi" in address or "Delhi" in address


@pytest.mark.asyncio
async def test_distance_calculation(maps_service):
    """Test distance calculation between two points"""
    # New Delhi to Gurgaon (approximately ~30 km)
    lat1, lng1 = 28.5355, 77.3910  # New Delhi - India Gate
    lat2, lng2 = 28.4595, 77.0266  # Gurgaon - Cyber Hub
    
    distance = await maps_service.get_distance(lat1, lng1, lat2, lng2)
    
    assert distance is not None
    assert isinstance(distance, float)
    assert 20 < distance < 40  # Should be around 30 km


@pytest.mark.asyncio
async def test_map_url_generation(maps_service):
    """Test static map URL generation"""
    if not settings.GOOGLE_MAPS_API_KEY:
        pytest.skip("Google Maps API key not configured")
    
    lat, lng = 28.5355, 77.3910
    map_url = await maps_service.get_map_url(lat, lng, zoom=15)
    
    assert map_url
    assert "staticmap" in map_url
    assert str(lat) in map_url or f"{lat:.1f}" in map_url
    assert str(lng) in map_url or f"{lng:.1f}" in map_url
    assert "zoom=15" in map_url


def test_settings_loaded():
    """Test that settings are properly loaded from .env"""
    assert settings.GOOGLE_MAPS_API_KEY
    assert settings.GOOGLE_PROJECT_ID == "gcs-ev-charging-station"
    assert settings.GCP_REGION == "us-central1"


def test_credentials_path_exists():
    """Test that GCP credentials file exists"""
    import os
    
    credentials_path = settings.GOOGLE_CREDENTIALS_PATH
    assert os.path.exists(credentials_path), f"Credentials file not found at {credentials_path}"


# Integration tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
