const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/assigned', authenticateToken, requireRole('worker'), workerController.getAssignedTasks);
router.get('/list', authenticateToken, requireRole('admin'), workerController.getAllWorkers);

module.exports = router;
