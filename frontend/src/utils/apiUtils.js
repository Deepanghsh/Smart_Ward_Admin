import { toast } from './toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized access - 401');
      // For production, uncomment to force logout:
      // localStorage.removeItem('accesstoken');
      // localStorage.removeItem('user');
    }
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return { success: true, data: data.data || data, message: data.message };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('accesstoken');
  // Ensuring Bearer prefix is consistently present for the backend
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: error.message || 'Network error' };
  }
};

export const postData = async (endpoint, body = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const putData = async (endpoint, body = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
  window.location.href = '/login';
};

// Explicit exports for service modules
export default { getData, postData, putData, deleteData, getCurrentUser, logout };