import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { Calendar, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { CategoryChart } from '../components/charts/CategoryChart';
import { TrendChart } from '../components/charts/TrendChart';
import { mockAnalytics } from '../utils/mockData';
import { exportToExcel, getDateRangePresets } from '../utils/dataUtils';
import { toast } from '../utils/toast';

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('last30Days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const datePresets = getDateRangePresets();

  const handleExportAnalytics = () => {
    const data = [
      { Metric: 'Total Issues', Value: mockAnalytics.totalIssues },
      { Metric: 'Resolved Issues', Value: mockAnalytics.resolvedIssues },
      { Metric: 'Pending Issues', Value: mockAnalytics.pendingIssues },
      { Metric: 'Average Resolution Time (hours)', Value: mockAnalytics.averageResolutionTime },
    ];

    const result = exportToExcel(data, 'analytics_report', 'Analytics');
    if (result.success) {
      toast.success(`Analytics exported: ${result.filename}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        {/* Top Bar */}
        <TopBar 
          title="Analytics & Insights"
          subtitle="Deep dive into hostel issue trends and patterns"
        />
        
        <div className="p-8">
          {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {Object.entries(datePresets).map(([key, preset]) => (
                  <option key={key} value={key}>{preset.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Category Filter
              </label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {mockAnalytics.issuesByCategory.map((cat) => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleExportAnalytics}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Issues This Period</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">145</span>
              <span className="text-sm text-green-600 font-semibold">+12%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs previous period (130)</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Resolution Rate</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">68%</span>
              <span className="text-sm text-green-600 font-semibold">+8%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs previous period (60%)</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">14h</span>
              <span className="text-sm text-green-600 font-semibold">-22%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs previous period (18h)</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart data={mockAnalytics.issuesByCategory} />
          <TrendChart data={mockAnalytics.monthlyTrend} />
        </div>

        {/* Resolution Time by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Average Resolution Time by Category</h3>
          <div className="space-y-4">
            {mockAnalytics.resolutionTimeByCategory.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-gray-900">{item.avgTime}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${(item.avgTime / 48) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
