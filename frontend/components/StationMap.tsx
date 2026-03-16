import { useEffect, useRef } from 'react';
import { FiMapPin, FiZap } from 'react-icons/fi';

interface StationMapProps {
  onStationSelect?: (station: any) => void;
}

export default function StationMap({ onStationSelect }: StationMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Placeholder for map integration (Google Maps or Mapbox)
    // This will be replaced with actual map implementation
  }, []);

  return (
    <div className="card h-full min-h-[500px]">
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center relative overflow-hidden"
      >
        {/* Map Placeholder */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 bg-gradient-ev rounded-full flex items-center justify-center animate-bounce-slow">
            <FiMapPin className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-accent-900">Interactive Map</p>
            <p className="text-accent-600">Google Maps integration coming soon</p>
            <p className="text-sm text-accent-500 mt-2">
              ℹ️ Currently showing mock data
            </p>
          </div>
        </div>

        {/* Mock Station Markers */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-secondary-500 rounded-full cursor-pointer hover:scale-150 transition-transform" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-secondary-500 rounded-full cursor-pointer hover:scale-150 transition-transform" />
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-secondary-500 rounded-full cursor-pointer hover:scale-150 transition-transform" />
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-accent-50 rounded-lg">
        <p className="font-semibold text-accent-900 mb-3">Map Legend</p>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full" />
            <span className="text-accent-600">Available Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-accent-600">Low Availability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-accent-600">Fully Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
