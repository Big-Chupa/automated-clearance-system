import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { storageService } from '../services/storageService';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Footer, Alert } from '../components/common/CommonComponents';

export const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const { showToast } = useNotification();

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (passwordData.oldPassword !== currentUser.password) {
      setErr('Current password is incorrect.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErr('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErr('New passwords do not match.');
      return;
    }

    const updated = { ...currentUser, password: passwordData.newPassword };
    storageService.updateUser(updated);
    storageService.setCurrentUser(updated);
    setMsg('Password updated successfully.');
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleResetPrototypeData = () => {
    if (window.confirm('Are you sure you want to reset all mock data to initial defaults? You will be logged out.')) {
      storageService.resetDatabase();
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">Account & System Settings</h1>
            <p className="page-description">Manage password security and system prototype storage.</p>
          </div>

          <div style={{ maxWidth: '600px' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Change Password</span>
              </div>

              {err && <Alert type="error" message={err} onClose={() => setErr('')} />}
              {msg && <Alert type="success" message={msg} onClose={() => setMsg('')} />}

              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Password
                </button>
              </form>
            </div>

            <div className="card" style={{ borderColor: 'var(--danger-light)' }}>
              <div className="card-header">
                <span className="card-title" style={{ color: 'var(--danger-color)' }}>Prototype Data Storage Controls</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Reset all LocalStorage state and re-seed with default Nigerian university students, departments, and clearance requests.
              </p>
              <button onClick={handleResetPrototypeData} className="btn btn-danger btn-sm">
                ⚠️ Reset Prototype Database
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  return (
    <div className="auth-container" style={{ textAlign: 'center' }}>
      <div className="auth-card">
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The clearance page or resource you requested does not exist on this portal.
        </p>
        <a href="/" className="btn btn-primary">
          Return to Portal Homepage
        </a>
      </div>
    </div>
  );
};
