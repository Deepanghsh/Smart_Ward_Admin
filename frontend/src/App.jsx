import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IssuesPage } from './pages/IssuesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Utils
import { isAuthenticated, getCurrentUser, getUserType } from './utils/apiUtils';
import socketService from './utils/socketService';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'student'] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  const userType = getUserType();
  
  // Check if user's role is allowed
  if (!allowedRoles.includes(userType) && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin only route
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

function App() {
  useEffect(() => {
    // Initialize Socket.IO connection when app mounts
    if (isAuthenticated()) {
      socketService.connect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={<Navigate to="/admin/dashboard" replace />} 
            />
            
            <Route 
              path="/admin/analytics" 
              element={
                <AdminRoute>
                  <AnalyticsPage />
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/issues" 
              element={
                <AdminRoute>
                  <IssuesPage />
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/announcements" 
              element={
                <AdminRoute>
                  <AnnouncementsPage />
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/lost-found" 
              element={
                <AdminRoute>
                  <LostFoundPage />
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/profile" 
              element={
                <AdminRoute>
                  <ProfilePage />
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/settings" 
              element={
                <AdminRoute>
                  <SettingsPage />
                </AdminRoute>
              } 
            />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
