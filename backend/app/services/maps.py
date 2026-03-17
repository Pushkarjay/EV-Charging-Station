"""
Google Maps Integration Service
Handles location services using Google Maps API
"""

import httpx
import logging
from typing import Optional, Tuple, List, Dict
from app.config import settings

logger = logging.getLogger(__name__)


class GoogleMapsService:
    """Service for Google Maps API operations"""
    
    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY
        self.base_url = "https://maps.googleapis.com"
        self.client = httpx.AsyncClient(timeout=10)
    
    async def get_coordinates(self, address: str) -> Optional[Tuple[float, float]]:
        """
        Convert address to coordinates (latitude, longitude)
        
        Args:
            address: Street address
            
        Returns:
            Tuple of (latitude, longitude) or None if not found
        """
        if not self.api_key:
            logger.warning("Google Maps API key not configured")
            return None
            
        try:
            url = f"{self.base_url}/maps/api/geocode/json"
            params = {
                "address": address,
                "key": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("results"):
                location = data["results"][0]["geometry"]["location"]
                return (location["lat"], location["lng"])
            else:
                logger.warning(f"No results found for address: {address}")
                return None
                
        except Exception as e:
            logger.error(f"Error geocoding address {address}: {str(e)}")
            return None
    
    async def get_address(self, lat: float, lng: float) -> Optional[str]:
        """
        Convert coordinates to address (reverse geocoding)
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            Street address or None if not found
        """
        if not self.api_key:
            logger.warning("Google Maps API key not configured")
            return None
            
        try:
            url = f"{self.base_url}/maps/api/geocode/json"
            params = {
                "latlng": f"{lat},{lng}",
                "key": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("results"):
                return data["results"][0]["formatted_address"]
            else:
                logger.warning(f"No address found for coordinates: {lat}, {lng}")
                return None
                
        except Exception as e:
            logger.error(f"Error reverse geocoding {lat}, {lng}: {str(e)}")
            return None
    
    async def get_distance(self, 
                          origin_lat: float, origin_lng: float,
                          dest_lat: float, dest_lng: float) -> Optional[float]:
        """
        Calculate distance between two points using Haversine formula (local)
        
        Args:
            origin_lat: Origin latitude
            origin_lng: Origin longitude
            dest_lat: Destination latitude
            dest_lng: Destination longitude
            
        Returns:
            Distance in kilometers
        """
        try:
            import math
            
            # Convert to radians
            lat1 = math.radians(origin_lat)
            lon1 = math.radians(origin_lng)
            lat2 = math.radians(dest_lat)
            lon2 = math.radians(dest_lng)
            
            # Haversine formula
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            
            a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
            c = 2 * math.asin(math.sqrt(a))
            
            # Earth radius in kilometers
            earth_radius_km = 6371
            
            return earth_radius_km * c
            
        except Exception as e:
            logger.error(f"Error calculating distance: {str(e)}")
            return None
    
    async def search_nearby_places(self,
                                   lat: float, lng: float,
                                   radius: int = 5000,
                                   place_type: str = "electric_vehicle_charging_station") -> Optional[List[Dict]]:
        """
        Search for nearby places (charging stations, etc.)
        
        Note: This requires Places API key with places search enabled
        
        Args:
            lat: Latitude
            lng: Longitude  
            radius: Search radius in meters
            place_type: Type of place to search for
            
        Returns:
            List of places or None
        """
        if not self.api_key:
            logger.warning("Google Maps API key not configured")
            return None
            
        try:
            url = f"{self.base_url}/maps/api/place/nearbysearch/json"
            params = {
                "location": f"{lat},{lng}",
                "radius": radius,
                "type": place_type,
                "key": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            places = []
            for result in data.get("results", []):
                places.append({
                    "name": result.get("name"),
                    "lat": result.get("geometry", {}).get("location", {}).get("lat"),
                    "lng": result.get("geometry", {}).get("location", {}).get("lng"),
                    "rating": result.get("rating"),
                    "place_id": result.get("place_id"),
                    "types": result.get("types", [])
                })
            
            return places if places else None
            
        except Exception as e:
            logger.error(f"Error searching nearby places: {str(e)}")
            return None
    
    async def get_map_url(self, lat: float, lng: float, zoom: int = 15) -> str:
        """
        Generate a Google Static Map URL
        
        Args:
            lat: Latitude
            lng: Longitude
            zoom: Zoom level (1-21)
            
        Returns:
            URL to static map image
        """
        if not self.api_key:
            logger.warning("Google Maps API key not configured")
            return ""
        
        return (f"{self.base_url}/maps/api/staticmap?"
                f"center={lat},{lng}&zoom={zoom}&size=400x400&"
                f"markers=color:red%7C{lat},{lng}&key={self.api_key}")
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()


# Create singleton instance
maps_service = GoogleMapsService()
