const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  description: String,
  officerName: String,
  email: String,
  pendingCount: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  icon: String
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
