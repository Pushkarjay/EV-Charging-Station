import { useState, useEffect } from 'react';
import { FiMapPin, FiFilter } from 'react-icons/fi';

interface ListStation {
  id: number;
  name: string;
  address: string;
  distance: number;
  available: number;
  chargers: number;
  rating: number;
}

interface StationListProps {
  selectedStation?: ListStation | null;
}

export default function StationList({ selectedStation }: StationListProps) {
  const [stations, setStations] = useState<ListStation[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const mockStations = [
      { id: 1, name: 'Downtown Station', address: '123 Main St', distance: 0.5, available: 8, chargers: 12, rating: 4.8 },
      { id: 2, name: 'Green Park Hub', address: '456 Park Ave', distance: 1.2, available: 15, chargers: 20, rating: 4.9 },
      { id: 3, name: 'Tech Central', address: '789 Tech Blvd', distance: 2.1, available: 3, chargers: 8, rating: 4.5 },
      { id: 4, name: 'Shopping Mall', address: '321 Mall Rd', distance: 1.8, available: 10, chargers: 16, rating: 4.7 },
      { id: 5, name: 'Airport Hub', address: '654 Airport Way', distance: 5.0, available: 18, chargers: 24, rating: 4.6 },
    ];
    setStations(mockStations);
  }, []);

  const filteredStations = stations.filter((station) => {
    if (filter === 'available') return station.available > 0;
    if (filter === 'nearby') return station.distance < 2;
    if (filter === 'rated') return station.rating >= 4.7;
    return true;
  });

  return (
    <div className="card h-full max-h-96 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-accent-900 mb-4">Nearby Stations</h3>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'available', 'nearby', 'rated'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-small ${
                filter === f
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stations List */}
      <div className="space-y-4">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className={`p-4 rounded-lg border-2 transition cursor-pointer ${
              selectedStation?.id === station.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-accent-200 hover:border-primary-300'
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
              <button className="btn btn-primary btn-small">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-accent-600">No stations matching your filters</p>
        </div>
      )}
    </div>
  );
}
