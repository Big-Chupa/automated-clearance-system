import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '450px',
        padding: '2.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>404</div>
        <h1 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          The clearance page or portal resource you requested does not exist.
        </p>
        <Link to="/" className="btn btn-pill-maroon">
          Return to Portal Overview
        </Link>
      </div>
    </div>
  );
};
