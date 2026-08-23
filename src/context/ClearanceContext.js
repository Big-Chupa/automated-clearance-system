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
      let studentReq = allReqs.find(r => r.studentId === currentUser.id);
      if (!studentReq) {
        // Automatically ensure a clearance request container exists for the student
        studentReq = storageService.createClearanceRequest(currentUser);
      }
      setMyRequest(studentReq);
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

    const newReq = storageService.createClearanceRequest(currentUser);
    refreshData();
    return newReq;
  };

  // Student uploads document
  const uploadDocument = (docType, docName, docBase64, fileSize) => {
    let req = myRequest;
    if (!req && currentUser) {
      req = storageService.createClearanceRequest(currentUser);
    }

    const updated = storageService.uploadStudentDocument(req.id, docType, docName, docBase64, fileSize);
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

  // Fast Automated Clearance Verification Engine
  const runAutomatedVerification = () => {
    if (!myRequest) return null;
    const updated = storageService.completeAllDepartmentClearances(myRequest.id);
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
    runAutomatedVerification,
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
