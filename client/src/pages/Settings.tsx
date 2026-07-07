import React, { useState } from 'react';
import { Bell, Shield, Smartphone, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    language: 'English',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Customize your experience and notification preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-100 divide-y divide-slate-200">
        
        {/* Notifications */}
        <div className="px-4 py-6 sm:p-6 text-slate-900">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-slate-400 mr-2" />
            <h2 className="text-lg font-medium">Notification Preferences</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-slate-700">Email Notifications</label>
                <p className="text-slate-500">Receive an email when your reported issue is updated.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="pushNotifications"
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pushNotifications" className="font-medium text-slate-700">Push Notifications</label>
                <p className="text-slate-500">Receive push notifications on this device.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="weeklyReports"
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={() => handleToggle('weeklyReports')}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="weeklyReports" className="font-medium text-slate-700">Weekly Reports</label>
                <p className="text-slate-500">Receive a weekly summary of issues in your school.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Locale */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center">
            <Globe className="h-5 w-5 text-primary-600 mr-3" />
            <h3 className="text-lg font-medium text-slate-900">Appearance & Language</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-900">Dark Mode</h4>
                <p className="text-sm text-slate-500">Switch between light and dark themes</p>
              </div>
              <button
                type="button"
                className={`${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-slate-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2`}
                onClick={toggleTheme}
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-slate-700">Language</label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-4 py-4 sm:px-6 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;
