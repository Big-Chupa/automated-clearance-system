import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClearanceProvider } from './context/ClearanceContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import ClearancePage from './pages/ClearancePage';
import CertificatePage from './pages/CertificatePage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagementPage from './pages/StudentManagementPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import { NotFoundPage } from './pages/SettingsAndNotFound';
import { ProtectedRoute } from './components/common/CommonComponents';

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

              {/* Shared Notifications Page */}
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Student Portal Pages */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/clearance" element={<ClearancePage />} />
              <Route path="/student/progress" element={<ClearancePage />} />
              <Route path="/student/certificate" element={<CertificatePage />} />

              {/* Fallback */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </NotificationProvider>
        </ClearanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
