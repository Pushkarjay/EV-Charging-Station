import { FiTrendingUp } from 'react-icons/fi';

export default function UsageChart() {
  const data = [
    { day: 'Mon', kWh: 15.2 },
    { day: 'Tue', kWh: 22.5 },
    { day: 'Wed', kWh: 18.3 },
    { day: 'Thu', kWh: 25.8 },
    { day: 'Fri', kWh: 30.2 },
    { day: 'Sat', kWh: 28.5 },
    { day: 'Sun', kWh: 20.1 },
  ];

  const maxValue = Math.max(...data.map((d) => d.kWh));

  return (
    <div className="card mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-accent-900">Weekly Usage</h3>
        <div className="flex items-center gap-2 text-secondary-600 font-semibold">
          <FiTrendingUp size={20} />
          <span>+18.2%</span>
        </div>
      </div>

      <div className="h-64 flex items-flex-end gap-4">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="relative w-full h-48 bg-accent-100 rounded-t-lg flex items-flex-end justify-center mb-2">
              <div
                className="w-full bg-gradient-ev rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${(d.kWh / maxValue) * 100}%` }}
              >
                <p className="text-white text-xs font-bold p-2">
                  {d.kWh}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-accent-600">{d.day}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-accent-600 mb-2">Average Daily Usage</p>
        <p className="text-2xl font-bold text-gradient">23.8 kWh</p>
      </div>
    </div>
  );
}
