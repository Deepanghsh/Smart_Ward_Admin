import React, { useState } from 'react';
import { Bell, Calendar, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/apiUtils';

export const TopBar = ({ title, subtitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Welcome Message */}
        <div>
          <p className="text-gray-600 text-sm mb-1">
            Welcome, {user?.name || 'Admin'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            {title || 'Good Morning, John!'} 👋
          </h1>
          <p className="text-gray-500">
            {subtitle || "Here's what's happening in your hostel today."}
          </p>
        </div>

        {/* Right Section - Date, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{getCurrentDate()}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">New issue reported</p>
                      <p className="text-xs text-gray-500 mt-1">Water leaking in bathroom</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Issue resolved</p>
                      <p className="text-xs text-gray-500 mt-1">Power failure in Block A</p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">Maintenance scheduled</p>
                      <p className="text-xs text-gray-500 mt-1">Water supply maintenance tomorrow</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center font-bold">
                {user?.name?.[0]?.toUpperCase() || 'JD'}
              </div>
              <span className="font-semibold hidden lg:block">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@smarthostel.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/admin/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/admin/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
