import { FiUser, FiBell, FiLock, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-accent-900 mb-6">Account Settings</h3>

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

      {/* Content */}
      <div className="space-y-4 mb-6">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="input"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (234) 567-890"
                className="input"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span className="text-accent-700">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span className="text-accent-700">SMS Alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" />
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
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-accent-200 pt-6 space-y-2">
        <button className="btn btn-primary w-full">
          Save Changes
        </button>
        <button className="btn btn-outline w-full flex items-center justify-center gap-2">
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
