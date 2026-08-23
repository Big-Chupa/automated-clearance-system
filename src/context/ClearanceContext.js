import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

const ClearanceContext = createContext(null);

export const ClearanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myRequest, setMyRequest] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(() => {
    const allDepts = storageService.getDepartments();
    const allReqs = storageService.getClearanceRequests();
    const allLogs = storageService.getAuditLogs();

    setDepartments(allDepts);
    setRequests(allReqs);
    setAuditLogs(allLogs);

    if (currentUser && currentUser.role === 'STUDENT') {
      const studentReq = allReqs.find(r => r.studentId === currentUser.id);
      setMyRequest(studentReq || null);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Student initiates clearance
  const submitClearanceApplication = () => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      throw new Error('Only registered students can apply for clearance.');
    }

    if (myRequest) {
      throw new Error('A clearance application has already been submitted for this account.');
    }

    const depts = storageService.getDepartments();
    const deptMap = {};
    depts.forEach(d => {
      deptMap[d.code] = {
        status: 'PENDING',
        date: null,
        officer: null,
        comments: ''
      };
    });

    const newReq = storageService.createClearanceRequest(currentUser, deptMap);
    refreshData();
    return newReq;
  };

  // Student uploads document
  const uploadDocument = (docType, docName, docBase64, fileSize) => {
    if (!myRequest) {
      throw new Error('Please initiate a clearance application before uploading documents.');
    }

    const updated = storageService.uploadStudentDocument(myRequest.id, docType, docName, docBase64, fileSize);
    refreshData();
    return updated;
  };

  // Student deletes document
  const deleteDocument = (docId) => {
    if (!myRequest) return;
    const updated = storageService.deleteStudentDocument(myRequest.id, docId);
    refreshData();
    return updated;
  };

  // Department officer approves or rejects
  const updateDepartmentStatus = (requestId, status, comments) => {
    if (!currentUser || (currentUser.role !== 'OFFICER' && currentUser.role !== 'ADMIN')) {
      throw new Error('Unauthorized. Only designated departmental officers can review requests.');
    }

    const deptCode = currentUser.departmentCode || 'BURSARY';

    const updated = storageService.updateDepartmentClearanceStatus(
      requestId,
      deptCode,
      status,
      currentUser.fullName,
      comments
    );

    refreshData();
    return updated;
  };

  // Admin / Supervisor manual override
  const adminOverrideStatus = (requestId, deptCode, status, comments) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Unauthorized. Admin privileges required.');
    }

    const updated = storageService.updateDepartmentClearanceStatus(
      requestId,
      deptCode,
      status,
      `ADMIN: ${currentUser.fullName}`,
      comments
    );

    refreshData();
    return updated;
  };

  const value = {
    departments,
    requests,
    myRequest,
    auditLogs,
    loading,
    refreshData,
    submitClearanceApplication,
    uploadDocument,
    deleteDocument,
    updateDepartmentStatus,
    adminOverrideStatus
  };

  return <ClearanceContext.Provider value={value}>{children}</ClearanceContext.Provider>;
};

export const useClearance = () => {
  const context = useContext(ClearanceContext);
  if (!context) {
    throw new Error('useClearance must be used within a ClearanceProvider');
  }
  return context;
};
