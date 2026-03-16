import { FiStar, FiUser } from 'react-icons/fi';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'EVX Model 3 Owner',
      content: 'EVCharge has made charging my car incredibly convenient. The app is intuitive and I always find available stations nearby.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Tesla Model Y Owner',
      content: 'The real-time availability feature is a game-changer. No more arriving at a station to find all chargers occupied!',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Business Fleet Manager',
      content: 'We switched our entire fleet to EVs using EVCharge. The management dashboard helps us optimize charging across all vehicles.',
      rating: 5,
      avatar: '👩‍💻',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-fluid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">What Users Say</h2>
          <p className="text-accent-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who trust EVCharge for their charging needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="fill-yellow-400 text-yellow-400"
                    size={18}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-accent-700 mb-6 italic">"{testimonial.content}"</p>

              {/* Divider */}
              <div className="border-t border-accent-100 pt-4 flex items-center gap-3">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-accent-900">{testimonial.name}</p>
                  <p className="text-sm text-accent-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
