import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

const ClearanceContext = createContext(null);

export const ClearanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myRequest, setMyRequest] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    if (!currentUser) {
      setDepartments([]);
      setRequests([]);
      setAuditLogs([]);
      setMyRequest(null);
      setLoading(false);
      return;
    }

    const [allDepts, allReqs, allLogs] = await Promise.all([
      apiService.getDepartments(),
      apiService.getClearanceRequests(),
      currentUser.role === 'ADMIN' ? apiService.getAuditLogs() : Promise.resolve([])
    ]);

    setDepartments(allDepts);
    setRequests(allReqs);
    setAuditLogs(allLogs);

    if (currentUser.role === 'STUDENT') {
      setMyRequest(allReqs.find((request) => request.studentId === currentUser.id) || null);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Student initiates clearance
  const submitClearanceApplication = async () => {
    if (!currentUser || currentUser.role !== 'STUDENT') {
      throw new Error('Only registered students can apply for clearance.');
    }

    const newReq = await apiService.createClearanceRequest();
    await refreshData();
    return newReq;
  };

  // Student uploads document
  const uploadDocument = async (docType, docName, docBase64, fileSize, mimeType) => {
    const request = myRequest || await apiService.createClearanceRequest();
    const updated = await apiService.uploadDocument(request.id, docType, docName, docBase64, fileSize, mimeType);
    await refreshData();
    return updated;
  };

  // Student deletes document
  const deleteDocument = async (docId) => {
    if (!myRequest) return;
    const updated = await apiService.deleteDocument(myRequest.id, docId);
    await refreshData();
    return updated;
  };

  // Fast Automated Clearance Verification Engine
  const runAutomatedVerification = async () => {
    if (!myRequest) return null;
    const updated = await apiService.runAutomatedVerification(myRequest.id);
    await refreshData();
    return updated;
  };

  // Department officer approves or rejects
  const updateDepartmentStatus = async (requestId, status, comments) => {
    if (!currentUser || (currentUser.role !== 'OFFICER' && currentUser.role !== 'ADMIN')) {
      throw new Error('Unauthorized. Only designated departmental officers can review requests.');
    }

    const deptCode = currentUser.departmentCode || 'BURSARY';
    const updated = await apiService.updateDepartmentStatus(requestId, deptCode, status, comments);
    await refreshData();
    return updated;
  };

  // Admin / Supervisor manual override
  const adminOverrideStatus = async (requestId, deptCode, status, comments) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Unauthorized. Admin privileges required.');
    }

    const updated = await apiService.updateDepartmentStatus(requestId, deptCode, status, comments);
    await refreshData();
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
