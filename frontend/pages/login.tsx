import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle login logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      <Head>
        <title>Login - EV Charging Station</title>
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
              Welcome Back
            </h1>
            <p className="text-center text-accent-600 mb-8">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="label flex items-center gap-2">
                  <FiMail />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label flex items-center gap-2 m-0">
                    <FiLock />
                    Password
                  </label>
                  <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Login'}
                <FiArrowRight />
              </button>
            </form>

            <div className="border-t border-accent-200 my-6" />

            <p className="text-center text-accent-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center text-accent-600 text-sm">
            <p>🔒 Your data is encrypted and secure</p>
            <p>✓ No credit card required to get started</p>
          </div>
        </div>
      </div>
    </>
  );
}
