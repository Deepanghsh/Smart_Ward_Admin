import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, getUserType } from '../utils/apiUtils';

/**
 * Custom hook for authentication management
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const currentUser = getCurrentUser();
        const role = getUserType();
        setUser(currentUser);
        setUserRole(role);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('accesstoken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setUserRole(userData.role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return {
    user,
    isLoggedIn,
    userRole,
    loading,
    login,
    logout,
    updateUser,
    checkAuth,
    isAdmin: userRole === 'admin',
    isStudent: userRole === 'student'
  };
};
