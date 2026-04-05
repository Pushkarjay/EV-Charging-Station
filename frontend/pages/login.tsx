import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { authService } from '../services';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.data) {
        const { access_token, user } = response.data;
        setSuccess(true);
        
        // Update auth context and localStorage
        authLogin(user, access_token);
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-800 mb-6">
                <FiAlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 text-green-800 mb-6">
                <FiCheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm">Login successful! Redirecting...</p>
              </div>
            )}

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`input ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : success ? 'Logged In!' : 'Login'}
                {!loading && !success && <FiArrowRight />}
              </button>
            </form>

            <div className="border-t border-accent-200 my-6" />

            {!success && (
              <p className="text-center text-accent-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign up
                </Link>
              </p>
            )}
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
