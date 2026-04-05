'use client';

import { FiUser, FiBell, FiLock, FiLogOut, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { userService, authService } from '@services/index';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: true,
    marketingEmails: false,
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First get current user info
        const userRes = await authService.getCurrentUser();
        if (userRes.data?.id) {
          // Then fetch full profile using user_id
          const response = await userService.getProfile();
          if (response.data) {
            setProfile({
              name: response.data.name || userRes.data.name || '',
              email: response.data.email || userRes.data.email || '',
              phone: response.data.phone || '',
            });
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        // Silently fail - show empty form for now
        setMessage({ type: 'error', text: 'Please log in to access account settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Debounced save for profile
  const saveProfile = async () => {
    try {
      setSaving(true);
      await userService.updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to save profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle profile changes with debounce
  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProfile();
    }, 1000);
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword(passwords.currentPassword, passwords.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to change password' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle preferences change
  const handlePreferenceChange = async (field: string, value: boolean) => {
    const updated = { ...notifications, [field]: value };
    setNotifications(updated);

    try {
      await userService.updatePreferences({
        email_notifications: updated.emailNotifications,
        sms_alerts: updated.smsAlerts,
        marketing_emails: updated.marketingEmails,
      });
      setMessage({ type: 'success', text: 'Preferences updated!' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences' });
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-accent-900 mb-6">Account Settings</h3>

      {/* Message Alert */}
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-accent-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-accent-600 hover:text-primary-600'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="space-y-4 mb-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="input"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="input"
                  placeholder="Enter your phone number"
                />
              </div>
              {saving && (
                <div className="text-sm text-accent-600 flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                  Saving...
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  className="w-5 h-5" 
                />
                <span className="text-accent-700">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.smsAlerts}
                  onChange={(e) => handlePreferenceChange('smsAlerts', e.target.checked)}
                  className="w-5 h-5" 
                />
                <span className="text-accent-700">SMS Alerts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.marketingEmails}
                  onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                  className="w-5 h-5" 
                />
                <span className="text-accent-700">Marketing Emails</span>
              </label>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <p className="text-sm text-accent-600 mb-4">
                Protect your account with a strong password
              </p>
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={saving}
                className="btn btn-primary w-full"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-accent-200 pt-6 space-y-2">
        {activeTab === 'profile' && (
          <>
            <button 
              onClick={saveProfile}
              disabled={saving}
              className="btn btn-primary w-full"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
        <button className="btn btn-outline w-full flex items-center justify-center gap-2">
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
