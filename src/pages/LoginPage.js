import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/CommonComponents';

const LoginPage = () => {
  const [role, setRole] = useState('ADMIN');
  const [identifier, setIdentifier] = useState('admin@eksu.edu.ng');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'STUDENT') {
      setIdentifier('EKSU/CSC/22/0063');
      setPassword('password123');
    } else if (newRole === 'OFFICER') {
      setIdentifier('bursary@eksu.edu.ng');
      setPassword('password123');
    } else if (newRole === 'ADMIN') {
      setIdentifier('admin@eksu.edu.ng');
      setPassword('password123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

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
      setError(err.message || 'Authentication failed.');
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
        padding: '2.5rem',
        border: '1px solid var(--border-color)'
      }}>
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
            margin: '0 auto 1rem auto'
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

        {/* Role Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.4rem',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {['ADMIN', 'STUDENT', 'OFFICER'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                padding: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: role === r ? '#ffffff' : 'transparent',
                color: role === r ? 'var(--primary-color)' : 'var(--text-muted)',
                boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {r === 'ADMIN' ? '⚡ Admin' : r === 'STUDENT' ? '👨‍🎓 Student' : '🏢 Officer'}
            </button>
          ))}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
              {role === 'STUDENT' ? 'Matriculation Number or Email' : 'Institutional Email / Staff ID'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          {role === 'STUDENT' ? (
            <p>
              New graduating student? <Link to="/register" style={{ fontWeight: '600' }}>Register for Clearance</Link>
            </p>
          ) : (
            <p>Portal access is restricted to authorized EKSU personnel.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
