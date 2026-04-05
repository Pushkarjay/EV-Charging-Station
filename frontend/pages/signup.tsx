import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiLock, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { authService } from '../services';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(formData.password)) errors.password = 'Password must contain lowercase letters';
    if (!/(?=.*[A-Z])/.test(formData.password)) errors.password = 'Password must contain uppercase letters';
    if (!/(?=.*\d)/.test(formData.password)) errors.password = 'Password must contain numbers';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await authService.signup(
        formData.email,
        formData.password,
        formData.name
      );
      
      if (response.data) {
        const { access_token, user } = response.data;
        setSuccess(true);
        // Store token and user data
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Signup failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-800">
                <FiAlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 text-green-800">
                <FiCheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm">Account created successfully! Redirecting...</p>
              </div>
            )}

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
                  className={`input ${validationErrors.name ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
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
                  className={`input ${validationErrors.email ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
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
                  className={`input ${validationErrors.password ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
                <p className="text-xs text-accent-500 mt-2">Min 8 chars, uppercase, lowercase, and numbers</p>
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
                  className={`input ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
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
                disabled={loading || success}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : success ? 'Account Created!' : 'Create Account'}
                {!loading && !success && <FiArrowRight />}
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
