import React, { useState } from 'react';
import { useClearance } from '../context/ClearanceContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Footer } from '../components/common/CommonComponents';
import { formatDate } from '../utils/formatters';

const AuditLogsPage = () => {
  const { auditLogs } = useClearance();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(l =>
    l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">System Audit Trail & Security Logs</h1>
            <p className="page-description">Immutable log of clearance approvals, status changes, logins, and certifications.</p>
          </div>

          <div className="card">
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Search audit logs by user, action, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No audit logs recorded.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formatDate(log.timestamp)}
                        </td>
                        <td><strong>{log.userName}</strong></td>
                        <td>
                          <span className="badge badge-neutral">{log.userRole}</span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ color: '#334155' }}>{log.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AuditLogsPage;
