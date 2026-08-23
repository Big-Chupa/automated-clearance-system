import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { storageService } from '../services/storageService';

const StudentManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState(storageService.getUsers().filter(u => u.role === 'STUDENT'));

  const filtered = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Students</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Graduating Student Records</h1>
              <p className="page-sub-heading">
                Manage registered students and verification credentials for the 2025/2026 session.
              </p>
            </div>
          </div>

          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="🔍 Search by student name, matric number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '350px' }}
              />
            </div>

            <div className="eksu-table-container">
              <table className="eksu-table">
                <thead>
                  <tr>
                    <th>MATRIC NUMBER</th>
                    <th>STUDENT NAME</th>
                    <th>DEPARTMENT</th>
                    <th>FACULTY</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No student records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(student => (
                      <tr key={student.id}>
                        <td><strong>{student.matricNo}</strong></td>
                        <td>{student.fullName}</td>
                        <td>{student.departmentName}</td>
                        <td>{student.faculty}</td>
                        <td>
                          <span className="badge-active-pill">{student.status || 'Active'}</span>
                        </td>
                        <td>
                          <button className="btn-pill-outline">View Profile</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentManagementPage;
