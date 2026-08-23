import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userInitials = currentUser?.initials || (currentUser?.fullName ? currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DA');
  const userRoleDisplay = currentUser?.role === 'ADMIN' ? 'Administrator' : currentUser?.role === 'STUDENT' ? 'Student' : 'Officer';

  const toggleMobileSidebar = () => {
    const sidebar = document.querySelector('.portal-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    }
  };

  return (
    <header className="app-header">
      {/* Brand Header & Mobile Toggle */}
      <div className="header-left">
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className="header-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="header-logo-icon">🏛️</div>
          <div className="header-brand-text">
            <div className="header-brand-title">EKSU Clearance Portal</div>
            <div className="header-brand-subtitle">Ekiti State University, Ado-Ekiti</div>
          </div>
        </div>
      </div>

      {/* Right User Bar */}
      <div className="header-actions">
        <button className="header-icon-btn" title="View Documents" onClick={() => navigate('/admin/reports')}>
          📄
        </button>

        <button 
          className="header-icon-btn header-bell-icon" 
          title="Notifications" 
          onClick={() => navigate('/notifications')}
        >
          🔔
        </button>

        <div className="header-user-profile">
          <div className="header-user-info">
            <div className="header-user-name">{currentUser?.fullName || 'David Akinyemi'}</div>
            <div className="header-user-role">{userRoleDisplay}</div>
          </div>
          <div className="header-avatar-badge">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
