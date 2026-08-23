import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { storageService } from '../services/storageService';
import { Modal } from '../components/common/CommonComponents';

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState(storageService.getDepartments());
  const [filterUnit, setFilterUnit] = useState('All Units');
  const [selectedDept, setSelectedDept] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudentReviewOpen, setIsStudentReviewOpen] = useState(false);
  const [selectedStudentRequest, setSelectedStudentRequest] = useState(null);

  // Edit Officer Form State
  const [officerName, setOfficerName] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');

  // Add Department Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');

  const requests = storageService.getClearanceRequests();

  const handleOpenManage = (dept) => {
    setSelectedDept(dept);
    setOfficerName(dept.officerName);
    setOfficerEmail(dept.email);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    const updated = { ...selectedDept, officerName, email: officerEmail };
    storageService.updateDepartment(updated);
    setDepartments(storageService.getDepartments());
    setIsModalOpen(false);
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    const newDept = {
      id: `dept-${Date.now()}`,
      code: newDeptName.toUpperCase().replace(/\s+/g, '_'),
      name: newDeptName,
      description: newDeptDesc,
      officerName: newOfficerName,
      email: newOfficerEmail,
      pendingCount: 0,
      status: 'Active',
      icon: '🏢'
    };
    storageService.saveDepartment(newDept);
    setDepartments(storageService.getDepartments());
    setIsAddModalOpen(false);
    setNewDeptName('');
    setNewDeptDesc('');
    setNewOfficerName('');
    setNewOfficerEmail('');
  };

  const handleOpenStudentVerification = (req) => {
    setSelectedStudentRequest(req);
    setIsStudentReviewOpen(true);
  };

  const filteredDepts = departments.filter(d => {
    if (filterUnit === 'All Units') return true;
    return d.name === filterUnit;
  });

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Department Management</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Department Management</h1>
              <p className="page-sub-heading">
                Configure clearance units and officers responsible for graduate clearance.
              </p>
            </div>
            <button 
              className="btn btn-pill-maroon"
              onClick={() => setIsAddModalOpen(true)}
              style={{ padding: '0.5rem 1.4rem' }}
            >
              Add Department
            </button>
          </div>

          <div className="content-card" style={{ padding: '1.25rem' }}>
            {/* Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                style={{ width: '180px', fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
              >
                <option value="All Units">All Units</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Department Table */}
            <div className="eksu-table-container">
              <table className="eksu-table">
                <thead>
                  <tr>
                    <th>CLEARANCE UNIT</th>
                    <th>ASSIGNED OFFICER</th>
                    <th>EMAIL</th>
                    <th>PENDING</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepts.map(dept => (
                    <tr key={dept.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{dept.name}</div>
                        <div className="unit-subtext">{dept.description}</div>
                      </td>
                      <td>{dept.officerName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{dept.email}</td>
                      <td>{dept.pendingCount}</td>
                      <td>
                        <span className="badge-active-pill">
                          {dept.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenManage(dept)}
                          className="btn-pill-outline"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Requests & Documents Roster */}
          <div className="content-card">
            <h2 className="card-heading-title">Student Submissions & Attached Documents</h2>
            <div className="eksu-table-container">
              <table className="eksu-table">
                <thead>
                  <tr>
                    <th>MATRIC NO</th>
                    <th>STUDENT NAME</th>
                    <th>DEPARTMENT</th>
                    <th>ATTACHED PROOFS</th>
                    <th>CLEARANCE STATUS</th>
                    <th style={{ textAlign: 'center' }}>VERIFY</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.matricNo}</strong></td>
                      <td>{req.studentName}</td>
                      <td>{req.departmentName}</td>
                      <td>
                        <span className="badge-active-pill">
                          📁 {req.documents ? req.documents.length : 0} Document(s)
                        </span>
                      </td>
                      <td>
                        <span className={req.overallStatus === 'APPROVED' ? 'badge-approved-pill' : 'badge-pending-pill'}>
                          {req.overallStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenStudentVerification(req)}
                          className="btn-pill-maroon"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.85rem' }}
                        >
                          Review Documents
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Student Document Review Modal */}
      <Modal
        isOpen={isStudentReviewOpen}
        title={`Verification Documents - ${selectedStudentRequest?.studentName} (${selectedStudentRequest?.matricNo})`}
        onClose={() => setIsStudentReviewOpen(false)}
        footer={
          <button onClick={() => setIsStudentReviewOpen(false)} className="btn btn-pill-maroon btn-sm">
            Close Review
          </button>
        }
      >
        {selectedStudentRequest && (
          <div>
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              <strong>Student:</strong> {selectedStudentRequest.studentName} | <strong>Matric:</strong> {selectedStudentRequest.matricNo}
            </div>

            {(!selectedStudentRequest.documents || selectedStudentRequest.documents.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                Student has not uploaded verification documents yet.
              </div>
            ) : (
              <div className="eksu-table-container">
                <table className="eksu-table">
                  <thead>
                    <tr>
                      <th>DOCUMENT TYPE</th>
                      <th>FILE NAME</th>
                      <th>SIZE</th>
                      <th>UPLOADED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudentRequest.documents.map(d => (
                      <tr key={d.id}>
                        <td><strong>{d.type}</strong></td>
                        <td>{d.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{d.size}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(d.uploadedAt).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Manage Department Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`Manage ${selectedDept?.name} Unit`}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSaveEdit} className="btn btn-primary btn-sm">Save Changes</button>
          </>
        }
      >
        {selectedDept && (
          <form onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Clearance Unit
              </label>
              <input type="text" value={selectedDept.name} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Assigned Desk Officer
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Official Email Address
              </label>
              <input
                type="email"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                required
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        title="Add New Clearance Unit"
        onClose={() => setIsAddModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleAddDepartment} className="btn btn-primary btn-sm">Add Unit</button>
          </>
        }
      >
        <form onSubmit={handleAddDepartment}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Department Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sports & Health"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Clearance Description
            </label>
            <input
              type="text"
              placeholder="e.g. Health & Sports equipment verification"
              value={newDeptDesc}
              onChange={(e) => setNewDeptDesc(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Assigned Desk Officer
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. S. Balogun"
              value={newOfficerName}
              onChange={(e) => setNewOfficerName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Official Email
            </label>
            <input
              type="email"
              placeholder="e.g. sports@eksu.edu.ng"
              value={newOfficerEmail}
              onChange={(e) => setNewOfficerEmail(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage;
