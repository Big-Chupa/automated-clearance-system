import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClearance } from '../context/ClearanceContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { apiService } from '../services/apiService';

const CertificatePage = () => {
  const { currentUser } = useAuth();
  const { myRequest } = useClearance();
  const [certificateRequest, setCertificateRequest] = useState(null);
  const [certificateCheckDone, setCertificateCheckDone] = useState(false);
  const [certificateError, setCertificateError] = useState('');

  useEffect(() => {
    let active = true;
    setCertificateRequest(null);
    setCertificateError('');
    setCertificateCheckDone(false);
    if (!myRequest?.id) {
      setCertificateCheckDone(true);
      return () => { active = false; };
    }
    apiService.getCertificate(myRequest.id)
      .then(({ request }) => { if (active) setCertificateRequest(request); })
      .catch((error) => { if (active) setCertificateError(error.message); })
      .finally(() => { if (active) setCertificateCheckDone(true); });
    return () => { active = false; };
  }, [myRequest?.id]);

  const certificateReady = Boolean(certificateRequest);

  const handlePrint = () => {
    if (certificateReady) window.print();
  };

  const studentName = certificateRequest?.studentName || myRequest?.studentName || currentUser?.fullName || 'MOSES OCHOPEFU';
  const matricNo = certificateRequest?.matricNo || myRequest?.matricNo || currentUser?.matricNo || '220903067';
  const departmentName = certificateRequest?.departmentName || myRequest?.departmentName || currentUser?.departmentName || 'Computer Science';
  const faculty = certificateRequest?.faculty || myRequest?.faculty || currentUser?.faculty || 'Science';
  const degree = currentUser?.degree || 'B.Sc. (Hons) Computer Science';

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          {!certificateCheckDone ? (
            <div className="content-card" role="status">
              <h1 className="page-main-heading">Verifying clearance approvals</h1>
              <p className="page-sub-heading">Please wait while the server confirms that every required approval is complete.</p>
            </div>
          ) : !certificateReady ? (
            <div className="content-card" role="alert">
              <h1 className="page-main-heading">Certificate not available</h1>
              <p className="page-sub-heading">{certificateError || 'The final certificate can only be printed after all required documents are approved by both the administrator and their assigned clearance officer, and all clearance units are approved.'}</p>
            </div>
          ) : <>
          <div className="breadcrumb-trail cert-print-actions">Home / Final Certificate</div>
          <div className="page-header-row cert-print-actions">
            <div>
              <h1 className="page-main-heading">Academic Result</h1>
              <p className="page-sub-heading">Academic prototype preview with an example honours classification.</p>
            </div>
            <button onClick={handlePrint} className="btn btn-pill-maroon" style={{ padding: '0.5rem 1.4rem' }}>
              🖨️ Print / Save as PDF
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <div className="certificate-paper" style={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: '#ffffff',
              border: '10px solid #701a2b',
              outline: '3px solid #d97706',
              outlineOffset: '-6px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏛️</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#701a2b', letterSpacing: '0.05em' }}>
                EKITI STATE UNIVERSITY, ADO-EKITI
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DIRECTORATE OF ACADEMIC AFFAIRS & STUDENT RECORDS
              </div>

              <div style={{
                margin: '1.25rem auto',
                display: 'inline-block',
                borderTop: '2px solid #701a2b',
                borderBottom: '2px solid #701a2b',
                padding: '0.4rem 1.25rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#701a2b',
                letterSpacing: '0.05em'
              }}>
                Second Class Upper
              </div>

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto 1.25rem auto' }}>
                This example honours classification is for the academic prototype and is not sourced from an academic transcript.
              </p>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#701a2b', textDecoration: 'underline', textUnderlineOffset: '4px', marginBottom: '1.25rem' }}>
                {studentName.toUpperCase()}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem',
                maxWidth: '600px',
                margin: '0 auto 1.75rem auto',
                textAlign: 'left',
                backgroundColor: '#f8fafc',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}>
                <div><strong>Matriculation No:</strong> {matricNo}</div>
                <div><strong>Graduation Session:</strong> 2025/2026</div>
                <div><strong>Degree Earned:</strong> {degree}</div>
                <div><strong>Department:</strong> {departmentName}</div>
                <div><strong>Faculty:</strong> {faculty}</div>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
                Academic prototype preview · example classification
              </p>
            </div>
          </div>
          </>}
        </main>
      </div>
    </div>
  );
};

export default CertificatePage;
