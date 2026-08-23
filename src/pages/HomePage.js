import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'STUDENT') return '/student/dashboard';
    if (currentUser.role === 'OFFICER') return '/department/dashboard';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    return '/login';
  };

  return (
    <div className="landing-page">
      <header className="top-navbar" style={{ padding: '0 4rem' }}>
        <div style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
          🏛️ UNIVERSITY AUTOMATED CLEARANCE SYSTEM
        </div>
        <div>
          {currentUser ? (
            <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
              Enter Dashboard ({currentUser.fullName.split(' ')[0]})
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Portal Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Student Registration
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="hero-section">
        <h1 className="hero-title">
          Smart, Transparent & Instant<br />Graduating Student Clearance
        </h1>
        <p className="hero-subtitle">
          An integrated paperless platform replacing manual sign-offs with real-time digital approvals, centralized tracking, and verified digital clearance certificates.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Start Graduate Clearance
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#ffffff', padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Staff & Student Login
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
            System Capabilities & Operational Workflow
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Eliminating physical queues, paper loss, stamp forgery, and bureaucratic bottlenecks.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Multi-Departmental Sync</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Instant verification across Bursary, Library, Sports, Student Affairs, Clinic, Department, and Faculty in one unified workflow.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Tamper-Proof Certificate</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Automated generation of standardized final clearance certificates equipped with verifiable cryptographic serial numbers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Immutable Audit Logging</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Every approval, rejection, and comment is time-stamped and permanently recorded for institutional accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
