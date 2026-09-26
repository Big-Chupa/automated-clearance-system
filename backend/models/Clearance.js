const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  size: String,
  mimeType: String,
  data: String,
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  remarks: { type: String, default: '' },
  approvedAt: Date,
  rejectedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminApprovedAt: Date,
  adminApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  officerApprovedAt: Date,
  officerApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [{ status: String, remarks: String, changedAt: Date, changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
}, { _id: true });

const departmentStatusSchema = new mongoose.Schema({
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  date: Date,
  officer: String,
  comments: { type: String, default: '' }
}, { _id: false });

const clearanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  studentId: String,
  matricNo: String,
  studentName: String,
  departmentName: String,
  faculty: String,
  session: { type: String, default: '2025/2026' },
  submittedAt: Date,
  overallStatus: { type: String, enum: ['IN_PROGRESS', 'APPROVED', 'ACTION_REQUIRED'], default: 'IN_PROGRESS' },
  completionPercentage: { type: Number, default: 0 },
  certificateNumber: String,
  documents: [documentSchema],
  departments: { type: Map, of: departmentStatusSchema }
}, { timestamps: true });

module.exports = mongoose.model('Clearance', clearanceSchema);
