import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClearance } from '../context/ClearanceContext';
import { useNotification } from '../context/NotificationContext';
import { StatusBadge, Modal } from '../components/common/CommonComponents';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Footer } from '../components/common/CommonComponents';
import { formatDate } from '../utils/formatters';

const DepartmentDashboard = () => {
  const { currentUser } = useAuth();
  const { requests, updateDepartmentStatus } = useClearance();
  const { showToast } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('APPROVED'); // APPROVED or REJECTED
  const [officerComments, setOfficerComments] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deptCode = currentUser?.departmentCode || 'BURSARY';
  const deptName = currentUser?.departmentName || 'Departmental Review Office';

  // Extract requests for this specific department
  const filteredRequests = requests.filter(req => {
    const deptInfo = req.departments?.[deptCode] || { status: 'PENDING' };
    const matchesSearch = 
      req.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && deptInfo.status === filterStatus;
  });

  const totalCount = requests.length;
  const pendingCount = requests.filter(r => (r.departments?.[deptCode]?.status || 'PENDING') === 'PENDING').length;
  const approvedCount = requests.filter(r => r.departments?.[deptCode]?.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.departments?.[deptCode]?.status === 'REJECTED').length;

  const handleOpenActionModal = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setOfficerComments(type === 'APPROVED' ? 'Cleared satisfactorily.' : '');
    setIsModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedRequest) return;
    try {
      updateDepartmentStatus(selectedRequest.id, actionType, officerComments);
      showToast(`Clearance request for ${selectedRequest.matricNo} set to ${actionType}.`, 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">{deptName}</h1>
            <p className="page-description">Officer: {currentUser?.fullName} | Verification & Endorsement Desk</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div>
                <div className="stat-value">{totalCount}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-icon-wrapper icon-blue">📋</div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Pending Approval</div>
              </div>
              <div className="stat-icon-wrapper icon-amber">⏳</div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value">{approvedCount}</div>
                <div className="stat-label">Cleared by Dept</div>
              </div>
              <div className="stat-icon-wrapper icon-green">✅</div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value">{rejectedCount}</div>
                <div className="stat-label">Action Required</div>
              </div>
              <div className="stat-icon-wrapper icon-red">⚠️</div>
            </div>
          </div>

          {/* Table Container */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Clearance Applications Roster</span>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Search by Student Name or Matric No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Action Required / Rejected</option>
              </select>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Matric Number</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Submission Date</th>
                    <th>Dept Status</th>
                    <th>Officer Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No clearance applications match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => {
                      const deptState = req.departments?.[deptCode] || { status: 'PENDING', comments: '' };
                      return (
                        <tr key={req.id}>
                          <td><strong>{req.matricNo}</strong></td>
                          <td>{req.studentName}</td>
                          <td>{req.departmentName}</td>
                          <td>{formatDate(req.submittedAt)}</td>
                          <td><StatusBadge status={deptState.status} /></td>
                          <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: '#475569' }}>
                            {deptState.comments || '-'}
                          </td>
                          <td>
                            <div className="action-buttons-group">
                              <button
                                onClick={() => handleOpenActionModal(req, 'APPROVED')}
                                className="btn btn-success btn-sm"
                                title="Approve Request"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleOpenActionModal(req, 'REJECTED')}
                                className="btn btn-danger btn-sm"
                                title="Reject or Request Action"
                              >
                                ✕ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Approval / Rejection */}
        <Modal
          isOpen={isModalOpen}
          title={`${actionType === 'APPROVED' ? 'Endorse & Approve' : 'Reject / Query'} Student Clearance`}
          onClose={() => setIsModalOpen(false)}
          footer={
            <>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`btn btn-${actionType === 'APPROVED' ? 'success' : 'danger'} btn-sm`}
              >
                Confirm {actionType === 'APPROVED' ? 'Approval' : 'Rejection'}
              </button>
            </>
          }
        >
          {selectedRequest && (
            <div>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                You are updating clearance for student: <strong>{selectedRequest.studentName}</strong> ({selectedRequest.matricNo})
              </p>
              <div className="form-group">
                <label className="form-label">
                  {actionType === 'APPROVED' ? 'Approval Endorsement Remarks:' : 'Reason for Query / Action Required:'}
                </label>
                <textarea
                  rows="3"
                  value={officerComments}
                  onChange={(e) => setOfficerComments(e.target.value)}
                  placeholder={actionType === 'APPROVED' ? 'e.g. Cleared of all financial/academic dues.' : 'e.g. Kindly submit lab key or return borrowed book...'}
                  required
                />
              </div>
            </div>
          )}
        </Modal>

        <Footer />
      </div>
    </div>
  );
};

export default DepartmentDashboard;
