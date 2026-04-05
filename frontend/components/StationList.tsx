import { useState, useEffect } from 'react';
import { FiMapPin, FiFilter } from 'react-icons/fi';
import { stationService } from '../services';

interface ListStation {
  id: number;
  name: string;
  address: string;
  distance: number;
  available: number;
  chargers: number;
  rating: number;
  [key: string]: any;
}

interface StationListProps {
  selectedStation?: ListStation | null;
  filter?: string;
  searchQuery?: string;
  onStationSelect?: (station: ListStation) => void;
}

export default function StationList({ selectedStation, filter = 'all', searchQuery = '', onStationSelect }: StationListProps) {
  const [stations, setStations] = useState<ListStation[]>([]);
  const [localFilter, setLocalFilter] = useState(filter);
  const [loading, setLoading] = useState(true);

  // Update local filter when prop changes
  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        // Try to fetch from real API
        const response = await stationService.getStations();
        const data = response.data;
        
        // Transform API response
        const transformedStations = (Array.isArray(data) ? data : data.stations ||data.data || []).map((station: any) => ({
          id: station.id,
          name: station.name || 'Unknown Station',
          address: station.address || '',
          distance: station.distance || 0,
          available: station.available_chargers || station.available || 0,
          chargers: station.total_chargers || station.chargers || 0,
          rating: station.rating || 4.5,
        }));
        
        setStations(transformedStations);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        // Fallback to mock data
        const mockStations = [
          { id: 1, name: 'Downtown Station', address: '123 Main St', distance: 0.5, available: 8, chargers: 12, rating: 4.8 },
          { id: 2, name: 'Green Park Hub', address: '456 Park Ave', distance: 1.2, available: 15, chargers: 20, rating: 4.9 },
          { id: 3, name: 'Tech Central', address: '789 Tech Blvd', distance: 2.1, available: 3, chargers: 8, rating: 4.5 },
          { id: 4, name: 'Shopping Mall', address: '321 Mall Rd', distance: 1.8, available: 10, chargers: 16, rating: 4.7 },
          { id: 5, name: 'Airport Hub', address: '654 Airport Way', distance: 5.0, available: 18, chargers: 24, rating: 4.6 },
        ];
        setStations(mockStations);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    // Apply search filter
    if (searchQuery && !station.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !station.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (localFilter === 'available') return station.available > 0;
    if (localFilter === 'nearby') return station.distance < 2;
    if (localFilter === 'rated') return station.rating >= 4.7;
    return true;
  });

  return (
    <div className="card h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-accent-900 mb-2">
          📋 Stations List
        </h3>
        {searchQuery && (
          <p className="text-sm text-accent-600 mb-2">
            Searching for: <span className="font-semibold">{searchQuery}</span>
          </p>
        )}
        <p className="text-sm text-accent-600">
          Found {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stations List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStations.length > 0 ? (
          filteredStations.map((station) => (
            <div
              key={station.id}
              onClick={() => onStationSelect?.(station)}
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                selectedStation?.id === station.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-accent-200 hover:border-primary-300 hover:bg-accent-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-accent-900">{station.name}</h4>
                <span className="badge badge-secondary text-xs">{station.rating}★</span>
              </div>
              <p className="text-sm text-accent-600 flex items-center gap-1 mb-3">
                <FiMapPin size={14} />
                {station.address} • {station.distance} km
              </p>
              <div className="flex justify-between items-center text-sm">
                <p className="font-semibold text-accent-700">
                  {station.available}/{station.chargers} Available
                </p>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStationSelect?.(station);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {filteredStations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-accent-600">No stations matching your filters</p>
        </div>
      )}
    </div>
  );
}
