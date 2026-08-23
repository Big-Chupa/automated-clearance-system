import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Alert } from '../components/common/CommonComponents';

const DEMO_STUDENTS = [
  { name: 'Amina Yusuf (Fresh Demo)', matric: 'EKSU/CSC/22/0088', dept: 'Computer Science' },
  { name: 'Oluwaseun Adeleke (Fresh Demo)', matric: 'EKSU/MTH/22/0112', dept: 'Mathematics' },
  { name: 'Blessing Okon (Fresh Demo)', matric: 'EKSU/GEO/22/0045', dept: 'Geology' },
  { name: 'Moses Ochopelu (Cleared)', matric: 'EKSU/CSC/22/0063', dept: 'Computer Science' }
];

const LoginPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('EKSU/CSC/22/0088');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'STUDENT') {
      setIdentifier('EKSU/CSC/22/0088');
      setPassword('password123');
    } else if (newRole === 'OFFICER') {
      setIdentifier('bursary@eksu.edu.ng');
      setPassword('password123');
    } else if (newRole === 'ADMIN') {
      setIdentifier('admin@eksu.edu.ng');
      setPassword('password123');
    }
  };

  const handleQuickLogin = (matric) => {
    setError('');
    try {
      setLoading(true);
      const user = login(matric, 'password123', 'STUDENT');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCache = () => {
    storageService.resetDatabase();
    setResetSuccess(true);
    setIdentifier('EKSU/CSC/22/0088');
    setPassword('password123');
    setTimeout(() => setResetSuccess(false), 3000);
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
        maxWidth: '470px',
        padding: '2.25rem 2rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            background: 'var(--primary-color)',
            color: '#fff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 0.75rem auto'
          }}>
            🏛️
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>
            EKSU Clearance Portal
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
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
          marginBottom: '1.25rem'
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

        {/* Quick Student Selector Chips */}
        {role === 'STUDENT' && (
          <div style={{ marginBottom: '1.25rem', backgroundColor: '#fdf2f4', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fce7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                Instant 1-Click Student Login:
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {DEMO_STUDENTS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(s.matric)}
                  style={{
                    textAlign: 'left',
                    padding: '0.45rem 0.55rem',
                    fontSize: '0.725rem',
                    borderRadius: '5px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  title="Click to sign in instantly"
                >
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.matric}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {resetSuccess && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.5rem', borderRadius: '6px', fontSize: '0.775rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            ✓ Browser database synchronized and reloaded with all 4 student demo accounts.
          </div>
        )}

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
              placeholder="e.g. EKSU/CSC/22/0088 or amina"
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
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

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
          <button
            type="button"
            onClick={handleResetCache}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.75rem' }}
          >
            🔄 Sync / Reset Demo Cache
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
