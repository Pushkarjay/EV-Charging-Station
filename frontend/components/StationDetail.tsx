import { useState } from 'react';
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiZap,
  FiStar,
  FiMessageSquare,
  FiExternalLink,
  FiNavigation,
  FiX,
  FiWifi,
  FiCoffee,
} from 'react-icons/fi';

interface Charger {
  type: string;
  available: number;
  total: number;
  kw: number;
}

interface StationDetailProps {
  station?: {
    id: number;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    city: string;
    available: number;
    chargers: number;
    rating: number;
    total_reviews?: number;
    operating_hours?: string;
    amenities?: string[];
    charger_types?: string[];
    price_per_kwh?: number;
    phone?: string;
    website?: string;
  };
  onClose?: () => void;
}

export default function StationDetail({ station, onClose }: StationDetailProps) {
  if (!station) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-accent-600">
        Select a station to view details
      </div>
    );
  }

  // Parse charger types and availability
  const chargerTypes = (station.charger_types || []).map((type, idx) => ({
    type,
    available: Math.floor((station.available || 0) / (station.charger_types?.length || 1)),
    total: Math.floor((station.chargers || 0) / (station.charger_types?.length || 1)),
    kw: type.includes('CCS') ? 50 : type.includes('Type 2') ? 43 : 30,
  }));

  const amenitiesList = Array.isArray(station.amenities)
    ? station.amenities
    : (station.amenities || '').split(',').map((a: string) => a.trim()).filter(Boolean);

  const getOperatingStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    if (station.operating_hours === '24/7') {
      return { status: 'Open 24 hours', icon: '🟢', color: 'text-green-600' };
    }
    // Simple logic: open during 6 AM to 10 PM if not specified
    if (hours >= 6 && hours < 22) {
      return { status: 'Open now', icon: '🟢', color: 'text-green-600' };
    }
    return { status: 'Closed', icon: '🔴', color: 'text-red-600' };
  };

  const status = getOperatingStatus();
  const occupancyPercent = Math.round(((station.chargers - station.available) / station.chargers) * 100);
  const availabilityPercent = Math.round((station.available / station.chargers) * 100);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-lg shadow-lg">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-accent-200">
        <h2 className="text-xl font-bold text-accent-900">{station.name}</h2>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-accent-100 rounded">
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 pb-3 border-b border-accent-100">
          <div className="flex items-center gap-1">
            <FiStar className="fill-yellow-400 text-yellow-400" size={20} />
            <span className="font-bold text-lg text-accent-900">{station.rating || 4.5}</span>
          </div>
          <div>
            <p className="text-sm text-accent-600">
              {station.total_reviews || 0} Reviews
            </p>
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-accent-700 flex items-center gap-2">
            <FiMapPin size={16} />
            Location
          </h3>
          <p className="text-sm text-accent-600 ml-6">{station.address}</p>
          <p className="text-xs text-accent-500 ml-6">{station.city}</p>
          {station.latitude && station.longitude && (
            <p className="text-xs text-accent-500 ml-6 font-mono">
              {station.latitude.toFixed(4)}°, {station.longitude.toFixed(4)}°
            </p>
          )}
        </div>

        {/* Operating Hours */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-accent-700 flex items-center gap-2">
            <FiClock size={16} />
            Hours
          </h3>
          <div className="ml-6 space-y-1">
            <p className={`text-sm font-semibold ${status.color}`}>
              {status.icon} {status.status}
            </p>
            <p className="text-xs text-accent-600">{station.operating_hours || '24/7'}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-accent-700">Contact</h3>
          <div className="ml-6 space-y-2">
            {station.phone && (
              <a
                href={`tel:${station.phone}`}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <FiPhone size={16} />
                {station.phone}
              </a>
            )}
            {station.website && (
              <a
                href={station.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <FiExternalLink size={16} />
                Visit Website
              </a>
            )}
            {!station.phone && !station.website && (
              <p className="text-xs text-accent-500 italic">No contact info available</p>
            )}
          </div>
        </div>

        {/* Charger Availability */}
        <div className="space-y-3 p-3 bg-accent-50 rounded-lg">
          <h3 className="text-sm font-semibold text-accent-700 flex items-center gap-2">
            <FiZap size={16} />
            Chargers Available
          </h3>
          <div className="space-y-2">
            {chargerTypes.length > 0 ? (
              chargerTypes.map((charger, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-accent-700">
                      {charger.type} • {charger.kw}kW
                    </span>
                    <span className="text-xs font-bold text-primary-600">
                      {charger.available}/{charger.total} Available
                    </span>
                  </div>
                  {/* Availability bar */}
                  <div className="w-full h-2 bg-accent-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: `${Math.round((charger.available / charger.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-accent-500">
                {station.available}/{station.chargers} Available
              </p>
            )}
          </div>

          {/* Overall Availability */}
          <div className="mt-3 pt-3 border-t border-accent-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-accent-600">Occupancy</span>
              <span className="font-semibold text-accent-700">{occupancyPercent}%</span>
            </div>
            <div className="w-full h-2 bg-accent-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-orange-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        {station.price_per_kwh && (
          <div className="p-3 bg-accent-50 rounded-lg">
            <p className="text-sm text-accent-700">
              <span className="font-semibold">₹{station.price_per_kwh.toFixed(2)}</span> per kWh
            </p>
          </div>
        )}

        {/* Amenities */}
        {amenitiesList.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-accent-700">Amenities</h3>
            <div className="ml-6 flex flex-wrap gap-2">
              {amenitiesList.map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium"
                >
                  {amenity.toLowerCase().includes('wifi') && <FiWifi size={14} />}
                  {amenity.toLowerCase().includes('restaurant') && <FiCoffee size={14} />}
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-accent-200 flex gap-2">
        <button
          onClick={() => {
            if (station.latitude && station.longitude) {
              window.open(
                `https://maps.google.com/?q=${station.latitude},${station.longitude}`,
                '_blank'
              );
            }
          }}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2"
        >
          <FiNavigation size={16} />
          Directions
        </button>
        <button className="flex-1 btn btn-secondary flex items-center justify-center gap-2">
          <FiMessageSquare size={16} />
          Book
        </button>
      </div>
    </div>
  );
}
