import { getData, postData, putData, deleteData } from '../utils/apiUtils';

/**
 * Issue Service
 * Centralized service for all issue-related API calls
 */

export const issueService = {
  /**
   * Get all issues with optional filters
   */
  async getIssues(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await getData(`/issues?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Get issues service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch issues'
      };
    }
  },

  /**
   * Get single issue by ID
   */
  async getIssueById(issueId) {
    try {
      const response = await getData(`/issues/${issueId}`);
      return response;
    } catch (error) {
      console.error('Get issue service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch issue'
      };
    }
  },

  /**
   * Create a new issue
   */
  async createIssue(issueData) {
    try {
      const response = await postData('/issues', issueData);
      return response;
    } catch (error) {
      console.error('Create issue service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create issue'
      };
    }
  },

  /**
   * Update issue status (admin only)
   */
  async updateStatus(issueId, status, comment) {
    try {
      const response = await putData(`/issues/${issueId}/status`, { status, comment });
      return response;
    } catch (error) {
      console.error('Update status service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update issue status'
      };
    }
  },

  /**
   * Assign issue to admin (admin only)
   */
  async assignIssue(issueId, adminId) {
    try {
      const response = await putData(`/issues/${issueId}/assign`, { adminId });
      return response;
    } catch (error) {
      console.error('Assign issue service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to assign issue'
      };
    }
  },

  /**
   * Add comment to issue
   */
  async addComment(issueId, comment) {
    try {
      const response = await postData(`/issues/${issueId}/comment`, { comment });
      return response;
    } catch (error) {
      console.error('Add comment service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to add comment'
      };
    }
  },

  /**
   * Delete issue
   */
  async deleteIssue(issueId) {
    try {
      const response = await deleteData(`/issues/${issueId}`);
      return response;
    } catch (error) {
      console.error('Delete issue service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete issue'
      };
    }
  },

  /**
   * Get issue statistics (admin only)
   */
  async getStats() {
    try {
      const response = await getData('/issues/stats');
      return response;
    } catch (error) {
      console.error('Get stats service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch statistics'
      };
    }
  }
};

export default issueService;
