import { FiZap, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';

export default function DashboardStats() {
  const stats = [
    {
      label: 'Total Charged',
      value: '256.5',
      unit: 'kWh',
      icon: FiZap,
      color: 'bg-primary-100 text-primary-600',
      trend: '+12.5%',
    },
    {
      label: 'Sessions',
      value: '42',
      unit: 'total',
      icon: FiClock,
      color: 'bg-secondary-100 text-secondary-600',
      trend: '+8',
    },
    {
      label: 'Savings',
      value: '$124.30',
      unit: 'this month',
      icon: FiTrendingUp,
      color: 'bg-green-100 text-green-600',
      trend: '+15%',
    },
    {
      label: 'Favorite Stations',
      value: '8',
      unit: 'bookmarked',
      icon: FiStar,
      color: 'bg-yellow-100 text-yellow-600',
      trend: '+2',
    },
  ];

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
