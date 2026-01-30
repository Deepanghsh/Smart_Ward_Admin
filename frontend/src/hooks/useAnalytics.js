import { useState, useEffect, useCallback } from 'react';
import { getData } from '../utils/apiUtils';
import { openAlertBox } from '../utils/toast';

/**
 * Custom hook for fetching analytics data
 */
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardAnalytics = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await getData(`/analytics/dashboard?${params.toString()}`);

      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError(response.message);
        openAlertBox('Error', response.message);
      }
    } catch (err) {
      setError(err.message);
      openAlertBox('Error', 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrends = useCallback(async (period = 30) => {
    try {
      const response = await getData(`/analytics/trends?period=${period}`);

      if (response.success) {
        setTrends(response.data);
      } else {
        openAlertBox('Error', response.message);
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to fetch trends');
    }
  }, []);

  const fetchCategoryAnalytics = useCallback(async () => {
    try {
      const response = await getData('/analytics/categories');

      if (response.success) {
        setCategoryStats(response.data);
      } else {
        openAlertBox('Error', response.message);
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to fetch category analytics');
    }
  }, []);

  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      const response = await getData('/analytics/performance');

      if (response.success) {
        setPerformance(response.data);
      } else {
        openAlertBox('Error', response.message);
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to fetch performance metrics');
    }
  }, []);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, [fetchDashboardAnalytics]);

  return {
    analytics,
    trends,
    categoryStats,
    performance,
    loading,
    error,
    fetchDashboardAnalytics,
    fetchTrends,
    fetchCategoryAnalytics,
    fetchPerformanceMetrics,
    refresh: fetchDashboardAnalytics
  };
};
