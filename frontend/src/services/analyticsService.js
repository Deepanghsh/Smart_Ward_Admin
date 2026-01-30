import { getData } from '../utils/apiUtils';

/**
 * Analytics Service
 * Service for fetching analytics and statistics
 */

export const analyticsService = {
  /**
   * Get dashboard analytics
   */
  async getDashboardAnalytics() {
    try {
      const response = await getData('/analytics/dashboard');
      return response;
    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard analytics'
      };
    }
  },

  /**
   * Get issue trends
   */
  async getIssueTrends(period = 'month') {
    try {
      const response = await getData(`/analytics/trends?period=${period}`);
      return response;
    } catch (error) {
      console.error('Get trends error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch trends'
      };
    }
  },

  /**
   * Get category distribution
   */
  async getCategoryDistribution() {
    try {
      const response = await getData('/analytics/categories');
      return response;
    } catch (error) {
      console.error('Get category distribution error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch category distribution'
      };
    }
  },

  /**
   * Get hostel statistics
   */
  async getHostelStats() {
    try {
      const response = await getData('/analytics/hostels');
      return response;
    } catch (error) {
      console.error('Get hostel stats error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch hostel statistics'
      };
    }
  },
};

export default analyticsService;
