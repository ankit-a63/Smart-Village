const { query, queryOne } = require('../config/db');

// Create New Complaint
exports.createComplaint = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const { category_id, area_id, title, description, location_address, latitude, longitude, priority = 'medium' } = req.body;

    if (!category_id || !area_id || !title || !description) {
      return res.status(400).json({
        success: false,
        message_en: 'Category, area, title, and description are required',
        message_hi: 'श्रेणी, क्षेत्र, शीर्षक और विवरण आवश्यक हैं'
      });
    }

    // Generate Unique Tracking ID
    const countRes = await queryOne('SELECT COUNT(*) as count FROM complaints');
    const nextNum = (countRes ? countRes.count : 0) + 1;
    const tracking_id = `SVMS-2026-${String(nextNum).padStart(5, '0')}`;

    // Get Department for Category
    const category = await queryOne('SELECT department_id FROM complaint_categories WHERE id = ?', [category_id]);
    const assigned_department_id = category ? category.department_id : null;

    let photo_url = null;
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }

    const result = await query(
      `INSERT INTO complaints (
        tracking_id, citizen_id, category_id, area_id, title, description,
        location_address, latitude, longitude, photo_url, priority, status, assigned_department_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?)`,
      [
        tracking_id, citizen_id, category_id, area_id, title, description,
        location_address || '', latitude || null, longitude || null, photo_url, priority, assigned_department_id
      ]
    );

    const complaintId = result.insertId;

    // Log History
    await query(
      `INSERT INTO complaint_status_history (complaint_id, status, changed_by_user_id, remarks) VALUES (?, ?, ?, ?)`,
      [complaintId, 'submitted', citizen_id, 'Complaint submitted by citizen.']
    );

    // Create Notification for Admins
    const admins = await query("SELECT id FROM users WHERE role = 'admin'");
    for (const admin of admins) {
      await query(
        `INSERT INTO notifications (user_id, title_en, title_hi, message_en, message_hi, type, related_complaint_id)
         VALUES (?, 'New Complaint Submitted', 'नई शिकायत दर्ज की गई', ?, ?, 'info', ?)`,
        [admin.id, `New complaint ${tracking_id}: ${title}`, `नई शिकायत ${tracking_id}: ${title}`, complaintId]
      );
    }

    // Create Notification for Citizen
    await query(
      `INSERT INTO notifications (user_id, title_en, title_hi, message_en, message_hi, type, related_complaint_id)
       VALUES (?, 'Complaint Received', 'शिकायत प्राप्त हुई', ?, ?, 'success', ?)`,
      [citizen_id, `Your complaint ${tracking_id} has been registered successfully.`, `आपकी शिकायत ${tracking_id} सफलतापूर्वक दर्ज की गई है।`, complaintId]
    );

    res.status(201).json({
      success: true,
      message_en: 'Complaint submitted successfully!',
      message_hi: 'शिकायत सफलतापूर्वक दर्ज की गई!',
      tracking_id,
      complaint_id: complaintId
    });
  } catch (err) {
    console.error('Create Complaint Error:', err);
    res.status(500).json({ success: false, message_en: 'Failed to submit complaint', message_hi: 'शिकायत दर्ज करने में विफल' });
  }
};

// Get All Complaints (Filterable)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category_id, area_id, department_id, priority, search, worker_id } = req.query;

    let sql = `
      SELECT c.*,
             u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             cc.name_en as category_name_en, cc.name_hi as category_name_hi, cc.icon as category_icon,
             a.name_en as area_name_en, a.name_hi as area_name_hi,
             d.name_en as department_name_en, d.name_hi as department_name_hi,
             w.name as worker_name, w.phone as worker_phone
      FROM complaints c
      LEFT JOIN users u ON c.citizen_id = u.id
      LEFT JOIN complaint_categories cc ON c.category_id = cc.id
      LEFT JOIN areas a ON c.area_id = a.id
      LEFT JOIN departments d ON c.assigned_department_id = d.id
      LEFT JOIN users w ON c.assigned_worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }
    if (category_id) {
      sql += ` AND c.category_id = ?`;
      params.push(category_id);
    }
    if (area_id) {
      sql += ` AND c.area_id = ?`;
      params.push(area_id);
    }
    if (department_id) {
      sql += ` AND c.assigned_department_id = ?`;
      params.push(department_id);
    }
    if (priority) {
      sql += ` AND c.priority = ?`;
      params.push(priority);
    }
    if (worker_id) {
      sql += ` AND c.assigned_worker_id = ?`;
      params.push(worker_id);
    }
    if (search) {
      sql += ` AND (c.title LIKE ? OR c.tracking_id LIKE ? OR c.description LIKE ? OR c.location_address LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY c.created_at DESC`;

    const complaints = await query(sql, params);
    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    console.error('Get Complaints Error:', err);
    res.status(500).json({ success: false, message_en: 'Failed to fetch complaints', message_hi: 'शिकायतें प्राप्त करने में विफल' });
  }
};

// Get Citizen Own Complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const citizen_id = req.user.id;
    const complaints = await query(
      `SELECT c.*,
              cc.name_en as category_name_en, cc.name_hi as category_name_hi, cc.icon as category_icon,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              d.name_en as department_name_en, d.name_hi as department_name_hi,
              w.name as worker_name, w.phone as worker_phone
       FROM complaints c
       LEFT JOIN complaint_categories cc ON c.category_id = cc.id
       LEFT JOIN areas a ON c.area_id = a.id
       LEFT JOIN departments d ON c.assigned_department_id = d.id
       LEFT JOIN users w ON c.assigned_worker_id = w.id
       WHERE c.citizen_id = ?
       ORDER BY c.created_at DESC`,
      [citizen_id]
    );

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching complaints', message_hi: 'शिकायतें प्राप्त करने में त्रुटि' });
  }
};

// Get Complaint By Tracking ID or Numeric ID
exports.getComplaintByTrackingId = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await queryOne(
      `SELECT c.*,
              u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
              cc.name_en as category_name_en, cc.name_hi as category_name_hi, cc.icon as category_icon,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              d.name_en as department_name_en, d.name_hi as department_name_hi,
              w.name as worker_name, w.phone as worker_phone
       FROM complaints c
       LEFT JOIN users u ON c.citizen_id = u.id
       LEFT JOIN complaint_categories cc ON c.category_id = cc.id
       LEFT JOIN areas a ON c.area_id = a.id
       LEFT JOIN departments d ON c.assigned_department_id = d.id
       LEFT JOIN users w ON c.assigned_worker_id = w.id
       WHERE c.tracking_id = ? OR c.id = ?`,
      [id, id]
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message_en: 'Complaint not found', message_hi: 'शिकायत नहीं मिली' });
    }

    const history = await query(
      `SELECT h.*, u.name as user_name
       FROM complaint_status_history h
       LEFT JOIN users u ON h.changed_by_user_id = u.id
       WHERE h.complaint_id = ?
       ORDER BY h.created_at ASC`,
      [complaint.id]
    );

    res.json({ success: true, complaint, history });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching complaint details', message_hi: 'शिकायत विवरण प्राप्त करने में त्रुटि' });
  }
};

// Update Complaint Status & Assignment (Admin / Worker)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_department_id, assigned_worker_id, admin_remarks, worker_notes } = req.body;

    const complaint = await queryOne('SELECT * FROM complaints WHERE id = ?', [id]);
    if (!complaint) {
      return res.status(404).json({ success: false, message_en: 'Complaint not found', message_hi: 'शिकायत नहीं मिली' });
    }

    let resolution_photo_url = complaint.resolution_photo_url;
    if (req.file) {
      resolution_photo_url = `/uploads/${req.file.filename}`;
    }

    const newStatus = status || complaint.status;
    const newPriority = priority || complaint.priority;
    const newDept = assigned_department_id !== undefined ? assigned_department_id : complaint.assigned_department_id;
    const newWorker = assigned_worker_id !== undefined ? assigned_worker_id : complaint.assigned_worker_id;
    const newAdminRemarks = admin_remarks !== undefined ? admin_remarks : complaint.admin_remarks;
    const newWorkerNotes = worker_notes !== undefined ? worker_notes : complaint.worker_notes;
    const resolvedAt = (newStatus === 'resolved' || newStatus === 'closed') ? new Date().toISOString() : complaint.resolved_at;

    await query(
      `UPDATE complaints
       SET status = ?, priority = ?, assigned_department_id = ?, assigned_worker_id = ?,
           admin_remarks = ?, worker_notes = ?, resolution_photo_url = ?, resolved_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newStatus, newPriority, newDept, newWorker, newAdminRemarks, newWorkerNotes, resolution_photo_url, resolvedAt, id]
    );

    // Log History Entry if status changed or remarks provided
    await query(
      `INSERT INTO complaint_status_history (complaint_id, status, changed_by_user_id, remarks) VALUES (?, ?, ?, ?)`,
      [id, newStatus, req.user.id, admin_remarks || worker_notes || `Status updated to ${newStatus}`]
    );

    // Notify Citizen
    await query(
      `INSERT INTO notifications (user_id, title_en, title_hi, message_en, message_hi, type, related_complaint_id)
       VALUES (?, 'Complaint Status Updated', 'शिकायत की स्थिति अपडेट की गई', ?, ?, 'info', ?)`,
      [
        complaint.citizen_id,
        `Your complaint ${complaint.tracking_id} status is now: ${newStatus.replace('_', ' ').toUpperCase()}`,
        `आपकी शिकायत ${complaint.tracking_id} की स्थिति अब है: ${newStatus}`,
        id
      ]
    );

    // Notify Worker if assigned
    if (newWorker && newWorker !== complaint.assigned_worker_id) {
      await query(
        `INSERT INTO notifications (user_id, title_en, title_hi, message_en, message_hi, type, related_complaint_id)
         VALUES (?, 'New Task Assigned', 'नया कार्य सौंपा गया', ?, ?, 'warning', ?)`,
        [newWorker, `You have been assigned to complaint ${complaint.tracking_id}`, `आपको शिकायत ${complaint.tracking_id} सौंपी गई है`, id]
      );
    }

    res.json({
      success: true,
      message_en: 'Complaint updated successfully',
      message_hi: 'शिकायत सफलतापूर्वक अपडेट की गई'
    });
  } catch (err) {
    console.error('Update Complaint Error:', err);
    res.status(500).json({ success: false, message_en: 'Failed to update complaint', message_hi: 'शिकायत अपडेट करने में विफल' });
  }
};
