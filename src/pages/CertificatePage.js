import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useClearance } from '../context/ClearanceContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const CertificatePage = () => {
  const { currentUser } = useAuth();
  const { myRequest } = useClearance();

  const handlePrint = () => {
    window.print();
  };

  const studentName = myRequest?.studentName || currentUser?.fullName || 'MOSES OCHOPELU';
  const matricNo = myRequest?.matricNo || currentUser?.matricNo || 'EKSU/CSC/22/0063';
  const departmentName = myRequest?.departmentName || currentUser?.departmentName || 'Computer Science';
  const faculty = myRequest?.faculty || currentUser?.faculty || 'Science';
  const certNumber = myRequest?.certificateNumber || `EKSU/2026/CLR/${matricNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail cert-print-actions">Home / Final Certificate</div>
          <div className="page-header-row cert-print-actions">
            <div>
              <h1 className="page-main-heading">Final Clearance Certificate</h1>
              <p className="page-sub-heading">Official certification of graduate clearance for EKSU.</p>
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
                FINAL GRADUATE CLEARANCE CERTIFICATE
              </div>

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto 1.25rem auto' }}>
                This is to officially certify that the student whose details appear below has satisfactorily fulfilled all academic, financial, administrative, and disciplinary clearance requirements for graduation.
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
                <div><strong>Department:</strong> {departmentName}</div>
                <div><strong>Faculty:</strong> {faculty}</div>
                <div><strong>Certificate No:</strong> {certNumber}</div>
                <div><strong>Verification Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>FULLY CLEARED</span></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', padding: '0 1rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <div style={{ width: '140px', borderTop: '1px dashed #000', marginBottom: '0.4rem', margin: '0 auto' }}></div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Dr. T. Ogunleye</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Head of Department</div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <div style={{ width: '140px', borderTop: '1px dashed #000', marginBottom: '0.4rem', margin: '0 auto' }}></div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Mr. P. Adebayo</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Academic Registrar</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CertificatePage;
