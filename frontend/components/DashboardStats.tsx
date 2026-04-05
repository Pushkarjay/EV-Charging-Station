'use client';

import { FiZap, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { bookingService, userService } from '@services/index';

export default function DashboardStats() {
  const [stats, setStats] = useState([
    {
      label: 'Total Charged',
      value: '0',
      unit: 'kWh',
      icon: FiZap,
      color: 'bg-primary-100 text-primary-600',
      trend: '+0%',
    },
    {
      label: 'Sessions',
      value: '0',
      unit: 'total',
      icon: FiClock,
      color: 'bg-secondary-100 text-secondary-600',
      trend: '+0',
    },
    {
      label: 'Savings',
      value: '$0.00',
      unit: 'this month',
      icon: FiTrendingUp,
      color: 'bg-green-100 text-green-600',
      trend: '+0%',
    },
    {
      label: 'Favorite Stations',
      value: '0',
      unit: 'bookmarked',
      icon: FiStar,
      color: 'bg-yellow-100 text-yellow-600',
      trend: '+0',
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, favoritesRes] = await Promise.all([
          bookingService.getBookings().catch(() => ({ data: [] })),
          userService.getFavoriteStations().catch(() => ({ data: [] })),
        ]);

        const bookings = bookingsRes.data || [];
        const favorites = favoritesRes.data || [];

        // Calculate stats from booking data
        let totalKwh = 0;
        let totalCost = 0;
        let monthCount = 0;

        bookings.forEach((booking: any) => {
          if (booking.energy_used) {
            totalKwh += booking.energy_used;
          }
          if (booking.total_cost) {
            totalCost += booking.total_cost;
          }
          // Count this month's bookings
          const bookingDate = new Date(booking.created_at);
          const now = new Date();
          if (bookingDate.getMonth() === now.getMonth() && 
              bookingDate.getFullYear() === now.getFullYear()) {
            monthCount++;
          }
        });

        setStats([
          {
            label: 'Total Charged',
            value: totalKwh.toFixed(1),
            unit: 'kWh',
            icon: FiZap,
            color: 'bg-primary-100 text-primary-600',
            trend: '+12.5%',
          },
          {
            label: 'Sessions',
            value: bookings.length.toString(),
            unit: 'total',
            icon: FiClock,
            color: 'bg-secondary-100 text-secondary-600',
            trend: `+${monthCount}`,
          },
          {
            label: 'Savings',
            value: `$${totalCost.toFixed(2)}`,
            unit: 'this month',
            icon: FiTrendingUp,
            color: 'bg-green-100 text-green-600',
            trend: '+15%',
          },
          {
            label: 'Favorite Stations',
            value: favorites.length.toString(),
            unit: 'bookmarked',
            icon: FiStar,
            color: 'bg-yellow-100 text-yellow-600',
            trend: `+${favorites.length}`,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep default stats if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card h-32 bg-accent-50 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon size={24} />
              </div>
              <span className="badge badge-secondary text-xs">{stat.trend}</span>
            </div>
            <p className="text-accent-600 text-sm mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gradient">{stat.value}</p>
              <p className="text-accent-600 text-sm">{stat.unit}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
