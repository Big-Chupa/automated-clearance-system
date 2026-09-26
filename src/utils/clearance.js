export const REQUIRED_DOCUMENT_TYPES = [
  'Bursary School Fees & Convocation Receipt',
  'Library Card & Book Return Slip',
  'Departmental Project Approval Sheet',
  'Faculty Clearance & Statement of Results',
  'Student Affairs Clearance Slip & ID Card'
];
export const REQUIRED_DEPARTMENT_CODES = ['DEPARTMENT', 'FACULTY', 'LIBRARY', 'BURSARY', 'STUDENT_AFFAIRS', 'REGISTRY'];

export const isCertificateReady = (request) => {
  if (!request || request.overallStatus !== 'APPROVED') return false;

  const documents = request.documents || [];
  const allRequiredDocumentsApproved = REQUIRED_DOCUMENT_TYPES.every((type) => {
    const document = documents.find((entry) => entry.type === type);
    return document?.status === 'APPROVED' && Boolean(document.adminApprovedAt) && Boolean(document.officerApprovedAt) &&
      Boolean(document.adminApprovedBy) && Boolean(document.officerApprovedBy) &&
      String(document.adminApprovedBy) !== String(document.officerApprovedBy);
  });
  const allUploadedDocumentsApproved = documents.every((document) =>
    document.status === 'APPROVED' && Boolean(document.adminApprovedAt) && Boolean(document.officerApprovedAt) &&
    Boolean(document.adminApprovedBy) && Boolean(document.officerApprovedBy) &&
    String(document.adminApprovedBy) !== String(document.officerApprovedBy)
  );
  const departmentStatuses = Object.values(request.departments || {});
  const allRequiredDepartmentsApproved = REQUIRED_DEPARTMENT_CODES.every((code) => request.departments?.[code]?.status === 'APPROVED');

  return allRequiredDocumentsApproved && allUploadedDocumentsApproved && allRequiredDepartmentsApproved && departmentStatuses.length > 0 &&
    departmentStatuses.every((department) => department.status === 'APPROVED');
};