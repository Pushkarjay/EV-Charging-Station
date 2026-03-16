import { FiMapPin, FiZap, FiAward } from 'react-icons/fi';
import Link from 'next/link';

interface Station {
  id: number;
  name: string;
  address: string;
  distance: number;
  chargers: number;
  available: number;
  rating: number;
  price: number;
  type: string;
}

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const availabilityPercentage = (station.available / station.chargers) * 100;
  const availabilityColor = availabilityPercentage > 50 ? 'bg-secondary-500' : availabilityPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="card card-hover group">
      {/* Header with Type Badge */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-accent-900 flex-1 group-hover:text-primary-600 transition">
          {station.name}
        </h3>
        <span className="badge badge-primary text-xs ml-2 flex-shrink-0">
          {station.type}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-4 text-accent-600 text-sm">
        <FiMapPin className="flex-shrink-0 mt-1" size={16} />
        <div>
          <p>{station.address}</p>
          <p className="font-semibold text-primary-600">{station.distance} km away</p>
        </div>
      </div>

      {/* Availability Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-accent-700">
            Availability: {station.available}/{station.chargers}
          </span>
          <span className="text-xs font-semibold text-accent-600">
            {Math.round(availabilityPercentage)}%
          </span>
        </div>
        <div className="w-full bg-accent-200 rounded-full h-2">
          <div
            className={`${availabilityColor} h-2 rounded-full transition-all`}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FiZap className="w-4 h-4 text-primary-600" />
            <p className="font-bold text-accent-900">{station.chargers}</p>
          </div>
          <p className="text-xs text-accent-600">Chargers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-accent-900 mb-1">${station.price.toFixed(2)}</p>
          <p className="text-xs text-accent-600">/kWh</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FiAward className="w-4 h-4 text-secondary-600" />
            <p className="font-bold text-accent-900">{station.rating}</p>
          </div>
          <p className="text-xs text-accent-600">Rating</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-accent-100 pt-4 mb-4" />

      {/* CTA */}
      <Link
        href={`/booking?stationId=${station.id}`}
        className="btn btn-primary btn-small w-full text-center flex items-center justify-center gap-2"
      >
        Book Now
        <FiZap size={16} />
      </Link>
    </div>
  );
}
