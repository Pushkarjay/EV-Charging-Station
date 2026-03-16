import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle signup logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      <Head>
        <title>Sign Up - EV Charging Station</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-ev-light via-white to-secondary-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-ev rounded-lg flex items-center justify-center">
                <MdElectricBolt className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">EVCharge</span>
            </div>

            <h1 className="text-3xl font-bold text-center text-accent-900 mb-2">
              Get Started
            </h1>
            <p className="text-center text-accent-600 mb-8">
              Create an account in less than 2 minutes
            </p>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="label flex items-center gap-2">
                  <FiUser />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <FiMail />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <FiLock />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <FiLock />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span className="text-sm text-accent-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Terms
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <FiArrowRight />
              </button>
            </form>

            <div className="border-t border-accent-200 my-6" />

            <p className="text-center text-accent-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center text-accent-600 text-sm space-y-2">
            <p>🔒 Your data is encrypted and secure</p>
            <p>✓ No credit card required</p>
            <p>✓ Join 50,000+ EV owners today</p>
          </div>
        </div>
      </div>
    </>
  );
}
