require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');
const authRoutes = require('./routes/auth');
const clearanceRoutes = require('./routes/clearance');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const auditRoutes = require('./routes/audit');
const departmentRoutes = require('./routes/departments');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'automated-clearance-api', database: 'mongodb' }));
app.use('/api/auth', authRoutes);
app.use('/api/clearance', clearanceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditRoutes);

app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(error.status || 500).json({ message: error.status ? error.message : 'An unexpected server error occurred.' });
});

const start = async () => {
  await connectDatabase();
  app.listen(port, () => console.log(`Clearance API listening on http://localhost:${port}`));
};

if (require.main === module) {
  start().catch((error) => {
    console.error(`Backend could not start: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { app, start };
