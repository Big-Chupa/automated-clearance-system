import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Footer = () => (
  <footer style={{
    textAlign: 'center',
    padding: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginTop: 'auto'
  }}>
    <p>&copy; {new Date().getFullYear()} University Directorate of ICT & Academic Records. Automated Clearance System.</p>
  </footer>
);

export const Modal = ({ isOpen, title, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          &times;
        </button>
      )}
    </div>
  );
};

export const ProgressBar = ({ percentage = 0, showLabel = true }) => {
  const safePercent = Math.min(100, Math.max(0, percentage));
  return (
    <div className="progress-wrapper">
      {showLabel && (
        <div className="progress-header">
          <span>Clearance Progress</span>
          <span>{safePercent}% Completed</span>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safePercent}%` }}></div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-neutral';
  let label = status;

  switch (status) {
    case 'APPROVED':
      badgeClass = 'badge-approved';
      label = 'Approved';
      break;
    case 'REJECTED':
      badgeClass = 'badge-rejected';
      label = 'Rejected';
      break;
    case 'PENDING':
      badgeClass = 'badge-pending';
      label = 'Pending';
      break;
    case 'IN_PROGRESS':
      badgeClass = 'badge-pending';
      label = 'In Progress';
      break;
    case 'ACTION_REQUIRED':
      badgeClass = 'badge-rejected';
      label = 'Action Required';
      break;
    default:
      badgeClass = 'badge-neutral';
      label = status;
  }

  return <span className={`badge ${badgeClass}`}>{label}</span>;
};

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading session...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
