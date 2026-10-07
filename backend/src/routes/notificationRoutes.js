const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, notificationController.getUserNotifications);
router.put('/mark-read/:id', authenticateToken, notificationController.markAsRead);

module.exports = router;
