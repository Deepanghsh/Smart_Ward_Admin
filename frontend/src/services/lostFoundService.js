import { getData, postData, putData, deleteData } from '../utils/apiUtils';

/**
 * Lost and Found Service
 * Service for managing lost and found items
 */

export const lostFoundService = {
  /**
   * Get all lost and found items
   */
  async getLostFoundItems(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/lost-found?${queryParams}` : '/lost-found';
      const response = await getData(endpoint);
      return response;
    } catch (error) {
      console.error('Get lost and found items error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch items'
      };
    }
  },

  /**
   * Get single lost and found item by ID
   */
  async getLostFoundItemById(id) {
    try {
      const response = await getData(`/lost-found/${id}`);
      return response;
    } catch (error) {
      console.error('Get lost and found item error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch item'
      };
    }
  },

  /**
   * Create new lost and found item
   */
  async createLostFoundItem(itemData) {
    try {
      const response = await postData('/lost-found', itemData);
      return response;
    } catch (error) {
      console.error('Create lost and found item error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create item'
      };
    }
  },

  /**
   * Update lost and found item
   */
  async updateLostFoundItem(id, itemData) {
    try {
      const response = await putData(`/lost-found/${id}`, itemData);
      return response;
    } catch (error) {
      console.error('Update lost and found item error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update item'
      };
    }
  },

  /**
   * Mark item as claimed
   */
  async markAsClaimed(id) {
    try {
      const response = await putData(`/lost-found/${id}/claim`);
      return response;
    } catch (error) {
      console.error('Mark as claimed error:', error);
      return {
        success: false,
        message: error.message || 'Failed to mark as claimed'
      };
    }
  },

  /**
   * Delete lost and found item
   */
  async deleteLostFoundItem(id) {
    try {
      const response = await deleteData(`/lost-found/${id}`);
      return response;
    } catch (error) {
      console.error('Delete lost and found item error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete item'
      };
    }
  },

  /**
   * Get lost and found statistics (admin only)
   */
  async getLostFoundStats() {
    try {
      const response = await getData('/lost-found/stats');
      return response;
    } catch (error) {
      console.error('Get lost and found stats error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch statistics'
      };
    }
  },
};

export default lostFoundService;
