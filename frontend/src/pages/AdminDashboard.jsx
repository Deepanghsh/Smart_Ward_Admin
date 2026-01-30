import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { FileText, Clock, CheckCircle2, Plus } from 'lucide-react';
import { mockIssues, mockAnnouncements } from '../utils/mockData';

export const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIssues(mockIssues);
      setLoading(false);
    }, 500);
  }, []);

  // Calculate stats
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(i => ['reported', 'assigned'].includes(i.status)).length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const weeklyIncrease = 2; // Mock data

  // Get recent issues (last 3)
  const recentIssues = issues.slice(0, 3);

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🚰',
      electrical: '⚡',
      furniture: '🪑',
      internet: '📡',
      cleanliness: '🧹',
      ac_heating: '❄️',
      security: '🔒',
      other: '📋',
    };
    return icons[category] || '📋';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      emergency: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return colors[priority?.toLowerCase()] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-700',
      assigned: 'bg-blue-100 text-blue-700',
      'in progress': 'bg-purple-100 text-purple-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status?.toLowerCase()] || colors.reported;
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <TopBar />
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        {/* Top Bar */}
        <TopBar 
          title="Good Morning, John! 👋"
          subtitle="Here's what's happening in your hostel today."
        />

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Issues Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  📈 +{weeklyIncrease} this week
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Issues</p>
              <h3 className="text-4xl font-bold text-gray-900">{totalIssues}</h3>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
                  📉 Urgent attention
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Pending</p>
              <h3 className="text-4xl font-bold text-gray-900">{pendingIssues}</h3>
            </div>

            {/* Resolved Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  📈 95% success
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Resolved</p>
              <h3 className="text-4xl font-bold text-gray-900">{resolvedIssues}</h3>
            </div>
          </div>

          {/* Recent Issues and Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Issues - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Issues</h2>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {getCategoryIcon(issue.category)}
                      </div>

                      {/* Issue Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                            {issue.title}
                          </h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                            {getTimeAgo(issue.reportedDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm text-gray-600">
                            #{issue.id}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-blue-600 capitalize">
                            {issue.category.replace('_', ' ')}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`text-xs px-4 py-2 rounded-lg font-semibold ${getStatusColor(issue.status)}`}>
                          {issue.status === 'in progress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements - Takes 1 column */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Announcements</h2>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Empty State */}
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📢</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No new updates
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Everything looks quiet today.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Check back later for updates from the warden.
                  </p>
                  <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                    Archive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
