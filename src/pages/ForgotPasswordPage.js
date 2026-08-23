import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/CommonComponents';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      resetPassword(identifier, newPassword);
      setMessage('Password successfully reset. You can now login with your new credentials.');
      setIdentifier('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔑</div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Simulate account password recovery</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {message && <Alert type="success" message={message} />}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Matriculation No. or Registered Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. FCP/CSC/19/2045 or email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1rem', padding: '0.75rem' }}
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" style={{ fontWeight: '600' }}>← Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
