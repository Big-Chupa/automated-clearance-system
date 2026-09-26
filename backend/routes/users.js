const express = require('express');
const User = require('../models/User');
const { requireAuth, requireRoles } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, requireRoles('ADMIN'), async (req, res, next) => {
  try { return res.json({ users: (await User.find({ role: 'STUDENT' })).map((user) => user.toSafeObject()) }); } catch (error) { return next(error); }
});

module.exports = router;
