const { query } = require('../config/db');

exports.getAssignedTasks = async (req, res) => {
  try {
    const worker_id = req.user.id;

    const tasks = await query(
      `SELECT c.*,
              cc.name_en as category_name_en, cc.name_hi as category_name_hi, cc.icon as category_icon,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              u.name as citizen_name, u.phone as citizen_phone
       FROM complaints c
       LEFT JOIN complaint_categories cc ON c.category_id = cc.id
       LEFT JOIN areas a ON c.area_id = a.id
       LEFT JOIN users u ON c.citizen_id = u.id
       WHERE c.assigned_worker_id = ?
       ORDER BY CASE c.priority
         WHEN 'critical' THEN 1
         WHEN 'high' THEN 2
         WHEN 'medium' THEN 3
         ELSE 4
       END, c.created_at DESC`,
      [worker_id]
    );

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching assigned tasks', message_hi: 'सौंपे गए कार्य प्राप्त करने में त्रुटि' });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.department_id, u.area_id,
              d.name_en as department_name_en, d.name_hi as department_name_hi,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id = u.id AND status IN ('assigned', 'in_progress')) as active_tasks,
              (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id = u.id AND status IN ('resolved', 'closed')) as completed_tasks
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN areas a ON u.area_id = a.id
       WHERE u.role = 'worker'
       ORDER BY u.name ASC`
    );

    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching worker list', message_hi: 'कर्मचारियों की सूची प्राप्त करने में त्रुटि' });
  }
};
