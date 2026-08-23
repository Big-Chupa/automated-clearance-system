import { 
  INITIAL_USERS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_CLEARANCE_REQUESTS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_DEPARTMENT_STATS 
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'eksu_acs_users',
  DEPARTMENTS: 'eksu_acs_departments',
  REQUESTS: 'eksu_acs_requests',
  AUDIT_LOGS: 'eksu_acs_audit_logs',
  SESSION: 'eksu_acs_session_user',
  NOTIFICATIONS: 'eksu_acs_notifications',
  SETTINGS: 'eksu_acs_settings',
  DEPT_STATS: 'eksu_acs_dept_stats'
};

export const storageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_CLEARANCE_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SYSTEM_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPT_STATS)) {
      localStorage.setItem(STORAGE_KEYS.DEPT_STATS, JSON.stringify(INITIAL_DEPARTMENT_STATS));
    }
  },

  // USERS
  getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUser(newUser) {
    const users = this.getUsers();
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.addAuditLog(newUser.id, newUser.role, newUser.fullName, 'USER_REGISTERED', `New account: ${newUser.matricNo}`);
    return newUser;
  },

  updateUser(updatedUser) {
    let users = this.getUsers();
    users = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return updatedUser;
  },

  // DEPARTMENTS
  getDepartments() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
  },

  saveDepartment(dept) {
    const depts = this.getDepartments();
    depts.push(dept);
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
    return dept;
  },

  updateDepartment(updatedDept) {
    let depts = this.getDepartments();
    depts = depts.map(d => d.id === updatedDept.id ? { ...d, ...updatedDept } : d);
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
    return updatedDept;
  },

  // CLEARANCE REQUESTS
  getClearanceRequests() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
  },

  getClearanceRequestByStudentId(studentId) {
    const requests = this.getClearanceRequests();
    return requests.find(r => r.studentId === studentId);
  },

  createClearanceRequest(student, initialDeptMap) {
    const requests = this.getClearanceRequests();
    const newRequest = {
      id: `clr-req-${Date.now()}`,
      studentId: student.id,
      matricNo: student.matricNo,
      studentName: student.fullName,
      departmentName: student.departmentName || 'Computer Science',
      faculty: student.faculty || 'Science',
      session: '2025/2026',
      submittedAt: new Date().toISOString(),
      overallStatus: 'IN_PROGRESS',
      completionPercentage: 0,
      certificateNumber: null,
      documents: [],
      departments: initialDeptMap
    };
    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    this.addAuditLog(
      student.id,
      'STUDENT',
      student.fullName,
      'CLEARANCE_SUBMITTED',
      `Clearance application initiated by ${student.matricNo}`
    );

    return newRequest;
  },

  // DOCUMENT UPLOADS
  uploadStudentDocument(requestId, docType, docName, docDataUrl, fileSize) {
    const requests = this.getClearanceRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return null;

    const request = requests[reqIndex];
    if (!request.documents) request.documents = [];

    // Check if document of this type already exists, replace or append
    const existingIdx = request.documents.findIndex(d => d.type === docType);
    const newDoc = {
      id: `doc-${Date.now()}`,
      type: docType,
      name: docName,
      size: fileSize || '245 KB',
      uploadedAt: new Date().toISOString(),
      dataUrl: docDataUrl || null
    };

    if (existingIdx >= 0) {
      request.documents[existingIdx] = newDoc;
    } else {
      request.documents.push(newDoc);
    }

    requests[reqIndex] = request;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    this.addAuditLog(
      request.studentId,
      'STUDENT',
      request.studentName,
      'DOCUMENT_UPLOADED',
      `Uploaded verification document: ${docType} (${docName})`
    );

    return request;
  },

  deleteStudentDocument(requestId, docId) {
    const requests = this.getClearanceRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return null;

    const request = requests[reqIndex];
    if (request.documents) {
      request.documents = request.documents.filter(d => d.id !== docId);
    }

    requests[reqIndex] = request;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return request;
  },

  updateDepartmentClearanceStatus(requestId, deptCode, newStatus, officerName, comments) {
    const requests = this.getClearanceRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return null;

    const request = requests[reqIndex];
    if (request.departments && request.departments[deptCode]) {
      request.departments[deptCode] = {
        status: newStatus,
        date: new Date().toISOString(),
        officer: officerName,
        comments: comments || ''
      };
    }

    const deptCodes = Object.keys(request.departments || {});
    const approvedCount = deptCodes.filter(c => request.departments[c].status === 'APPROVED').length;
    const hasRejection = deptCodes.some(c => request.departments[c].status === 'REJECTED');
    
    request.completionPercentage = deptCodes.length > 0 ? Math.round((approvedCount / deptCodes.length) * 100) : 0;
    
    if (deptCodes.length > 0 && approvedCount === deptCodes.length) {
      request.overallStatus = 'APPROVED';
      if (!request.certificateNumber) {
        request.certificateNumber = `EKSU/${new Date().getFullYear()}/CLR/${request.matricNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`;
      }
    } else if (hasRejection) {
      request.overallStatus = 'ACTION_REQUIRED';
    } else {
      request.overallStatus = 'IN_PROGRESS';
    }

    requests[reqIndex] = request;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    this.addAuditLog(
      requestId,
      'OFFICER',
      officerName,
      `STATUS_${newStatus}`,
      `Department ${deptCode} marked status as ${newStatus} for ${request.studentName}`
    );

    return request;
  },

  // AUDIT LOGS
  getAuditLogs() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  },

  addAuditLog(userId, userRole, userName, action, description) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      userName,
      action,
      description
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  },

  // NOTIFICATIONS
  getNotifications() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  },

  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // SETTINGS
  getSettings() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(INITIAL_SYSTEM_SETTINGS));
  },

  saveSettings(newSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  },

  // DEPARTMENT STATS
  getDeptStats() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPT_STATS) || '[]');
  },

  // SESSION
  getCurrentUser() {
    const sessionStr = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (sessionStr) return JSON.parse(sessionStr);
    return INITIAL_USERS[0];
  },

  setCurrentUser(user) {
    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }
};
