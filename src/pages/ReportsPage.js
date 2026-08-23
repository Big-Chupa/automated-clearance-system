import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { storageService } from '../services/storageService';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('Clearance Status Summary');
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const deptStats = storageService.getDeptStats();

  const handleResetFilters = () => {
    setReportType('Clearance Status Summary');
    setAcademicSession('2025/2026');
    setSelectedDept('All Departments');
    setSelectedStatus('All Statuses');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "DEPARTMENT,REGISTERED,SUBMITTED,FULLY CLEARED,PENDING,COMPLETION\n"
      + deptStats.map(e => `${e.department},${e.registered},${e.submitted},${e.fullyCleared},${e.pending},${e.completion}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EKSU_Clearance_Report_${academicSession.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStats = deptStats.filter(item => {
    if (selectedDept === 'All Departments') return true;
    return item.department === selectedDept;
  });

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Reports</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Reports</h1>
              <p className="page-sub-heading">
                Generate, filter and review clearance activity reports.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="btn btn-pill-maroon"
              style={{ padding: '0.5rem 1.4rem' }}
            >
              Export CSV
            </button>
          </div>

          {/* Filter Configuration Card */}
          <div className="content-card" style={{ marginBottom: '1.5rem' }}>
            <div className="reports-filters-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="Clearance Status Summary">Clearance Status Summary</option>
                  <option value="Departmental Compliance Roster">Departmental Compliance Roster</option>
                  <option value="Financial Clearance Audit">Financial Clearance Audit</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Academic Session
                </label>
                <select
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Geology">Geology</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset Filters
              </button>
              <button
                type="button"
                className="btn btn-pill-maroon"
                style={{ padding: '0.5rem 1.75rem' }}
              >
                Generate Report
              </button>
            </div>
          </div>

          {/* Stat Metrics Grid */}
          <div className="stat-cards-grid">
            <div className="stat-metric-card">
              <div className="stat-metric-label">TOTAL REQUESTS</div>
              <div className="stat-metric-number">1,067</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">APPROVED</div>
              <div className="stat-metric-number">728</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">PENDING</div>
              <div className="stat-metric-number">213</div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-metric-label">REJECTED</div>
              <div className="stat-metric-number">126</div>
            </div>
          </div>

          {/* Summary Table Card */}
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 className="card-heading-title" style={{ margin: 0 }}>Department Clearance Summary</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generated 20 Apr 2026</span>
            </div>

            <div className="eksu-table-container">
              <table className="eksu-table">
                <thead>
                  <tr>
                    <th>DEPARTMENT</th>
                    <th>REGISTERED</th>
                    <th>SUBMITTED</th>
                    <th>FULLY CLEARED</th>
                    <th>PENDING</th>
                    <th>COMPLETION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '500' }}>{row.department}</td>
                      <td>{row.registered}</td>
                      <td>{row.submitted}</td>
                      <td>{row.fullyCleared}</td>
                      <td>{row.pending}</td>
                      <td style={{ fontWeight: '600' }}>{row.completion}</td>
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

export default ReportsPage;
