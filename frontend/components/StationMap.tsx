import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiX } from 'react-icons/fi';
import GoogleMapReact from 'google-map-react';
import { stationService } from '../services';

interface MapStation {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  lng?: number;
  lat?: number;
  available_chargers?: number;
  total_chargers?: number;
  chargers?: number;
  available?: number;
  rating?: number;
}

interface StationMapProps {
  onStationSelect?: (station: any) => void;
  center?: { lat: number; lng: number };
}

// Marker component for individual stations
const Marker = ({ name, available, chargers }: any) => {
  return (
    <div className="flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-ev rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-125 transition-transform">
          <FiMapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-0 right-0 w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {available}
        </div>
      </div>
    </div>
  );
};

export default function StationMap({ onStationSelect, center }: StationMapProps) {
  const mapRef = useRef<any>(null);
  const [stations, setStations] = useState<MapStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<MapStation | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.2961, lng: 85.8245 }); // Bhubaneswar, India

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        // Try to fetch from real API
        const response = await stationService.getStations();
        const data = response.data;

        // Transform API response
        const transformedStations = (Array.isArray(data) ? data : data.stations || data.data || [])
          .map((station: any) => ({
            id: station.id,
            name: station.name || 'Unknown Station',
            address: station.address || '',
            lat: station.latitude || station.lat || 40.7128,
            lng: station.longitude || station.lng || -74.0060,
            available_chargers: station.available_chargers || station.available || 0,
            total_chargers: station.total_chargers || station.chargers || 0,
            chargers: station.total_chargers || station.chargers || 0,
            available: station.available_chargers || station.available || 0,
            rating: station.rating || 4.5,
          }))
          .slice(0, 15); // Limit to 15 stations for performance

        setStations(transformedStations.length > 0 ? transformedStations : getMockStations());

        // Set map center to first station if available
        if (transformedStations.length > 0) {
          setMapCenter({ lat: transformedStations[0].lat, lng: transformedStations[0].lng });
        }
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        // Fallback to mock data
        setStations(getMockStations());
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  const getMockStations = (): MapStation[] => {
    return [
      {
        id: 1,
        name: 'Downtown Station',
        address: '123 Main St',
        lat: 40.7128,
        lng: -74.006,
        available: 8,
        chargers: 12,
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Green Park Hub',
        address: '456 Park Ave',
        lat: 40.7489,
        lng: -73.9680,
        available: 15,
        chargers: 20,
        rating: 4.9,
      },
      {
        id: 3,
        name: 'Tech Central',
        address: '789 Tech Blvd',
        lat: 40.7505,
        lng: -73.9972,
        available: 3,
        chargers: 8,
        rating: 4.5,
      },
      {
        id: 4,
        name: 'Shopping Mall',
        address: '321 Mall Rd',
        lat: 40.7614,
        lng: -73.9776,
        available: 10,
        chargers: 16,
        rating: 4.7,
      },
      {
        id: 5,
        name: 'Airport Hub',
        address: '654 Airport Way',
        lat: 40.6895,
        lng: -73.9730,
        available: 18,
        chargers: 24,
        rating: 4.6,
      },
    ];
  };

  const getMarkerColor = (available: number, total: number): string => {
    if (available === 0) return 'bg-red-500';
    if (available < total * 0.3) return 'bg-yellow-500';
    return 'bg-secondary-500';
  };

  const handleMarkerClick = (station: MapStation) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

  if (loading) {
    return (
      <div className="card h-full min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-ev rounded-full flex items-center justify-center animate-spin mx-auto mb-4">
            <FiMapPin className="w-8 h-8 text-white" />
          </div>
          <p className="text-accent-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full min-h-[500px]">
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        {stations.length > 0 ? (
          <>
            <GoogleMapReact
              ref={mapRef}
              bootstrapURLKeys={{
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
              }}
              center={mapCenter}
              zoom={12}
              options={{
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                  },
                ],
              }}
            >
              {stations.map((station) => (
                <div
                  key={station.id}
                  lat={station.lat || 40.7128}
                  lng={station.lng || -74.0060}
                  onClick={() => handleMarkerClick(station)}
                  onMouseEnter={() => setSelectedStation(station)}
                  onMouseLeave={() => setSelectedStation(null)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className={`w-8 h-8 ${getMarkerColor(station.available || 0, station.chargers || 8)} rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform`}>
                        <FiMapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute top-0 right-0 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {station.available || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </GoogleMapReact>

            {/* Station Info Popup */}
            {selectedStation && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-accent-900">{selectedStation.name}</h3>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="text-accent-400 hover:text-accent-600"
                  >
                    <FiX />
                  </button>
                </div>
                <p className="text-sm text-accent-600 mb-3">{selectedStation.address}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Available Chargers:</span>
                    <span className="font-semibold text-accent-900">
                      {selectedStation.available || 0} / {selectedStation.chargers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Rating:</span>
                    <span className="font-semibold text-accent-900">⭐ {selectedStation.rating || 4.5}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-ev text-white py-2 rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Reserve Charger
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-ev rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-12 h-12 text-white" />
              </div>
              <p className="text-xl font-bold text-accent-900">No Stations Available</p>
              <p className="text-accent-600">Unable to load charging stations at this time</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-accent-50 rounded-lg">
        <p className="font-semibold text-accent-900 mb-3">Map Legend</p>
        <div className="flex gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full" />
            <span className="text-accent-600">Available (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-accent-600">Low (30-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-accent-600">Fully Occupied (0%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
