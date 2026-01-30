import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { Bell, Lock, Globe, Moon, Shield, Database, Mail, Smartphone } from 'lucide-react';
import { toast } from '../utils/toast';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    issueUpdates: true,
    announcementAlerts: true,
    weeklyReports: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
    autoAssignment: true,
    publicVisibility: true,
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
    toast.success('Setting updated successfully');
  };

  const handleSelectChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
    toast.success('Setting updated successfully');
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle',
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive browser push notifications',
          type: 'toggle',
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive SMS for urgent issues',
          type: 'toggle',
        },
        {
          key: 'issueUpdates',
          label: 'Issue Updates',
          description: 'Get notified when issues are updated',
          type: 'toggle',
        },
        {
          key: 'announcementAlerts',
          label: 'Announcement Alerts',
          description: 'Receive alerts for new announcements',
          type: 'toggle',
        },
        {
          key: 'weeklyReports',
          label: 'Weekly Reports',
          description: 'Receive weekly summary reports',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'toggle',
        },
        {
          key: 'sessionTimeout',
          label: 'Session Timeout',
          description: 'Auto logout after inactivity',
          type: 'select',
          options: [
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '120', label: '2 hours' },
          ],
        },
      ],
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme',
          type: 'toggle',
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Select your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'mr', label: 'Marathi' },
          ],
        },
        {
          key: 'timezone',
          label: 'Timezone',
          description: 'Your local timezone',
          type: 'select',
          options: [
            { value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
            { value: 'UTC', label: 'UTC' },
            { value: 'America/New_York', label: 'EST (America/New York)' },
          ],
        },
      ],
    },
    {
      title: 'System',
      icon: Database,
      items: [
        {
          key: 'autoAssignment',
          label: 'Auto-Assignment',
          description: 'Automatically assign issues to staff',
          type: 'toggle',
        },
        {
          key: 'publicVisibility',
          label: 'Public Issue Visibility',
          description: 'Allow students to see all public issues',
          type: 'toggle',
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <TopBar />
        
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and system settings</p>
          </div>

          <div className="max-w-4xl space-y-6">
            {settingsSections.map((section, sectionIndex) => {
              const Icon = section.icon;
              return (
                <div key={sectionIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {item.label}
                            </h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          
                          {item.type === 'toggle' && (
                            <button
                              onClick={() => handleToggle(item.key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                          
                          {item.type === 'select' && (
                            <select
                              value={settings[item.key]}
                              onChange={(e) => handleSelectChange(item.key, e.target.value)}
                              className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {item.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Account Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Account Actions</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Change Password</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Export Data</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Delete Account</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Reset to Defaults
              </button>
              <button 
                onClick={() => toast.success('All settings saved successfully')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
