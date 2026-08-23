import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Alert } from '../components/common/CommonComponents';

const LoginPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleResetCache = () => {
    storageService.resetDatabase();
    setResetSuccess(true);
    setError('');
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your Matriculation Number or Email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    try {
      setLoading(true);
      const user = login(identifier, password, role);

      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'OFFICER') {
        navigate('/admin/departments');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your login details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2.25rem',
        border: '1px solid var(--border-color)'
      }}>
        {/* University Crest & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'var(--primary-color)',
            color: '#fff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 0.75rem auto'
          }}>
            🏛️
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>
            EKSU Clearance Portal
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ekiti State University, Ado-Ekiti
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.4rem',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {['STUDENT', 'ADMIN', 'OFFICER'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: role === r ? '#ffffff' : 'transparent',
                color: role === r ? 'var(--primary-color)' : 'var(--text-muted)',
                boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {r === 'STUDENT' ? '👨‍🎓 Student' : r === 'ADMIN' ? '⚡ Admin' : '🏢 Officer'}
            </button>
          ))}
        </div>

        {resetSuccess && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.55rem', borderRadius: '6px', fontSize: '0.775rem', marginBottom: '1rem', textAlign: 'center', border: '1px solid #a7f3d0' }}>
            ✓ System accounts synchronized successfully.
          </div>
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.15rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              {role === 'STUDENT' ? 'Matriculation Number or Email' : 'Institutional Email / Staff ID'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={role === 'STUDENT' ? 'e.g. EKSU/CSC/22/0088' : role === 'ADMIN' ? 'admin@eksu.edu.ng' : 'bursary@eksu.edu.ng'}
              autoComplete="username"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-main)' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>Forgot password?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-pill-maroon btn-block"
            disabled={loading}
            style={{ padding: '0.65rem' }}
          >
            {loading ? 'Authenticating...' : `Sign In as ${role}`}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={handleResetCache}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.75rem' }}
            title="Reload default university records"
          >
            🔄 Sync Data
          </button>

          <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
            Register New Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
