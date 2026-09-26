const express = require('express');
const AuditLog = require('../models/AuditLog');
const { requireAuth, requireRoles } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, requireRoles('ADMIN'), async (req, res, next) => {
  try { return res.json({ logs: await AuditLog.find().sort({ timestamp: -1 }).limit(200).lean() }); } catch (error) { return next(error); }
});
module.exports = router;
