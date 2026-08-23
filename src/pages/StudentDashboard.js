import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClearance } from '../context/ClearanceContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { myRequest, departments, submitClearanceApplication } = useClearance();

  const handleStart = () => {
    try {
      submitClearanceApplication();
    } catch (e) {
      alert(e.message);
    }
  };

  const approvedCount = myRequest ? Object.values(myRequest.departments || {}).filter(d => d.status === 'APPROVED').length : 0;
  const pendingCount = myRequest ? Object.values(myRequest.departments || {}).filter(d => d.status === 'PENDING').length : departments.length;
  const rejectedCount = myRequest ? Object.values(myRequest.departments || {}).filter(d => d.status === 'REJECTED').length : 0;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Overview</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Student Clearance Overview</h1>
              <p className="page-sub-heading">
                Welcome back, {currentUser?.fullName} ({currentUser?.matricNo || 'EKSU/CSC/22/0063'})
              </p>
            </div>
            {myRequest?.overallStatus === 'APPROVED' ? (
              <Link to="/student/certificate" className="btn btn-pill-maroon">
                📜 View Certificate
              </Link>
            ) : null}
          </div>

          {/* Student Profile Overview Card */}
          <div className="content-card">
            <h2 className="card-heading-title">Academic Clearance Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Matriculation No:</span> <strong>{currentUser?.matricNo || 'EKSU/CSC/22/0063'}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Department:</span> <strong>{currentUser?.departmentName || 'Computer Science'}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Faculty:</span> <strong>{currentUser?.faculty || 'Science'}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Academic Session:</span> <strong>2025/2026</strong></div>
            </div>
          </div>

          {/* Stat Metrics Grid */}
          <div className="stat-cards-grid">
            <div className="stat-metric-card">
              <div className="stat-metric-label">TOTAL UNITS</div>
              <div className="stat-metric-number">{departments.length || 6}</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">CLEARED</div>
              <div className="stat-metric-number" style={{ color: 'var(--success-color)' }}>{approvedCount}</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">PENDING</div>
              <div className="stat-metric-number" style={{ color: 'var(--warning-color)' }}>{pendingCount}</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">REJECTED / QUERIED</div>
              <div className="stat-metric-number" style={{ color: 'var(--danger-color)' }}>{rejectedCount}</div>
            </div>
          </div>

          {/* Clearance Status Container */}
          <div className="content-card">
            <h2 className="card-heading-title">Clearance Workflow Status</h2>
            {!myRequest ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  Your clearance request for the 2025/2026 graduating session has not been submitted yet.
                </p>
                <button onClick={handleStart} className="btn btn-pill-maroon" style={{ padding: '0.65rem 2rem' }}>
                  🚀 Initiate Clearance Request
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Overall Clearance Progress</span>
                  <span>{myRequest.completionPercentage}%</span>
                </div>
                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <div style={{ height: '100%', width: `${myRequest.completionPercentage}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.4s ease' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to="/student/progress" className="btn btn-pill-maroon">
                    View Clearance Units
                  </Link>
                  {myRequest.overallStatus === 'APPROVED' && (
                    <Link to="/student/certificate" className="btn btn-pill-outline">
                      Print Final Certificate
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
