import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClearance } from '../context/ClearanceContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Modal } from '../components/common/CommonComponents';

const REQUIRED_DOC_TYPES = [
  'Bursary School Fees & Convocation Receipt',
  'Library Card & Book Return Slip',
  'Departmental Project Approval Sheet',
  'Faculty Clearance & Statement of Results',
  'Student Affairs Clearance Slip & ID Card'
];

const ClearancePage = () => {
  const { myRequest, departments, submitClearanceApplication, uploadDocument, deleteDocument } = useClearance();

  const [selectedDocType, setSelectedDocType] = useState(REQUIRED_DOC_TYPES[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    try {
      submitClearanceApplication();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !fileName) {
      alert('Please choose a file to upload.');
      return;
    }

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        const sizeKb = Math.round(selectedFile.size / 1024) + ' KB';
        uploadDocument(selectedDocType, selectedFile.name, base64Data, sizeKb);
        setUploadSuccess(true);
        setSelectedFile(null);
        setFileName('');
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      uploadDocument(selectedDocType, `${selectedDocType.replace(/\s+/g, '_')}_EKSU.pdf`, null, '180 KB');
      setUploadSuccess(true);
      setFileName('');
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleOpenPreview = (doc) => {
    setPreviewDoc(doc);
    setIsModalOpen(true);
  };

  const userDocuments = myRequest?.documents || [];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Clearance Request</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Clearance Progress & Units</h1>
              <p className="page-sub-heading">
                Multi-unit approval breakdown and verification document submissions for session 2025/2026.
              </p>
            </div>
          </div>

          {!myRequest ? (
            <div className="content-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Clearance Request</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Initiate your graduation clearance to allow required academic and administrative units to review your records.
              </p>
              <button onClick={handleStart} className="btn btn-pill-maroon" style={{ padding: '0.65rem 2rem' }}>
                🚀 Initiate Clearance Request
              </button>
            </div>
          ) : (
            <>
              {/* Progress Summary Card */}
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Clearance Completion: {myRequest.completionPercentage}%</span>
                  <span className="badge-active-pill">{myRequest.overallStatus}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${myRequest.completionPercentage}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.4s ease' }}></div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="content-card">
                <h2 className="card-heading-title">📎 Upload Clearance Verification Documents</h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Graduating students must upload evidence of payment, project approval, and library clearance for fast officer verification.
                </p>

                {uploadSuccess && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    border: '1px solid #a7f3d0'
                  }}>
                    ✓ Document successfully uploaded and queued for desk officer inspection.
                  </div>
                )}

                <form onSubmit={handleUploadSubmit} className="clearance-upload-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Document Category
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                    >
                      {REQUIRED_DOC_TYPES.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Select File (PDF, PNG, JPG)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      style={{ padding: '0.35rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-pill-maroon"
                    style={{ padding: '0.55rem 1.4rem', whiteSpace: 'nowrap' }}
                  >
                    Upload Document
                  </button>
                </form>

                {/* Uploaded Documents Table */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Uploaded Documents ({userDocuments.length})
                  </h3>

                  {userDocuments.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      No documents uploaded yet. Please upload your Bursary receipt and Project Approval sheet.
                    </div>
                  ) : (
                    <div className="eksu-table-container">
                      <table className="eksu-table">
                        <thead>
                          <tr>
                            <th>DOCUMENT CATEGORY</th>
                            <th>FILE NAME</th>
                            <th>SIZE</th>
                            <th>DATE UPLOADED</th>
                            <th style={{ textAlign: 'center' }}>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDocuments.map(doc => (
                            <tr key={doc.id}>
                              <td><strong>{doc.type}</strong></td>
                              <td>{doc.name}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{doc.size}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreview(doc)}
                                    className="btn-pill-outline"
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                                  >
                                    👁️ Preview
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteDocument(doc.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger-color)', fontSize: '0.85rem', cursor: 'pointer' }}
                                    title="Delete document"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Clearance Units Status Table */}
              <div className="content-card">
                <h2 className="card-heading-title">Required Clearance Units</h2>
                <div className="eksu-table-container">
                  <table className="eksu-table">
                    <thead>
                      <tr>
                        <th>CLEARANCE UNIT</th>
                        <th>ASSIGNED OFFICER</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                        <th>OFFICER REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => {
                        const deptState = myRequest.departments?.[dept.code] || { status: 'PENDING', comments: '' };
                        return (
                          <tr key={dept.id}>
                            <td>
                              <div style={{ fontWeight: '600' }}>{dept.name}</div>
                              <div className="unit-subtext">{dept.description}</div>
                            </td>
                            <td>{dept.officerName}</td>
                            <td>
                              <span className={deptState.status === 'APPROVED' ? 'badge-approved-pill' : 'badge-pending-pill'}>
                                {deptState.status}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {deptState.date ? new Date(deptState.date).toLocaleDateString('en-GB') : '-'}
                            </td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                              {deptState.comments || 'No remarks recorded.'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {myRequest.overallStatus === 'APPROVED' && (
                <div className="content-card" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', textAlign: 'center' }}>
                  <h3 style={{ color: '#065f46', marginBottom: '0.5rem' }}>🎉 All Units Cleared Successfully</h3>
                  <p style={{ color: '#047857', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    You have satisfied all clearance obligations. You can now download and print your official certificate.
                  </p>
                  <Link to="/student/certificate" className="btn btn-pill-maroon">
                    Print Final Clearance Certificate
                  </Link>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Document Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`Document Verification Preview - ${previewDoc?.type}`}
        onClose={() => setIsModalOpen(false)}
        footer={
          <button onClick={() => setIsModalOpen(false)} className="btn btn-pill-maroon btn-sm">
            Close Preview
          </button>
        }
      >
        {previewDoc && (
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{previewDoc.name}</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Category: {previewDoc.type} | Size: {previewDoc.size} | Uploaded: {new Date(previewDoc.uploadedAt).toLocaleString()}
            </div>

            {previewDoc.dataUrl && previewDoc.dataUrl.startsWith('data:image') ? (
              <img
                src={previewDoc.dataUrl}
                alt="Uploaded proof"
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '6px', border: '1px solid #e2e8f0', objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '2rem 1rem',
                color: '#475569'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Electronic Document Verified</div>
                <div style={{ fontSize: '0.85rem' }}>
                  This official academic file has been authenticated and attached to student record for officer review.
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClearancePage;
