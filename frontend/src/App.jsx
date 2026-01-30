import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { IssuesPage } from './pages/IssuesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ManagementDashboard } from './pages/ManagementDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accesstoken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/issues" 
                element={
                  <ProtectedRoute>
                    <IssuesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/announcements" 
                element={
                  <ProtectedRoute>
                    <AnnouncementsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/lost-found" 
                element={
                  <ProtectedRoute>
                    <LostFoundPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Management Dashboard */}
              <Route 
                path="/management/dashboard" 
                element={
                  <ProtectedRoute>
                    <ManagementDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect root to login or dashboard */}
              <Route 
                path="/" 
                element={
                  localStorage.getItem('accesstoken') 
                    ? <Navigate to="/admin/dashboard" replace /> 
                    : <Navigate to="/login" replace />
                } 
              />
              
              {/* Catch all - redirect to dashboard or login */}
              <Route 
                path="*" 
                element={
                  localStorage.getItem('accesstoken') 
                    ? <Navigate to="/admin/dashboard" replace /> 
                    : <Navigate to="/login" replace />
                } 
              />
            </Routes>
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;