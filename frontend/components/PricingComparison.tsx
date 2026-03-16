import { FiCheck, FiX } from 'react-icons/fi';

export default function PricingComparison() {
  const features = [
    { name: 'Mobile App', basic: true, pro: true, enterprise: true },
    { name: 'Station Access', basic: true, pro: true, enterprise: true },
    { name: 'Real-time Tracking', basic: true, pro: true, enterprise: true },
    { name: 'Booking Management', basic: true, pro: true, enterprise: true },
    { name: 'Priority Support', basic: false, pro: true, enterprise: true },
    { name: 'Advanced Analytics', basic: false, pro: true, enterprise: true },
    { name: 'Loyalty Rewards', basic: false, pro: true, enterprise: true },
    { name: 'Family Sharing', basic: false, pro: true, enterprise: true },
    { name: 'Fleet Management', basic: false, pro: false, enterprise: true },
    { name: 'Custom Integrations', basic: false, pro: false, enterprise: true },
    { name: '24/7 Dedicated Support', basic: false, pro: false, enterprise: true },
    { name: 'White-label Options', basic: false, pro: false, enterprise: true },
  ];

  return (
    <div className="mt-16 bg-accent-50 rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-8 text-center text-accent-900">Feature Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent-200">
              <th className="text-left py-4 px-4 font-semibold text-accent-900">Feature</th>
              <th className="text-center py-4 px-4 font-semibold text-accent-900">Basic</th>
              <th className="text-center py-4 px-4 font-semibold text-accent-900">Pro</th>
              <th className="text-center py-4 px-4 font-semibold text-accent-900">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className={`border-b border-accent-100 ${index % 2 === 0 ? 'bg-white' : 'bg-accent-50'}`}>
                <td className="py-4 px-4 font-medium text-accent-700">{feature.name}</td>
                <td className="text-center py-4 px-4">
                  {feature.basic ? (
                    <FiCheck className="inline text-secondary-600" size={20} />
                  ) : (
                    <FiX className="inline text-accent-300" size={20} />
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {feature.pro ? (
                    <FiCheck className="inline text-secondary-600" size={20} />
                  ) : (
                    <FiX className="inline text-accent-300" size={20} />
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {feature.enterprise ? (
                    <FiCheck className="inline text-secondary-600" size={20} />
                  ) : (
                    <FiX className="inline text-accent-300" size={20} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
