import { getData, postData, putData, deleteData } from '../utils/apiUtils';

/**
 * Announcement Service
 * Centralized service for all announcement-related API calls
 */

export const announcementService = {
  /**
   * Get all announcements with optional filters
   */
  async getAnnouncements(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const queryString = params.toString();
      const endpoint = queryString ? `/announcements?${queryString}` : '/announcements';
      
      const response = await getData(endpoint);
      return response;
    } catch (error) {
      console.error('Get announcements service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch announcements',
        data: []
      };
    }
  },

  /**
   * Get single announcement by ID
   */
  async getAnnouncementById(announcementId) {
    try {
      const response = await getData(`/announcements/${announcementId}`);
      return response;
    } catch (error) {
      console.error('Get announcement by ID service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch announcement',
        data: null
      };
    }
  },

  /**
   * Create a new announcement (admin only)
   */
  async createAnnouncement(announcementData) {
    try {
      const response = await postData('/announcements', announcementData);
      return response;
    } catch (error) {
      console.error('Create announcement service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create announcement'
      };
    }
  },

  /**
   * Update announcement (admin only)
   */
  async updateAnnouncement(announcementId, announcementData) {
    try {
      const response = await putData(`/announcements/${announcementId}`, announcementData);
      return response;
    } catch (error) {
      console.error('Update announcement service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update announcement'
      };
    }
  },

  /**
   * Delete announcement (admin only)
   */
  async deleteAnnouncement(announcementId) {
    try {
      const response = await deleteData(`/announcements/${announcementId}`);
      return response;
    } catch (error) {
      console.error('Delete announcement service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete announcement'
      };
    }
  },

  /**
   * Get announcements by priority
   */
  async getAnnouncementsByPriority(priority) {
    try {
      return await this.getAnnouncements({ priority });
    } catch (error) {
      console.error('Get announcements by priority service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch announcements',
        data: []
      };
    }
  },

  /**
   * Get recent announcements (last N days)
   */
  async getRecentAnnouncements(days = 7) {
    try {
      const response = await this.getAnnouncements();
      
      if (response.success && Array.isArray(response.data)) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentAnnouncements = response.data.filter(announcement => {
          const announcementDate = new Date(announcement.createdAt || announcement.date);
          return announcementDate >= cutoffDate;
        });
        
        return {
          success: true,
          data: recentAnnouncements,
          count: recentAnnouncements.length
        };
      }
      
      return response;
    } catch (error) {
      console.error('Get recent announcements service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch recent announcements',
        data: []
      };
    }
  },

  /**
   * Get announcement statistics
   */
  async getAnnouncementStats() {
    try {
      const response = await this.getAnnouncements();
      
      if (response.success && Array.isArray(response.data)) {
        const announcements = response.data;
        
        const stats = {
          total: announcements.length,
          urgent: announcements.filter(a => a.priority === 'urgent').length,
          important: announcements.filter(a => a.priority === 'important').length,
          normal: announcements.filter(a => a.priority === 'normal').length,
          info: announcements.filter(a => a.priority === 'info').length,
          thisWeek: announcements.filter(a => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(a.createdAt || a.date) >= weekAgo;
          }).length,
          thisMonth: announcements.filter(a => {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            return new Date(a.createdAt || a.date) >= monthAgo;
          }).length
        };
        
        return {
          success: true,
          data: stats
        };
      }
      
      return {
        success: false,
        message: 'Failed to calculate statistics',
        data: null
      };
    } catch (error) {
      console.error('Get announcement stats service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch announcement statistics',
        data: null
      };
    }
  }
};

export default announcementService;