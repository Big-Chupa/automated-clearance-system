const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'eksu_acs_jwt';

const request = async (path, options = {}) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'The server request failed.');
  return body;
};

const setSession = (token) => sessionStorage.setItem(TOKEN_KEY, token);

export const apiService = {
  async login(identifier, password, role) {
    const result = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password, role }) });
    setSession(result.token);
    return result.user;
  },
  async register(studentData) {
    const result = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(studentData) });
    setSession(result.token);
    return result.user;
  },
  async resetPassword(identifier, newPassword) {
    return request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ identifier, newPassword }) });
  },
  async getCurrentUser() {
    if (!sessionStorage.getItem(TOKEN_KEY)) return null;
    try { return (await request('/api/auth/me')).user; } catch (error) { sessionStorage.removeItem(TOKEN_KEY); return null; }
  },
  logout() { sessionStorage.removeItem(TOKEN_KEY); },
  async getDepartments() { return (await request('/api/clearance/departments')).departments; },
  async updateDepartment(id, department) { return (await request(`/api/departments/${id}`, { method: 'PUT', body: JSON.stringify(department) })).department; },
  async createDepartment(department) { return (await request('/api/departments', { method: 'POST', body: JSON.stringify(department) })).department; },
  async getClearanceRequests() { return (await request('/api/clearance/requests')).requests; },
  async getCertificate(requestId) { return request(`/api/clearance/requests/${requestId}/certificate`); },
  async getAuditLogs() { return (await request('/api/audit-logs')).logs; },
  async createClearanceRequest() { return (await request('/api/clearance/requests', { method: 'POST' })).request; },
  async uploadDocument(requestId, docType, docName, docDataUrl, fileSize, mimeType) { return (await request(`/api/clearance/requests/${requestId}/documents`, { method: 'POST', body: JSON.stringify({ docType, docName, docDataUrl, fileSize, mimeType }) })).request; },
  async deleteDocument(requestId, docId) { return (await request(`/api/clearance/requests/${requestId}/documents/${docId}`, { method: 'DELETE' })).request; },
  async updateDepartmentStatus(requestId, deptCode, status, comments) { return (await request(`/api/clearance/requests/${requestId}/status`, { method: 'PATCH', body: JSON.stringify({ deptCode, status, comments }) })).request; },
  async runAutomatedVerification(requestId) { return (await request(`/api/clearance/requests/${requestId}/automated-verify`, { method: 'POST' })).request; },
  async getNotifications() { return (await request('/api/notifications')).notifications; },
  async markNotificationsRead() { return (await request('/api/notifications/read-all', { method: 'POST' })).notifications; },
  async getStudents() { return (await request('/api/users')).users; },
  async getAdminDocuments() { return (await request('/api/clearance/admin/documents')).documents; },
  async approveDocument(documentId, remarks) { return request(`/api/clearance/admin/documents/${documentId}/approve`, { method: 'PUT', body: JSON.stringify({ remarks }) }); },
  async rejectDocument(documentId, remarks) { return request(`/api/clearance/admin/documents/${documentId}/reject`, { method: 'PUT', body: JSON.stringify({ remarks }) }); },
  async approveDocumentAsOfficer(documentId, remarks) { return request(`/api/clearance/officer/documents/${documentId}/approve`, { method: 'PUT', body: JSON.stringify({ remarks }) }); },
  async rejectDocumentAsOfficer(documentId, remarks) { return request(`/api/clearance/officer/documents/${documentId}/reject`, { method: 'PUT', body: JSON.stringify({ remarks }) }); }
};
