const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/public', resourceController.getAllResources);
router.get('/types', resourceController.getResourceTypes);
router.get('/detail/:id', resourceController.getResourceById);

// Admin CRUD
router.post('/admin/create', authenticateToken, requireRole('admin'), upload.single('photo'), resourceController.createResource);
router.put('/admin/update/:id', authenticateToken, requireRole('admin', 'worker'), upload.single('photo'), resourceController.updateResource);
router.delete('/admin/delete/:id', authenticateToken, requireRole('admin'), resourceController.deleteResource);

module.exports = router;
