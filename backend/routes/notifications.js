const express = require('express');
const Notification = require('../models/Notification');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'STUDENT' ? { $or: [{ recipientStudentId: req.user._id }, { recipientRole: 'STUDENT' }] } : {};
    return res.json({ notifications: await Notification.find(filter).sort({ timestamp: -1 }).lean() });
  } catch (error) { return next(error); }
});
router.post('/read-all', requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'STUDENT' ? { $or: [{ recipientStudentId: req.user._id }, { recipientRole: 'STUDENT' }] } : {};
    await Notification.updateMany(filter, { $set: { read: true } });
    return res.json({ notifications: await Notification.find(filter).sort({ timestamp: -1 }).lean() });
  } catch (error) { return next(error); }
});
module.exports = router;
