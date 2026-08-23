import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchNotifications = useCallback(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const all = storageService.getNotifications();
    const userNotifications = all.filter(n => {
      if (currentUser.role === 'STUDENT' && n.recipientStudentId === currentUser.id) return true;
      if (currentUser.role === 'OFFICER' && n.recipientRole === 'OFFICER') return true;
      if (currentUser.role === 'ADMIN') return true;
      return false;
    });

    setNotifications(userNotifications);
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const markAllAsRead = () => {
    const all = storageService.getNotifications();
    const updated = all.map(n => ({ ...n, read: true }));
    localStorage.setItem('acs_notifications', JSON.stringify(updated));
    fetchNotifications();
  };

  const value = {
    notifications,
    toast,
    showToast,
    fetchNotifications,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '300px',
          maxWidth: '450px',
          animation: 'slideIn 0.3s ease'
        }}>
          <div className={`alert alert-${toast.type}`} style={{ margin: 0, boxShadow: 'var(--shadow-lg)' }}>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', fontWeight: 'bold', marginLeft: '10px' }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
