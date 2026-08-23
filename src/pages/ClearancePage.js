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

const VERIFICATION_STEPS = [
  { unit: 'Bursary & Financial Accounts', detail: 'Verifying school fees, departmental dues, and convocation payments...' },
  { unit: 'University Library System', detail: 'Cross-referencing borrower records and checking for outstanding library books...' },
  { unit: 'Department of Computer Science', detail: 'Validating final year project repository submission and HOD endorsement...' },
  { unit: 'Faculty Board of Examiners', detail: 'Verifying course unit compliance, grade point average, and Dean endorsement...' },
  { unit: 'Student Affairs Directorate', detail: 'Checking disciplinary registries, alumni dues, and hall clearance records...' },
  { unit: 'Academic Registry & Examinations', detail: 'Generating cryptographically sealed graduate clearance certificate...' }
];

const ClearancePage = () => {
  const { myRequest, departments, submitClearanceApplication, uploadDocument, deleteDocument, runAutomatedVerification } = useClearance();

  const [selectedDocType, setSelectedDocType] = useState(REQUIRED_DOC_TYPES[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Verification Simulation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);

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
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        const sizeKb = Math.round(selectedFile.size / 1024) + ' KB';
        uploadDocument(selectedDocType, selectedFile.name, base64Data, sizeKb);
        setUploadSuccess(true);
        setSelectedFile(null);
        setTimeout(() => setUploadSuccess(false), 3500);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Mock upload if user clicked without browsing
      uploadDocument(selectedDocType, `${selectedDocType.replace(/\s+/g, '_')}_EKSU.pdf`, null, '210 KB');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    }
  };

  const handleOpenPreview = (doc) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleStartVerificationSimulation = () => {
    setIsVerificationModalOpen(true);
    setIsVerifying(true);
    setIsVerificationComplete(false);
    setVerificationProgress(5);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < VERIFICATION_STEPS.length) {
        setCurrentStepIndex(step);
        setVerificationProgress(Math.round((step / VERIFICATION_STEPS.length) * 100));
      } else {
        clearInterval(interval);
        setVerificationProgress(100);
        setIsVerifying(false);
        setIsVerificationComplete(true);
        runAutomatedVerification();
      }
    }, 900);
  };

  const userDocuments = myRequest?.documents || [];
  const isApproved = myRequest?.overallStatus === 'APPROVED';

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / Clearance Request</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">Clearance Progress & Document Verification</h1>
              <p className="page-sub-heading">
                Upload verification receipts, monitor unit reviews, and generate final certification for session 2025/2026.
              </p>
            </div>
            {isApproved && (
              <Link to="/student/certificate" className="btn btn-pill-maroon" style={{ padding: '0.55rem 1.5rem' }}>
                📜 View & Print Certificate
              </Link>
            )}
          </div>

          {!myRequest ? (
            <div className="content-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Start Your Graduation Clearance</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Initiate your graduation clearance to allow academic, financial, and registry units to process your records.
              </p>
              <button onClick={handleStart} className="btn btn-pill-maroon" style={{ padding: '0.65rem 2rem' }}>
                🚀 Initiate Clearance Application
              </button>
            </div>
          ) : (
            <>
              {/* Top Progress Status Card */}
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>
                    Clearance Progress: <strong>{myRequest.completionPercentage}%</strong>
                  </span>
                  <span className={isApproved ? 'badge-approved-pill' : 'badge-pending-pill'}>
                    {myRequest.overallStatus}
                  </span>
                </div>
                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${myRequest.completionPercentage}%`,
                    backgroundColor: isApproved ? 'var(--success-color)' : 'var(--primary-color)',
                    transition: 'width 0.6s ease'
                  }}></div>
                </div>
              </div>

              {/* Step 1: Upload Documents */}
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h2 className="card-heading-title" style={{ margin: 0 }}>
                      📎 Step 1: Upload Clearance Documents
                    </h2>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Upload your Bursary receipt, Library card, and signed Project approval sheet for automatic inspection.
                    </p>
                  </div>

                  {userDocuments.length > 0 && !isApproved && (
                    <button
                      onClick={handleStartVerificationSimulation}
                      className="btn btn-pill-maroon"
                      style={{ padding: '0.55rem 1.35rem', animation: 'pulse 2s infinite' }}
                    >
                      ⚡ Submit & Run Instant Verification
                    </button>
                  )}
                </div>

                {uploadSuccess && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    border: '1px solid #a7f3d0'
                  }}>
                    ✓ Document successfully uploaded and queued for desk officer verification.
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

                {/* Uploaded Documents List */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      Attached Files ({userDocuments.length})
                    </h3>
                  </div>

                  {userDocuments.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1.25rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                      No verification documents attached yet. Select a category above and click <strong>Upload Document</strong> to proceed.
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

              {/* Step 2: Clearance Units Table */}
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 className="card-heading-title" style={{ margin: 0 }}>
                    🏛️ Step 2: Clearance Units Status Roster
                  </h2>
                  {!isApproved && (
                    <button
                      onClick={handleStartVerificationSimulation}
                      className="btn btn-pill-outline"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
                    >
                      ⚡ Fast Track Automated Verification
                    </button>
                  )}
                </div>

                <div className="eksu-table-container">
                  <table className="eksu-table">
                    <thead>
                      <tr>
                        <th>CLEARANCE UNIT</th>
                        <th>ASSIGNED OFFICER</th>
                        <th>STATUS</th>
                        <th>DATE VERIFIED</th>
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
                              {deptState.date ? new Date(deptState.date).toLocaleDateString('en-GB') : 'Awaiting Review'}
                            </td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                              {deptState.comments || 'Pending officer confirmation.'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 3: Certificate Unlocked Banner */}
              {isApproved && (
                <div className="content-card" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', textAlign: 'center', padding: '2rem 1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h3 style={{ color: '#065f46', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                    100% Graduation Clearance Verified!
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 1.25rem auto' }}>
                    All academic, financial, and administrative departments have endorsed your records. Your official digital clearance certificate has been issued.
                  </p>
                  <Link to="/student/certificate" className="btn btn-pill-maroon" style={{ padding: '0.65rem 2.25rem', fontSize: '0.95rem' }}>
                    📜 Print Official Clearance Certificate
                  </Link>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Real-Time Automated Verification Simulation Modal */}
      <Modal
        isOpen={isVerificationModalOpen}
        title="Automated Multi-Unit Verification Engine"
        onClose={() => !isVerifying && setIsVerificationModalOpen(false)}
        footer={
          isVerificationComplete ? (
            <Link to="/student/certificate" className="btn btn-pill-maroon btn-sm">
              📜 Open & Print Certificate
            </Link>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verifying university records in real-time...</span>
          )
        }
      >
        <div style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
          {isVerifying ? (
            <div>
              <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Processing Academic & Financial Verification</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {VERIFICATION_STEPS[currentStepIndex]?.detail}
              </p>

              {/* Progress Tracker */}
              <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{
                  height: '100%',
                  width: `${verificationProgress}%`,
                  backgroundColor: 'var(--primary-color)',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              {/* Live Step Checklist */}
              <div style={{ textAlign: 'left', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.825rem' }}>
                {VERIFICATION_STEPS.map((step, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0',
                    color: idx < currentStepIndex ? '#16a34a' : idx === currentStepIndex ? 'var(--primary-color)' : '#94a3b8',
                    fontWeight: idx === currentStepIndex ? 600 : 400
                  }}>
                    <span>{idx < currentStepIndex ? '✓' : idx === currentStepIndex ? '⏳' : '○'}</span>
                    <span>{step.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ fontSize: '1.2rem', color: '#166534', marginBottom: '0.35rem' }}>Verification Completed Successfully!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                All clearance units have approved your records. Your final certificate is now unlocked and ready for printing.
              </p>
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#065f46', marginBottom: '1rem' }}>
                <strong>Certificate Number:</strong> {myRequest?.certificateNumber || 'EKSU/2026/CLR/VERIFIED'}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        title={`Document Verification Preview - ${previewDoc?.type}`}
        onClose={() => setIsPreviewOpen(false)}
        footer={
          <button onClick={() => setIsPreviewOpen(false)} className="btn btn-pill-maroon btn-sm">
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
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Electronic Document Authenticated</div>
                <div style={{ fontSize: '0.85rem' }}>
                  This official academic clearance document has been attached to your graduate clearance application.
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
