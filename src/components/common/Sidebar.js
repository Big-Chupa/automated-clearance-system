import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isStudent = currentUser?.role === 'STUDENT';
  const portalTitle = isStudent ? 'STUDENT PORTAL' : 'ADMINISTRATOR PORTAL';

  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('.portal-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    }
  };

  const handleLogout = () => {
    closeMobileSidebar();
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>
      <aside className="portal-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem' }}>
          <div className="sidebar-portal-title" style={{ flex: 1, borderBottom: 'none', marginBottom: 0 }}>
            {portalTitle}
          </div>
          <button 
            onClick={closeMobileSidebar}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.25rem' }}
            className="mobile-close-btn"
          >
            ✕
          </button>
        </div>

        <ul className="sidebar-nav-list" style={{ marginTop: '0.75rem' }}>
          {isStudent ? (
            <>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/student/dashboard" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Overview
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/student/clearance" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Clearance Request
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/student/progress" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> My Progress
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/notifications" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Notifications
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/student/certificate" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Final Certificate
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/admin/dashboard" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Overview
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/admin/students" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Students
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/admin/departments" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Departments
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/admin/reports" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Reports
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/notifications" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Notifications
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink 
                  to="/settings" 
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">✦</span> Settings
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span>↳</span> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
