const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: String,
  userRole: String,
  userName: String,
  action: String,
  description: String
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
