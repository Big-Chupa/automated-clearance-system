import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getCurrentUser().then((stored) => {
      if (stored) setCurrentUser(stored);
      setLoading(false);
    });
  }, []);

  const login = async (identifier, password, selectedRole) => {
    const user = await apiService.login(identifier, password, selectedRole);
>>>>>>> 0c4b31c (Finalize automated clearance system updates)
    setCurrentUser(user);
    return user;
  };

  const registerStudent = async (studentData) => {
    const newUser = await apiService.register(studentData);
    setCurrentUser(newUser);
    return newUser;
  };

  const resetPassword = async (identifier, newPassword) => {
    await apiService.resetPassword(identifier, newPassword);
    return true;
  };

  const logout = () => {
    apiService.logout();
    setCurrentUser(null);
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
