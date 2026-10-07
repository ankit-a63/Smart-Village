const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

router.get('/areas', async (req, res) => {
  try {
    const areas = await query('SELECT * FROM areas ORDER BY id ASC');
    res.json({ success: true, areas });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching areas' });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const departments = await query('SELECT * FROM departments ORDER BY id ASC');
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching departments' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM complaint_categories ORDER BY id ASC');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

module.exports = router;
