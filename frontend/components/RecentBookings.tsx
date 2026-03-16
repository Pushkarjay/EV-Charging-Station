import { FiMapPin, FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

export default function RecentBookings() {
  const bookings = [
    {
      id: 1,
      station: 'Downtown Station',
      date: 'Mar 15, 2026',
      time: '2:00 PM - 3:00 PM',
      cost: 12.50,
      status: 'completed',
    },
    {
      id: 2,
      station: 'Green Park Hub',
      date: 'Mar 14, 2026',
      time: '10:30 AM - 11:30 AM',
      cost: 8.75,
      status: 'completed',
    },
    {
      id: 3,
      station: 'Tech Central',
      date: 'Mar 16, 2026',
      time: '3:00 PM - 4:00 PM',
      cost: 10.25,
      status: 'upcoming',
    },
    {
      id: 4,
      station: 'Airport Hub',
      date: 'Mar 13, 2026',
      time: '5:00 PM - 6:00 PM',
      cost: 15.00,
      status: 'completed',
    },
  ];

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
              <h4 className="font-semibold text-accent-900">{booking.station}</h4>
              <div className="flex items-center gap-1">
                <FiCheckCircle
                  className={
                    booking.status === 'completed'
                      ? 'text-secondary-600'
                      : 'text-primary-600'
                  }
                  size={18}
                />
                <span
                  className={`text-xs font-semibold ${
                    booking.status === 'completed'
                      ? 'text-secondary-600'
                      : 'text-primary-600'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-accent-600">
                <FiClock size={16} />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-600">
                <FiClock size={16} />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-600">
                <FiDollarSign size={16} />
                <span className="font-semibold">${booking.cost.toFixed(2)}</span>
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
