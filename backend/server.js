const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const complaintRoutes = require('./src/routes/complaintRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const workerRoutes = require('./src/routes/workerRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const metaRoutes = require('./src/routes/metaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for photo uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/meta', metaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SMART VILLAGE Management System API',
    version: '1.0.0',
    environment: process.env.VERCEL ? 'Vercel Serverless' : 'Node Server',
    timestamp: new Date().toISOString()
  });
});

// Auto-initialize Database on module import
initDatabase().catch(err => console.error("Database init error:", err));

// Listen only if not running on Vercel Serverless
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`SMART VILLAGE Backend API Server running on port ${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
