const express = require('express');
const Clearance = require('../models/Clearance');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { requireAuth, requireRoles } = require('../middleware/auth');

const router = express.Router();

const requiredDocumentDepartments = {
  'Bursary School Fees & Convocation Receipt': 'BURSARY',
  'Library Card & Book Return Slip': 'LIBRARY',
  'Departmental Project Approval Sheet': 'DEPARTMENT',
  'Faculty Clearance & Statement of Results': 'FACULTY',
  'Student Affairs Clearance Slip & ID Card': 'STUDENT_AFFAIRS'
};
const requiredDepartmentCodes = ['DEPARTMENT', 'FACULTY', 'LIBRARY', 'BURSARY', 'STUDENT_AFFAIRS', 'REGISTRY'];

const isCertificateReady = (item) => {
  const documents = item.documents || [];
  const requiredTypesPresent = Object.keys(requiredDocumentDepartments).every((type) =>
    documents.some((doc) => doc.type === type)
  );
  const allDocumentsApproved = documents.length > 0 && documents.every((doc) =>
    doc.status === 'APPROVED' &&
    doc.adminApprovedAt && doc.adminApprovedBy &&
    doc.officerApprovedAt && doc.officerApprovedBy &&
    doc.adminApprovedBy.toString() !== doc.officerApprovedBy.toString()
  );
  const departmentEntries = Array.from(item.departments || []);
  const departments = new Map(departmentEntries);
  const allRequiredDepartmentsApproved = requiredDepartmentCodes.every((code) =>
    departments.get(code)?.status === 'APPROVED'
  );
  return item.overallStatus === 'APPROVED' && requiredTypesPresent && allDocumentsApproved &&
    allRequiredDepartmentsApproved && departmentEntries.every(([, department]) => department.status === 'APPROVED');
};

const recalculateClearance = (item) => {
  const departmentEntries = Array.from(item.departments.values());
  const departmentsApproved = departmentEntries.filter((entry) => entry.status === 'APPROVED').length;
  const requiredTypes = Object.keys(requiredDocumentDepartments);
  const allRequiredDocumentsPresent = requiredTypes.every((type) => item.documents.some((doc) => doc.type === type));
  const allDocumentsApproved = allRequiredDocumentsPresent && item.documents.every((doc) =>
    doc.status === 'APPROVED' && Boolean(doc.adminApprovedAt) && Boolean(doc.officerApprovedAt)
  );
  const approvedTasks = departmentsApproved + item.documents.filter((doc) => doc.status === 'APPROVED').length;
  const totalTasks = departmentEntries.length + requiredTypes.length;

  item.completionPercentage = totalTasks ? Math.round((approvedTasks / totalTasks) * 100) : 0;
  if (departmentEntries.some((entry) => entry.status === 'REJECTED') || item.documents.some((doc) => doc.status === 'REJECTED')) {
    item.overallStatus = 'ACTION_REQUIRED';
    item.certificateNumber = undefined;
  } else if (departmentEntries.length > 0 && departmentsApproved === departmentEntries.length && allDocumentsApproved) {
    item.overallStatus = 'APPROVED';
    item.certificateNumber = item.certificateNumber || `EKSU/${new Date().getFullYear()}/CLR/${item.matricNo.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`;
  } else {
    item.overallStatus = 'IN_PROGRESS';
    item.certificateNumber = undefined;
  }
};

const defaultDepartments = {
  DEPARTMENT: { status: 'PENDING', officer: 'Dr. T. Ogunleye', comments: '' },
  FACULTY: { status: 'PENDING', officer: 'Mrs. R. Akande', comments: '' },
  LIBRARY: { status: 'PENDING', officer: 'Mrs. Funmi Adeyemi', comments: '' },
  BURSARY: { status: 'PENDING', officer: 'Development Bursary Officer', comments: '' },
  STUDENT_AFFAIRS: { status: 'PENDING', officer: 'Mrs. A. Faleye', comments: '' },
  REGISTRY: { status: 'PENDING', officer: 'Mr. P. Adebayo', comments: '' }
};

const serializeClearance = (clearance) => {
  const value = clearance.toObject ? clearance.toObject() : clearance;
  return {
    ...value,
    id: value._id?.toString() || value.id,
    documents: (value.documents || []).map((document) => ({ ...document, id: document._id?.toString() || document.id })),
    departments: Object.fromEntries(value.departments || [])
  };
};

const visibleClearances = (user) => user.role === 'STUDENT' ? Clearance.find({ student: user._id }) : Clearance.find();

router.get('/departments', requireAuth, async (req, res, next) => {
  try { return res.json({ departments: await Department.find().lean() }); } catch (error) { return next(error); }
});

router.get('/requests', requireAuth, async (req, res, next) => {
  try { return res.json({ requests: (await visibleClearances(req.user)).map(serializeClearance) }); } catch (error) { return next(error); }
});

router.get('/requests/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Clearance.findById(req.params.id);
    if (!item || (req.user.role === 'STUDENT' && item.student.toString() !== req.user._id.toString())) return res.status(404).json({ message: 'Clearance request not found.' });
    return res.json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.get('/requests/:id/certificate', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ _id: req.params.id, student: req.user._id });
    if (!item) return res.status(404).json({ message: 'Clearance request not found.' });
    if (!isCertificateReady(item)) {
      return res.status(409).json({ message: 'The final certificate is locked until every required document is approved by both the administrator and its assigned officer, and all clearance units are approved.' });
    }
    return res.json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.post('/requests', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    let item = await Clearance.findOne({ student: req.user._id });
    if (item) return res.json({ request: serializeClearance(item) });
    item = await Clearance.create({
      student: req.user._id, studentId: req.user._id.toString(), matricNo: req.user.matricNo, studentName: req.user.fullName,
      departmentName: req.user.departmentName, faculty: req.user.faculty, submittedAt: new Date(), departments: defaultDepartments
    });
    await AuditLog.create({ userId: req.user._id.toString(), userRole: req.user.role, userName: req.user.fullName, action: 'CLEARANCE_SUBMITTED', description: `Submitted clearance application ${item._id}.` });
    return res.status(201).json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.post('/requests/:id/documents', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ _id: req.params.id, student: req.user._id });
    if (!item) return res.status(404).json({ message: 'Clearance request not found.' });
    const { docType, docName, docDataUrl, fileSize, mimeType } = req.body || {};
    if (!docType || !docName) return res.status(400).json({ message: 'Document type and file name are required.' });
    if (!requiredDocumentDepartments[docType]) return res.status(400).json({ message: 'Select a valid required clearance document.' });
    const existing = item.documents.find((doc) => doc.type === docType);
    const document = { type: docType, name: docName, size: fileSize || '245 KB', mimeType, data: docDataUrl || null, uploadedAt: new Date(), status: 'PENDING', remarks: '', approvedAt: undefined, rejectedAt: undefined, approvedBy: undefined, adminApprovedAt: undefined, adminApprovedBy: undefined, officerApprovedAt: undefined, officerApprovedBy: undefined, history: [] };
    if (existing) { existing.history.push({ status: existing.status, remarks: existing.remarks, changedAt: new Date() }); Object.assign(existing, document); } else item.documents.push(document);
    recalculateClearance(item);
    await item.save();
    await AuditLog.create({ userId: req.user._id.toString(), userRole: req.user.role, userName: req.user.fullName, action: 'DOCUMENT_UPLOADED', description: `Uploaded verification document: ${docType}` });
    return res.json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.delete('/requests/:id/documents/:documentId', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ _id: req.params.id, student: req.user._id });
    if (!item) return res.status(404).json({ message: 'Clearance request not found.' });
    item.documents = item.documents.filter((doc) => doc._id.toString() !== req.params.documentId);
    recalculateClearance(item);
    await item.save();
    return res.json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.patch('/requests/:id/status', requireAuth, requireRoles('OFFICER', 'ADMIN'), async (req, res, next) => {
  try {
    const item = await Clearance.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Clearance request not found.' });
    const code = req.body.deptCode || req.user.departmentCode;
    if (req.user.role === 'OFFICER' && code !== req.user.departmentCode) return res.status(403).json({ message: 'Officer is not assigned to this clearance unit.' });
    if (!item.departments.has(code)) return res.status(400).json({ message: 'Unknown clearance unit.' });
    const status = req.body.status;
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) return res.status(400).json({ message: 'Invalid clearance status.' });
    item.departments.set(code, { status, date: new Date(), officer: req.user.fullName, comments: req.body.comments || '' });
    recalculateClearance(item);
    await item.save();
    await AuditLog.create({ userId: req.user._id.toString(), userRole: req.user.role, userName: req.user.fullName, action: `STATUS_${status}`, description: `Department ${code} marked status as ${status}.` });
    return res.json({ request: serializeClearance(item) });
  } catch (error) { return next(error); }
});

router.post('/requests/:id/automated-verify', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ _id: req.params.id, student: req.user._id });
    if (!item) return res.status(404).json({ message: 'Clearance request not found.' });
    if (item.documents.some((doc) => doc.status !== 'APPROVED')) return res.status(409).json({ message: 'All uploaded documents must be approved before clearance can proceed.' });
    return res.status(409).json({ message: 'Automated verification is controlled by clearance officers and cannot approve records directly.' });
  } catch (error) { return next(error); }
});

router.get('/documents/my', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try { const items = await Clearance.findOne({ student: req.user._id }); return res.json({ documents: items?.documents || [] }); } catch (error) { return next(error); }
});
router.get('/admin/documents', requireAuth, requireRoles('ADMIN'), async (req, res, next) => {
  try { const items = await Clearance.find().populate('student', 'fullName matricNo email'); return res.json({ documents: items.flatMap((item) => item.documents.map((doc) => ({ ...doc.toObject(), clearanceId: item._id, student: item.student }))) }); } catch (error) { return next(error); }
});

const updateDocument = (status, reviewerRole) => async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ 'documents._id': req.params.documentId });
    if (!item) return res.status(404).json({ message: 'Document not found.' });
    const doc = item.documents.id(req.params.documentId);
    const assignedDepartment = requiredDocumentDepartments[doc.type];
    if (!assignedDepartment) return res.status(400).json({ message: 'This document is not assigned to a clearance unit.' });
    if (reviewerRole === 'OFFICER' && req.user.departmentCode !== assignedDepartment) return res.status(403).json({ message: 'You can only review documents assigned to your clearance unit.' });
    if (status === 'APPROVED' && doc.status === 'REJECTED') return res.status(409).json({ message: 'The student must resubmit this rejected document before it can be approved.' });
    if (status === 'APPROVED' && reviewerRole === 'ADMIN' && doc.adminApprovedAt) return res.status(409).json({ message: 'An administrator has already approved this document.' });
    if (status === 'APPROVED' && reviewerRole === 'OFFICER' && doc.officerApprovedAt) return res.status(409).json({ message: 'The assigned officer has already approved this document.' });
    doc.remarks = req.body?.remarks || '';
    if (status === 'REJECTED') {
      doc.status = 'REJECTED';
      doc.rejectedAt = new Date();
      doc.approvedAt = undefined;
      doc.approvedBy = undefined;
      doc.adminApprovedAt = undefined;
      doc.adminApprovedBy = undefined;
      doc.officerApprovedAt = undefined;
      doc.officerApprovedBy = undefined;
    } else {
      if (reviewerRole === 'ADMIN') {
        doc.adminApprovedAt = new Date();
        doc.adminApprovedBy = req.user._id;
      } else {
        doc.officerApprovedAt = new Date();
        doc.officerApprovedBy = req.user._id;
      }
      const bothApproved = Boolean(doc.adminApprovedAt && doc.officerApprovedAt);
      doc.status = bothApproved ? 'APPROVED' : 'PENDING';
      doc.approvedAt = bothApproved ? new Date() : undefined;
      doc.approvedBy = bothApproved ? req.user._id : undefined;
      doc.rejectedAt = undefined;
    }
    doc.history.push({ status, remarks: doc.remarks, changedAt: new Date(), changedBy: req.user._id });
    recalculateClearance(item);
    await item.save();
    await Notification.create({ title: `Clearance document ${status.toLowerCase()}`, text: `${doc.type}: ${doc.remarks || status}`, recipientStudentId: item.student, recipientRole: 'STUDENT', type: status.toLowerCase(), icon: status === 'APPROVED' ? '✓' : '!' });
    await AuditLog.create({ userId: req.user._id.toString(), userRole: req.user.role, userName: req.user.fullName, action: `DOCUMENT_${status}`, description: `${status} document ${doc.name}.` });
    return res.json({ document: doc, request: serializeClearance(item) });
  } catch (error) { return next(error); }
};
router.put('/admin/documents/:documentId/approve', requireAuth, requireRoles('ADMIN'), updateDocument('APPROVED', 'ADMIN'));
router.put('/admin/documents/:documentId/reject', requireAuth, requireRoles('ADMIN'), updateDocument('REJECTED', 'ADMIN'));
router.put('/officer/documents/:documentId/approve', requireAuth, requireRoles('OFFICER'), updateDocument('APPROVED', 'OFFICER'));
router.put('/officer/documents/:documentId/reject', requireAuth, requireRoles('OFFICER'), updateDocument('REJECTED', 'OFFICER'));
router.put('/documents/:documentId/resubmit', requireAuth, requireRoles('STUDENT'), async (req, res, next) => {
  try {
    const item = await Clearance.findOne({ student: req.user._id, 'documents._id': req.params.documentId });
    if (!item) return res.status(404).json({ message: 'Document not found.' });
    const doc = item.documents.id(req.params.documentId); Object.assign(doc, { name: req.body.docName || doc.name, size: req.body.fileSize || doc.size, data: req.body.docDataUrl || doc.data, uploadedAt: new Date(), status: 'PENDING', remarks: '', approvedAt: undefined, rejectedAt: undefined, approvedBy: undefined, adminApprovedAt: undefined, adminApprovedBy: undefined, officerApprovedAt: undefined, officerApprovedBy: undefined }); recalculateClearance(item); await item.save(); return res.json({ request: serializeClearance(item), document: doc });
  } catch (error) { return next(error); }
});

module.exports = router;
