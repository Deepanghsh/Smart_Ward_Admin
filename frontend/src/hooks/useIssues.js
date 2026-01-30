import { useState, useEffect, useCallback } from 'react';
import { getData, postData, putData, deleteData } from '../utils/apiUtils';
import { openAlertBox } from '../utils/toast';

/**
 * Custom hook for managing issues
 */
export const useIssues = (filters = {}) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  const fetchIssues = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...filters,
        ...customFilters,
        page: pagination.page,
        limit: pagination.limit
      });

      const response = await getData(`/issues?${params.toString()}`);

      if (response.success) {
        setIssues(response.data.issues || response.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError(response.message);
        openAlertBox('Error', response.message);
      }
    } catch (err) {
      setError(err.message);
      openAlertBox('Error', 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const createIssue = async (issueData) => {
    try {
      const response = await postData('/issues', issueData);

      if (response.success) {
        openAlertBox('Success', 'Issue created successfully');
        fetchIssues(); // Refresh list
        return response.data;
      } else {
        openAlertBox('Error', response.message);
        return null;
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to create issue');
      return null;
    }
  };

  const updateIssueStatus = async (issueId, status, comment) => {
    try {
      const response = await putData(`/issues/${issueId}/status`, { status, comment });

      if (response.success) {
        openAlertBox('Success', 'Issue status updated');
        fetchIssues(); // Refresh list
        return response.data;
      } else {
        openAlertBox('Error', response.message);
        return null;
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to update issue status');
      return null;
    }
  };

  const addComment = async (issueId, comment) => {
    try {
      const response = await postData(`/issues/${issueId}/comment`, { comment });

      if (response.success) {
        openAlertBox('Success', 'Comment added');
        fetchIssues(); // Refresh list
        return response.data;
      } else {
        openAlertBox('Error', response.message);
        return null;
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to add comment');
      return null;
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      const response = await deleteData(`/issues/${issueId}`);

      if (response.success) {
        openAlertBox('Success', 'Issue deleted');
        fetchIssues(); // Refresh list
        return true;
      } else {
        openAlertBox('Error', response.message);
        return false;
      }
    } catch (err) {
      openAlertBox('Error', 'Failed to delete issue');
      return false;
    }
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return {
    issues,
    loading,
    error,
    pagination,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    addComment,
    deleteIssue,
    changePage,
    refresh: fetchIssues
  };
};
