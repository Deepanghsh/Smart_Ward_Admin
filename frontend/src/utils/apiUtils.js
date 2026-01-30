import { showToast } from './toast';

// API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Handle API response and errors uniformly
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return {
    success: true,
    data: data.data || data,
    message: data.message,
  };
};

/**
 * Handle fetch errors
 */
const handleError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'Network error occurred',
    error,
  };
};

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accesstoken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Generic GET request handler
 */
export const getData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Generic POST request handler
 */
export const postData = async (endpoint, body = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Generic PUT request handler
 */
export const putData = async (endpoint, body = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Generic PATCH request handler
 */
export const patchData = async (endpoint, body = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Generic DELETE request handler
 */
export const deleteData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Upload file with FormData and progress tracking
 */
export const uploadFile = async (endpoint, formData, onProgress) => {
  try {
    const token = localStorage.getItem('accesstoken');
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });

      // Request completed
      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              data: data.data || data,
              message: data.message || 'Upload successful',
            });
          } else {
            resolve({
              success: false,
              message: data.message || 'Upload failed',
              error: data,
            });
          }
        } catch (error) {
          reject({
            success: false,
            message: 'Failed to parse response',
            error,
          });
        }
      });

      // Request error
      xhr.addEventListener('error', () => {
        reject({
          success: false,
          message: 'Network error occurred during upload',
        });
      });

      // Request aborted
      xhr.addEventListener('abort', () => {
        reject({
          success: false,
          message: 'Upload cancelled',
        });
      });

      xhr.open('POST', `${API_BASE_URL}${endpoint}`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('accesstoken');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get user type (admin or student)
 */
export const getUserType = () => {
  return localStorage.getItem('userType') || 'student';
};

/**
 * Logout user and clear all data
 */
export const logout = () => {
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
  showToast.info('Logged out successfully');
  window.location.href = '/login';
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send refresh token cookie
    });

    const data = await response.json();

    if (response.ok && data.accessToken) {
      localStorage.setItem('accesstoken', data.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export default {
  getData,
  postData,
  putData,
  patchData,
  deleteData,
  uploadFile,
  isAuthenticated,
  getCurrentUser,
  getUserType,
  logout,
  refreshToken,
};
