import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-600',
      text: 'text-blue-600',
      gradient: 'from-blue-600 to-indigo-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-600',
      text: 'text-green-600',
      gradient: 'from-green-600 to-emerald-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-600',
      text: 'text-orange-600',
      gradient: 'from-orange-600 to-amber-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-600',
      text: 'text-red-600',
      gradient: 'from-red-600 to-rose-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-600',
      text: 'text-purple-600',
      gradient: 'from-purple-600 to-indigo-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-6 hover:shadow-lg group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform">
            {value}
          </h3>
          
          {trend && trendValue && (
            <div className="flex items-center gap-1.5">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-semibold ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendValue}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>

        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};
