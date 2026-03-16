import Link from 'next/link';
import { FiArrowRight, FiZap, FiMapPin } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-ev-light via-white to-secondary-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      </div>

      <div className="container-fluid relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6 font-semibold">
              <MdElectricBolt size={20} />
              Welcome to EV Charging
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
              Charge Smarter, Drive Greener
            </h1>

            <p className="text-xl text-accent-600 mb-8 leading-relaxed">
              Find, reserve, and charge your electric vehicle at thousands of convenient locations near you. 
              Easy booking, real-time availability, and competitive pricing all in one app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/stations" className="btn btn-primary btn-large flex items-center justify-center gap-2">
                <FiMapPin size={20} />
                Find Stations
                <FiArrowRight size={20} />
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-large flex items-center justify-center gap-2">
                <FiZap size={20} />
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-gradient">5000+</p>
                <p className="text-accent-600">Charging Stations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">50K+</p>
                <p className="text-accent-600">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">99%</p>
                <p className="text-accent-600">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="relative h-96 md:h-full min-h-[500px] animate-fade-in">
            <div className="absolute inset-0 bg-gradient-ev rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <MdElectricBolt className="w-40 h-40 mx-auto mb-4 animate-bounce-slow" />
                <p className="text-2xl font-bold">Fast & Reliable</p>
                <p className="text-primary-100 mt-2">Charging Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
