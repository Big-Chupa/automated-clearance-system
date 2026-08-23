import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.init();
    const stored = storageService.getCurrentUser();
    if (stored) {
      setCurrentUser(stored);
    }
    setLoading(false);
  }, []);

  const login = (identifier, password, selectedRole) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Check in localStorage users
    let users = storageService.getUsers();
    let user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uMatric = (u.matricNo || '').toLowerCase().trim();
      return (uEmail === cleanId || uMatric === cleanId) && u.password === cleanPass;
    });

    // 2. Fallback to INITIAL_USERS if not in localStorage
    if (!user) {
      user = INITIAL_USERS.find(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uMatric = (u.matricNo || '').toLowerCase().trim();
        return (uEmail === cleanId || uMatric === cleanId) && u.password === cleanPass;
      });

      if (user) {
        // Save to localStorage so future lookups find it
        storageService.saveUser(user);
      }
    }

    // 3. If password matches default password123 and matric matches any demo user
    if (!user && cleanPass === 'password123') {
      user = INITIAL_USERS.find(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uMatric = (u.matricNo || '').toLowerCase().trim();
        return uEmail === cleanId || uMatric === cleanId || cleanId.includes(uMatric) || uMatric.includes(cleanId);
      });
      if (user) {
        storageService.saveUser(user);
      }
    }

    if (!user) {
      throw new Error('Invalid matriculation number/email or password. Please select one of the demo buttons below.');
    }

    setCurrentUser(user);
    storageService.setCurrentUser(user);
    storageService.addAuditLog(user.id, user.role, user.fullName, 'LOGIN', `${user.fullName} logged into the portal.`);
    return user;
  };

  const registerStudent = (studentData) => {
    const users = storageService.getUsers();
    const exists = users.some(u => 
      u.matricNo.toLowerCase() === studentData.matricNo.toLowerCase() ||
      u.email.toLowerCase() === studentData.email.toLowerCase()
    );

    if (exists) {
      throw new Error('A student with this Matriculation Number or Email is already registered.');
    }

    const newUser = {
      id: `usr-stud-${Date.now()}`,
      role: 'STUDENT',
      status: 'ACTIVE',
      ...studentData
    };

    storageService.saveUser(newUser);
    setCurrentUser(newUser);
    storageService.setCurrentUser(newUser);
    return newUser;
  };

  const resetPassword = (identifier, newPassword) => {
    const users = storageService.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const index = users.findIndex(u => 
      u.email.toLowerCase() === cleanId || u.matricNo.toLowerCase() === cleanId
    );

    if (index === -1) {
      throw new Error('No user account found matching provided details.');
    }

    users[index].password = newPassword;
    storageService.updateUser(users[index]);
    storageService.addAuditLog(users[index].id, users[index].role, users[index].fullName, 'PASSWORD_RESET', `Password reset successful for ${users[index].matricNo}`);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      storageService.addAuditLog(currentUser.id, currentUser.role, currentUser.fullName, 'LOGOUT', `${currentUser.fullName} logged out.`);
    }
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    registerStudent,
    resetPassword,
    logout,
    isAdmin: currentUser?.role === 'ADMIN',
    isOfficer: currentUser?.role === 'OFFICER',
    isStudent: currentUser?.role === 'STUDENT'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
