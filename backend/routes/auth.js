const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { requireAuth } = require('../middleware/auth');
const { createToken, publicUser } = require('../utils/auth');

const router = express.Router();

const findByIdentifier = (identifier) => {
  const clean = String(identifier || '').trim().toLowerCase();
  return User.findOne({ $or: [{ email: clean }, { matricNo: clean.toUpperCase() }] }).select('+password');
};

const login = async (req, res, next) => {
  try {
    const { identifier, password, role } = req.body || {};
    const user = await findByIdentifier(identifier);
    if (!user || user.role !== role || !(await user.comparePassword(password || ''))) {
      return res.status(401).json({ message: 'Invalid identifier, password, or role.' });
    }

    await AuditLog.create({ userId: user._id.toString(), userRole: user.role, userName: user.fullName, action: 'LOGIN', description: `${user.fullName} authenticated into the portal.` });
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

router.post('/login', login);
router.post('/student/login', (req, res, next) => { req.body.role = 'STUDENT'; return login(req, res, next); });
router.post('/admin/login', (req, res, next) => { req.body.role = 'ADMIN'; return login(req, res, next); });
router.post('/department/login', (req, res, next) => { req.body.role = 'OFFICER'; return login(req, res, next); });

router.post('/register', async (req, res, next) => {
  try {
    const { matricNo, fullName, email, password, phone, departmentName, faculty, degree, graduationYear } = req.body || {};
    if (!matricNo || !fullName || !email || !password) return res.status(400).json({ message: 'Matric number, name, email, and password are required.' });
    if (!/^\d{9}$/.test(String(matricNo).trim())) return res.status(400).json({ message: 'Matriculation number must contain exactly 9 digits (e.g. 220903045).' });
    if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const normalizedMatricNo = String(matricNo).trim();
    const existing = await User.findOne({ $or: [{ email: String(email).trim().toLowerCase() }, { matricNo: normalizedMatricNo }] });
    if (existing) return res.status(409).json({ message: 'A student with this Matriculation Number or Email is already registered.' });

    const user = await User.create({ matricNo: normalizedMatricNo, fullName, email, password, phone, departmentName, faculty, degree, graduationYear, role: 'STUDENT', status: 'ACTIVE' });
    await AuditLog.create({ userId: user._id.toString(), userRole: user.role, userName: user.fullName, action: 'USER_REGISTERED', description: `New account: ${user.matricNo}` });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with those details already exists.' });
    return next(error);
  }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

router.post('/reset-password', async (req, res, next) => {
  try {
    const user = await findByIdentifier(req.body?.identifier);
    if (!user) return res.status(404).json({ message: 'No user account found matching provided details.' });
    user.password = req.body.newPassword;
    await user.save();
    return res.json({ message: 'Password successfully reset.' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
