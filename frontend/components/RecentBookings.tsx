'use client';

import { FiMapPin, FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { bookingService } from '@services/index';

export default function RecentBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getBookings();
        // Get only the first 4 recent bookings
        setBookings((response.data || []).slice(0, 4));
      } catch (error: any) {
        console.error('Failed to fetch bookings:', error);
        // Silently fail - show empty state
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-secondary-600';
      case 'upcoming':
      case 'pending':
        return 'text-primary-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-accent-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="card mb-8">
        <h3 className="text-lg font-bold text-accent-900 mb-6">Recent Bookings</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-accent-50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card mb-8">
        <h3 className="text-lg font-bold text-accent-900 mb-6">Recent Bookings</h3>
        <p className="text-accent-600 py-8 text-center">No bookings yet. Start by booking a charging station!</p>
      </div>
    );
  }

  return (
    <div className="card mb-8">
      <h3 className="text-lg font-bold text-accent-900 mb-6">Recent Bookings</h3>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 border border-accent-200 rounded-lg hover:border-primary-300 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-accent-900">{booking.station_name || 'Station'}</h4>
              <div className="flex items-center gap-1">
                <FiCheckCircle
                  className={getStatusColor(booking.status)}
                  size={18}
                />
                <span
                  className={`text-xs font-semibold ${getStatusColor(booking.status)}`}
                >
                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-accent-600">
                <FiClock size={16} />
                <span>{formatDate(booking.created_at || new Date().toISOString())}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-600">
                <FiClock size={16} />
                <span>{booking.duration_minutes || 60} mins</span>
              </div>
              <div className="flex items-center gap-2 text-accent-600">
                <FiDollarSign size={16} />
                <span className="font-semibold">${(booking.total_cost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-outline w-full mt-6">
        View All Bookings
      </button>
    </div>
  );
}
