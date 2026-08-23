import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const departments = storageService.getDepartments();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Overview</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Administrator Overview</h1>
              <p className="page-sub-heading">
                Logged in as {currentUser?.fullName || 'David Akinyemi'} (Administrator)
              </p>
            </div>
            <Link to="/admin/reports" className="btn btn-pill-maroon" style={{ padding: '0.5rem 1.4rem' }}>
              View Reports
            </Link>
          </div>

          {/* Stat Metrics Grid */}
          <div className="stat-cards-grid">
            <div className="stat-metric-card">
              <div className="stat-metric-label">TOTAL REQUESTS</div>
              <div className="stat-metric-number">1,067</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">APPROVED</div>
              <div className="stat-metric-number" style={{ color: 'var(--success-color)' }}>728</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">PENDING</div>
              <div className="stat-metric-number" style={{ color: 'var(--warning-color)' }}>213</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">REJECTED</div>
              <div className="stat-metric-number" style={{ color: 'var(--danger-color)' }}>126</div>
            </div>
          </div>

          {/* Overview Department Table */}
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className="card-heading-title" style={{ margin: 0 }}>Active Clearance Units</h2>
              <Link to="/admin/departments" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                Manage All Units →
              </Link>
            </div>

            <div className="eksu-table-container">
              <table className="eksu-table">
                <thead>
                  <tr>
                    <th>CLEARANCE UNIT</th>
                    <th>ASSIGNED OFFICER</th>
                    <th>EMAIL</th>
                    <th>PENDING</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.slice(0, 5).map(dept => (
                    <tr key={dept.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{dept.name}</div>
                        <div className="unit-subtext">{dept.description}</div>
                      </td>
                      <td>{dept.officerName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{dept.email}</td>
                      <td>{dept.pendingCount}</td>
                      <td>
                        <span className="badge-active-pill">{dept.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
