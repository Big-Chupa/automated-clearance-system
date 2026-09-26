import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClearanceProvider } from './context/ClearanceContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/common/CommonComponents';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import ClearancePage from './pages/ClearancePage';
import CertificatePage from './pages/CertificatePage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import StudentManagementPage from './pages/StudentManagementPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import { NotFoundPage } from './pages/SettingsAndNotFound';

// Styles
import './styles/variables.css';
import './styles/global.css';
import './styles/certificate.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ClearanceProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Admin Portal Pages matching Screenshots */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['ADMIN']}><StudentManagementPage /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['ADMIN']}><DepartmentManagementPage /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><SettingsPage /></ProtectedRoute>} />

              {/* Officer Portal Pages */}
              <Route path="/department/dashboard" element={<ProtectedRoute allowedRoles={['OFFICER']}><DepartmentDashboard /></ProtectedRoute>} />

              {/* Shared Notifications Page */}
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

              {/* Student Portal Pages */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/clearance" element={<ProtectedRoute allowedRoles={['STUDENT']}><ClearancePage /></ProtectedRoute>} />
              <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['STUDENT']}><ClearancePage /></ProtectedRoute>} />
              <Route path="/student/certificate" element={<ProtectedRoute allowedRoles={['STUDENT']}><CertificatePage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </NotificationProvider>
        </ClearanceProvider>
      </AuthProvider>
    </Router>
  );
}

function HomeRedirect() {
  const { currentUser, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading session...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (currentUser.role === 'OFFICER') return <Navigate to="/department/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
}

export default App;
