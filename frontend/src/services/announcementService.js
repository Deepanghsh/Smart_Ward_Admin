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
      const response = await getData(`/announcements?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Get announcements service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch announcements'
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
  }
};

export default announcementService;
