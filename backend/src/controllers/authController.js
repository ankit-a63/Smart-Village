const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, queryOne } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'citizen', area_id = 1 } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message_en: 'Name, email and password are required',
        message_hi: 'नाम, ईमेल और पासवर्ड आवश्यक हैं'
      });
    }

    const existingUser = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message_en: 'Email is already registered',
        message_hi: 'यह ईमेल पहले से पंजीकृत है'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, phone, password, role, area_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || '', hashedPassword, role, area_id]
    );

    const newUser = await queryOne('SELECT id, name, email, role, phone, area_id FROM users WHERE id = ?', [result.insertId]);
    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message_en: 'Registration successful!',
      message_hi: 'पंजीकरण सफल रहा!',
      user: newUser,
      token
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message_en: 'Server error during registration', message_hi: 'पंजीकरण के दौरान सर्वर त्रुटि' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message_en: 'Email and password are required',
        message_hi: 'ईमेल और पासवर्ड आवश्यक हैं'
      });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message_en: 'Invalid credentials',
        message_hi: 'अमान्य ईमेल या पासवर्ड'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message_en: 'Invalid credentials',
        message_hi: 'अमान्य ईमेल या पासवर्ड'
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      area_id: user.area_id,
      department_id: user.department_id,
      avatar: user.avatar
    };

    res.json({
      success: true,
      message_en: 'Login successful',
      message_hi: 'लॉगिन सफल',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message_en: 'Server error during login', message_hi: 'लॉगिन के दौरान सर्वर त्रुटि' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await queryOne(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.area_id, u.department_id, u.avatar,
              a.name_en as area_name_en, a.name_hi as area_name_hi,
              d.name_en as department_name_en, d.name_hi as department_name_hi
       FROM users u
       LEFT JOIN areas a ON u.area_id = a.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message_en: 'User not found', message_hi: 'उपयोगकर्ता नहीं मिला' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message_en: 'Error fetching profile', message_hi: 'प्रोफ़ाइल प्राप्त करने में त्रुटि' });
  }
};
