import { FiZap, FiMapPin, FiClock, FiDollarSign, FiSmartphone, FiAward } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: FiMapPin,
      title: 'Find Nearby Stations',
      description: 'Locate charging stations near you with real-time availability and distance information',
    },
    {
      icon: FiClock,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about charging status, availability, and queue times',
    },
    {
      icon: FiDollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden charges. See pricing upfront before booking your charging session',
    },
    {
      icon: FiSmartphone,
      title: 'Mobile First',
      description: 'Seamless experience on all devices with our responsive, user-friendly app',
    },
    {
      icon: FiZap,
      title: 'Fast Charging',
      description: 'Support for all charging speeds from Level 1 to DC Fast Charging (150kW+)',
    },
    {
      icon: FiAward,
      title: 'Trusted by Users',
      description: 'Trusted by thousands of EV owners with 4.9/5 rating and 99% uptime',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-fluid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Why Choose EVCharge?</h2>
          <p className="text-accent-600 text-lg max-w-2xl mx-auto">
            Experience the future of EV charging with our innovative platform designed for your convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-ev text-white group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-accent-900 mb-2">{feature.title}</h3>
                    <p className="text-accent-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
