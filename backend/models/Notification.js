const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  type: String,
  icon: String,
  read: { type: Boolean, default: false },
  recipientStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientRole: String
});

module.exports = mongoose.model('Notification', notificationSchema);
