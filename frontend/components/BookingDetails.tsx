import { FiMapPin, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';

interface BookingDetailsProps {
  booking?: any;
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  if (!booking) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
      <h3 className="text-2xl font-bold text-gradient mb-8">Booking Summary</h3>

      <div className="space-y-6">
        {/* Station */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-ev flex items-center justify-center flex-shrink-0">
            <FiMapPin className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-accent-600">Station</p>
            <p className="font-bold text-accent-900">Downtown Station</p>
            <p className="text-sm text-accent-600">123 Main St, Downtown</p>
          </div>
        </div>

        <div className="border-t border-accent-200 pt-6" />

        {/* Date */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-ev flex items-center justify-center flex-shrink-0">
            <FiCalendar className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-accent-600">Date</p>
            <p className="font-bold text-accent-900">March 20, 2026</p>
          </div>
        </div>

        <div className="border-t border-accent-200 pt-6" />

        {/* Time */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-ev flex items-center justify-center flex-shrink-0">
            <FiClock className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-accent-600">Time</p>
            <p className="font-bold text-accent-900">2:00 PM - 3:00 PM (1 hour)</p>
          </div>
        </div>

        <div className="border-t border-accent-200 pt-6" />

        {/* Price */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-ev flex items-center justify-center flex-shrink-0">
            <FiDollarSign className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-accent-600">Total Price</p>
            <p className="text-3xl font-bold text-gradient">$12.50</p>
            <p className="text-sm text-accent-600 mt-1">$0.35/kWh × 2.5 kWh estimated</p>
          </div>
        </div>

        <div className="border-t border-accent-200 pt-6" />

        {/* Status */}
        <div>
          <p className="text-sm text-accent-600 mb-2">Status</p>
          <div className="bg-secondary-100 text-secondary-700 px-4 py-3 rounded-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary-700 rounded-full animate-pulse" />
            Confirmed - Reference #BK789012
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent-200 pt-6" />

        {/* CTA */}
        <button className="btn btn-primary w-full">
          Add to Calendar
        </button>
        <button className="btn btn-outline w-full">
          Download Receipt
        </button>
      </div>
    </div>
  );
}
