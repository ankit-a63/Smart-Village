const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public tracking
router.get('/track/:id', complaintController.getComplaintByTrackingId);
router.get('/all-public', complaintController.getAllComplaints);

// Citizen routes
router.post('/submit', authenticateToken, upload.single('photo'), complaintController.createComplaint);
router.get('/my-complaints', authenticateToken, complaintController.getMyComplaints);

// Admin / Worker management routes
router.get('/admin/all', authenticateToken, requireRole('admin', 'worker'), complaintController.getAllComplaints);
router.put('/admin/update/:id', authenticateToken, requireRole('admin', 'worker'), upload.single('resolution_photo'), complaintController.updateComplaintStatus);

module.exports = router;
