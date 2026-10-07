const { query } = require('../config/db');

exports.getUserNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 25`,
      [user_id]
    );

    const unreadCount = await query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );

    res.json({
      success: true,
      unread_count: unreadCount[0] ? unreadCount[0].count : 0,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching notifications', message_hi: 'सूचनाएं प्राप्त करने में त्रुटि' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (id === 'all') {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user_id]);
    } else {
      await query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, user_id]);
    }

    res.json({ success: true, message_en: 'Notifications marked as read', message_hi: 'सूचनाएं पढ़ी हुई के रूप में चिह्नित' });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error updating notifications', message_hi: 'सूचनाएं अपडेट करने में त्रुटि' });
  }
};
