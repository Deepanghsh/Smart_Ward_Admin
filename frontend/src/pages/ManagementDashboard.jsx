import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { StatCard } from '../components/dashboard/StatCard';
import { CategoryChart } from '../components/charts/CategoryChart';
import { TrendChart } from '../components/charts/TrendChart';
import { PieChart } from '../components/charts/PieChart';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Download } from 'lucide-react';
import { mockAnalytics, mockIssues } from '../utils/mockData';
import { exportToExcel } from '../utils/dataUtils';
import { toast } from '../utils/toast';

export const ManagementDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 800);
  }, []);

  const handleExportData = () => {
    const exportData = mockIssues.map(issue => ({
      'Issue ID': issue.id,
      'Title': issue.title,
      'Category': issue.category,
      'Priority': issue.priority,
      'Status': issue.status,
      'Hostel': issue.hostel,
      'Block': issue.block,
      'Room': issue.room,
      'Reporter': issue.reporter,
      'Assigned To': issue.assignedTo || 'Unassigned',
      'Reported Date': new Date(issue.reportedDate).toLocaleDateString(),
    }));

    const result = exportToExcel(exportData, 'hostel_issues_report', 'Issues');
    if (result.success) {
      toast.success(`Report exported: ${result.filename}`);
    } else {
      toast.error('Failed to export report');
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const resolutionRate = Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
            <p className="text-gray-600">Real-time hostel issue tracking and analytics</p>
          </div>
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Issues"
            value={analytics.totalIssues}
            icon={AlertCircle}
            color="blue"
            trend="up"
            trendValue="+5.2%"
          />
          <StatCard
            title="Resolved"
            value={analytics.resolvedIssues}
            icon={CheckCircle2}
            color="green"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Pending"
            value={analytics.pendingIssues}
            icon={Clock}
            color="orange"
            trend="down"
            trendValue="-8%"
          />
          <StatCard
            title="Avg Resolution Time"
            value={`${analytics.averageResolutionTime}h`}
            icon={TrendingUp}
            color="purple"
            trend="down"
            trendValue="-15%"
          />
        </div>

        {/* Resolution Rate Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium mb-2">Overall Resolution Rate</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold">{resolutionRate}%</span>
                <span className="text-white/80 text-lg">of issues resolved</span>
              </div>
              <p className="text-white/80 mt-3">
                {analytics.resolvedIssues} out of {analytics.totalIssues} total issues
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart data={analytics.issuesByCategory} onBarClick={(data) => console.log('Filter by:', data.category)} />
          <TrendChart data={analytics.monthlyTrend} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PieChart 
            data={analytics.issuesByPriority} 
            title="Issues by Priority"
            subtitle="Distribution across priority levels"
          />
          
          {/* Hostel-wise Issues */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Issues by Hostel</h3>
            <div className="space-y-4">
              {analytics.issuesByHostel.map((item, index) => {
                const percentage = Math.round((item.count / analytics.totalIssues) * 100);
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.hostel}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${colors[index]} rounded-full transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
