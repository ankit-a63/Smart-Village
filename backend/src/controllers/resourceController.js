const { query, queryOne } = require('../config/db');

exports.getAllResources = async (req, res) => {
  try {
    const { resource_type_id, area_id, condition_status, search } = req.query;

    let sql = `
      SELECT r.*,
             rt.name_en as type_name_en, rt.name_hi as type_name_hi, rt.icon as type_icon,
             a.name_en as area_name_en, a.name_hi as area_name_hi,
             d.name_en as department_name_en, d.name_hi as department_name_hi
      FROM resources r
      LEFT JOIN resource_types rt ON r.resource_type_id = rt.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN departments d ON r.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (resource_type_id) {
      sql += ` AND r.resource_type_id = ?`;
      params.push(resource_type_id);
    }
    if (area_id) {
      sql += ` AND r.area_id = ?`;
      params.push(area_id);
    }
    if (condition_status) {
      sql += ` AND r.condition_status = ?`;
      params.push(condition_status);
    }
    if (search) {
      sql += ` AND (r.name_en LIKE ? OR r.name_hi LIKE ? OR r.resource_code LIKE ? OR r.location_address LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY r.id DESC`;

    const resources = await query(sql, params);
    res.json({ success: true, count: resources.length, resources });
  } catch (err) {
    console.error('Get Resources Error:', err);
    res.status(500).json({ success: false, message_en: 'Failed to fetch public resources', message_hi: 'सार्वजनिक संसाधन प्राप्त करने में विफल' });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await queryOne(
      `SELECT r.*,
              rt.name_en as type_name_en, rt.name_hi as type_name_hi, rt.icon as type_icon,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              d.name_en as department_name_en, d.name_hi as department_name_hi
       FROM resources r
       LEFT JOIN resource_types rt ON r.resource_type_id = rt.id
       LEFT JOIN areas a ON r.area_id = a.id
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.id = ? OR r.resource_code = ?`,
      [id, id]
    );

    if (!resource) {
      return res.status(404).json({ success: false, message_en: 'Resource not found', message_hi: 'संसाधन नहीं मिला' });
    }

    res.json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching resource', message_hi: 'संसाधन प्राप्त करने में त्रुटि' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name_en, name_hi, resource_type_id, area_id, department_id, location_address, latitude, longitude, condition_status = 'active', description } = req.body;

    if (!name_en || !resource_type_id || !area_id) {
      return res.status(400).json({ success: false, message_en: 'Resource name, type, and area are required', message_hi: 'संसाधन का नाम, प्रकार और क्षेत्र आवश्यक हैं' });
    }

    const countRes = await queryOne('SELECT COUNT(*) as count FROM resources');
    const nextNum = (countRes ? countRes.count : 0) + 1;
    const resource_code = `RES-${String(nextNum).padStart(4, '0')}`;

    let photo_url = null;
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }

    const result = await query(
      `INSERT INTO resources (
        resource_code, name_en, name_hi, resource_type_id, area_id, department_id,
        location_address, latitude, longitude, condition_status, photo_url, description, installation_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))`,
      [
        resource_code, name_en, name_hi || name_en, resource_type_id, area_id, department_id || null,
        location_address || '', latitude || null, longitude || null, condition_status, photo_url, description || ''
      ]
    );

    res.status(201).json({
      success: true,
      message_en: 'Public resource added successfully',
      message_hi: 'सार्वजनिक संसाधन सफलतापूर्वक जोड़ा गया',
      resource_id: result.insertId,
      resource_code
    });
  } catch (err) {
    console.error('Create Resource Error:', err);
    res.status(500).json({ success: false, message_en: 'Failed to add resource', message_hi: 'संसाधन जोड़ने में विफल' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_hi, resource_type_id, area_id, department_id, location_address, condition_status, last_maintenance_date, next_maintenance_date, description } = req.body;

    const existing = await queryOne('SELECT * FROM resources WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message_en: 'Resource not found', message_hi: 'संसाधन नहीं मिला' });
    }

    let photo_url = existing.photo_url;
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }

    await query(
      `UPDATE resources
       SET name_en = ?, name_hi = ?, resource_type_id = ?, area_id = ?, department_id = ?,
           location_address = ?, condition_status = ?, last_maintenance_date = ?, next_maintenance_date = ?,
           photo_url = ?, description = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name_en || existing.name_en,
        name_hi || existing.name_hi,
        resource_type_id || existing.resource_type_id,
        area_id || existing.area_id,
        department_id !== undefined ? department_id : existing.department_id,
        location_address || existing.location_address,
        condition_status || existing.condition_status,
        last_maintenance_date || existing.last_maintenance_date,
        next_maintenance_date || existing.next_maintenance_date,
        photo_url,
        description !== undefined ? description : existing.description,
        id
      ]
    );

    res.json({ success: true, message_en: 'Resource updated successfully', message_hi: 'संसाधन सफलतापूर्वक अपडेट किया गया' });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Failed to update resource', message_hi: 'संसाधन अपडेट करने में विफल' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM resources WHERE id = ?', [id]);
    res.json({ success: true, message_en: 'Resource deleted successfully', message_hi: 'संसाधन सफलतापूर्वक हटाया गया' });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Failed to delete resource', message_hi: 'संसाधन हटाने में विफल' });
  }
};

exports.getResourceTypes = async (req, res) => {
  try {
    const types = await query('SELECT * FROM resource_types ORDER BY id ASC');
    res.json({ success: true, types });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching resource types', message_hi: 'संसाधन प्रकार प्राप्त करने में त्रुटि' });
  }
};
