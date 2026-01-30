import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { Plus, Bell, Calendar, Users } from 'lucide-react';
import { mockAnnouncements } from '../utils/mockData';

export const AnnouncementsPage = () => {
  const [announcements] = useState(mockAnnouncements);

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-700 border-red-300',
      important: 'bg-orange-100 text-orange-700 border-orange-300',
      normal: 'bg-blue-100 text-blue-700 border-blue-300',
      info: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[priority?.toLowerCase()] || colors.normal;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <TopBar />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
              <p className="text-gray-600">Important notices and updates for students</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
              <Plus className="w-5 h-5" />
              New Announcement
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{announcements.length}</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🔴</span>
                <span className="text-sm font-medium text-gray-600">Urgent</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {announcements.filter(a => a.priority === 'urgent').length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🟠</span>
                <span className="text-sm font-medium text-gray-600">Important</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {announcements.filter(a => a.priority === 'important').length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">This Week</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {announcements.filter(a => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(a.date) >= weekAgo;
                }).length}
              </div>
            </div>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${getPriorityColor(announcement.priority)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{getTimeAgo(announcement.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Target: {announcement.target}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Posted: {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
