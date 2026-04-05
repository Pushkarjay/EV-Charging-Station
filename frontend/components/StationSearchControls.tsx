import { useState, useEffect } from 'react';
import { FiMapPin, FiSearch, FiFilter, FiNavigation } from 'react-icons/fi';
import { stationService } from '../services';

interface SearchControlsProps {
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (query: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function StationSearchControls({
  onFilterChange,
  onSearchChange,
  onLocationChange,
}: SearchControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bhubaneswar');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const cities = [
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { name: 'Delhi', lat: 28.5355, lng: 77.391 },
    { name: 'Mumbai', lat: 19.0726, lng: 72.8861 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', lat: 17.3667, lng: 78.475 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  ];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  // Handle city change
  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const city = cities.find((c) => c.name === cityName);
    if (city) {
      onLocationChange?.(city.lat, city.lng);
    }
  };

  // Handle geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        onLocationChange?.(latitude, longitude);
        setIsLoadingLocation(false);
        
        // Try to find nearest city
        console.log(`📍 Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to access your location. Please enable location access.');
        setIsLoadingLocation(false);
      }
    );
  };

  // Handle filter change
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-accent-900 mb-6 flex items-center gap-2">
        <FiMapPin className="text-primary-600" />
        Search & Filter
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-accent-400" size={20} />
          <input
            type="text"
            placeholder="Search stations by name, address..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border-2 border-accent-200 rounded-lg focus:outline-none focus:border-primary-600 transition"
          />
        </div>
      </div>

      {/* City Selector & Geolocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* City Selector */}
        <div>
          <label className="text-sm font-semibold text-accent-700 mb-2 block">Select City</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-accent-200 rounded-lg focus:outline-none focus:border-primary-600 transition bg-white"
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Geolocation Button */}
        <div className="flex items-end">
          <button
            onClick={handleGeolocation}
            disabled={isLoadingLocation}
            className="w-full bg-secondary-600 hover:bg-secondary-700 disabled:bg-accent-300 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FiNavigation size={18} />
            {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
          </button>
        </div>
      </div>

      {/* Display user location if available */}
      {userLocation && (
        <div className="mb-6 p-3 bg-secondary-50 rounded-lg text-sm text-secondary-700">
          📍 Your location: {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
        </div>
      )}

      {/* Filter Buttons */}
      <div>
        <label className="text-sm font-semibold text-accent-700 mb-3 block flex items-center gap-2">
          <FiFilter size={16} />
          Filter Stations
        </label>
        <div className="flex gap-3 flex-wrap">
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'available', label: '⚡ Available' },
            { id: 'nearby', label: '📍 Nearby (< 2km)' },
            { id: 'rated', label: '⭐ Top Rated (4.7+)' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Filter Info */}
      <div className="mt-4 p-3 bg-primary-50 rounded-lg text-sm text-primary-700">
        🎯 Showing: {activeFilter === 'all' && 'All stations'}
        {activeFilter === 'available' && 'Stations with available chargers'}
        {activeFilter === 'nearby' && 'Stations within 2km of your location'}
        {activeFilter === 'rated' && 'Top-rated stations (4.7 stars and above)'}
      </div>
    </div>
  );
}
