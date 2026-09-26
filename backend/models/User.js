const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  matricNo: {
    type: String,
    trim: true,
    uppercase: true,
    sparse: true,
    unique: true,
    validate: {
      validator(value) { return this.role !== 'STUDENT' || /^\d{9}$/.test(String(value || '')); },
      message: 'Student matriculation numbers must contain exactly 9 digits (e.g. 220903045).'
    }
  },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['STUDENT', 'ADMIN', 'OFFICER'], required: true },
  departmentName: String,
  departmentCode: String,
  faculty: String,
  graduationYear: String,
  degree: String,
  phone: String,
  initials: String,
  status: { type: String, default: 'ACTIVE' }
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
