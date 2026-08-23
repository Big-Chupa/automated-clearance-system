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
    const rawId = (identifier || '').trim();
    const cleanId = rawId.toLowerCase();

    // 1. Direct match in storage or INITIAL_USERS
    let users = storageService.getUsers();
    let user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uMatric = (u.matricNo || '').toLowerCase().trim();
      return uEmail === cleanId || uMatric === cleanId;
    });

    if (!user) {
      user = INITIAL_USERS.find(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uMatric = (u.matricNo || '').toLowerCase().trim();
        return uEmail === cleanId || uMatric === cleanId;
      });
    }

    // 2. Partial / Fuzzy matching for student demos
    if (!user) {
      if (cleanId.includes('0088') || cleanId.includes('amina') || cleanId.includes('yusuf')) {
        user = INITIAL_USERS.find(u => u.matricNo === 'EKSU/CSC/22/0088');
      } else if (cleanId.includes('0112') || cleanId.includes('seun') || cleanId.includes('adeleke')) {
        user = INITIAL_USERS.find(u => u.matricNo === 'EKSU/MTH/22/0112');
      } else if (cleanId.includes('0045') || cleanId.includes('blessing') || cleanId.includes('okon')) {
        user = INITIAL_USERS.find(u => u.matricNo === 'EKSU/GEO/22/0045');
      } else if (cleanId.includes('0063') || cleanId.includes('moses')) {
        user = INITIAL_USERS.find(u => u.matricNo === 'EKSU/CSC/22/0063');
      } else if (cleanId.includes('admin')) {
        user = INITIAL_USERS.find(u => u.role === 'ADMIN');
      } else if (cleanId.includes('bursary')) {
        user = INITIAL_USERS.find(u => u.departmentCode === 'BURSARY');
      } else if (cleanId.includes('library') || cleanId.includes('lib')) {
        user = INITIAL_USERS.find(u => u.departmentCode === 'LIBRARY');
      } else if (cleanId.includes('department') || cleanId.includes('dep')) {
        user = INITIAL_USERS.find(u => u.departmentCode === 'DEPARTMENT');
      }
    }

    // 3. If user entered any custom matriculation number or email, dynamically create their profile!
    if (!user && rawId.length > 0) {
      const generatedName = rawId.includes('@') 
        ? rawId.split('@')[0].replace(/[._-]/g, ' ').toUpperCase()
        : 'STUDENT ' + rawId.slice(-4).toUpperCase();

      user = {
        id: `usr-stud-${Date.now()}`,
        matricNo: rawId.toUpperCase(),
        fullName: generatedName,
        email: rawId.includes('@') ? rawId.toLowerCase() : `${rawId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@eksu.edu.ng`,
        password: password || 'password123',
        role: selectedRole || 'STUDENT',
        initials: generatedName.slice(0, 2).toUpperCase(),
        departmentName: 'Computer Science',
        faculty: 'Science',
        graduationYear: '2025/2026',
        degree: 'B.Sc. (Hons)',
        phone: '08000000000',
        status: 'ACTIVE'
      };
      storageService.saveUser(user);
    }

    if (!user) {
      user = INITIAL_USERS[0];
    }

    // Save and establish session
    setCurrentUser(user);
    storageService.setCurrentUser(user);
    storageService.addAuditLog(user.id, user.role, user.fullName, 'LOGIN', `${user.fullName} authenticated into the portal.`);
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
