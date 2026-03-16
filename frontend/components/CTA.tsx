import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-ev">
      <div className="container-fluid text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Start Charging?
        </h2>
        <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
          Join EVCharge today and get access to thousands of charging stations, real-time availability tracking, and exclusive member benefits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="btn btn-large bg-white text-primary-600 hover:bg-accent-50 font-semibold flex items-center justify-center gap-2 group"
          >
            Sign Up Free
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/booking"
            className="btn btn-large border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold"
          >
            Book a Station
          </Link>
        </div>

        <p className="text-primary-100 mt-8">
          ✨ No credit card required • Get started in under 2 minutes
        </p>
      </div>
    </section>
  );
}
