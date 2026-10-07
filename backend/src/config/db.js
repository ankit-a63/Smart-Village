const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');

let dbDriver = process.env.DB_TYPE || 'sqlite'; // 'sqlite' or 'mysql'
let sqliteDb = null;
let mysqlPool = null;

// Determine SQLite path - use :memory: if running on Vercel serverless
const isVercel = !!process.env.VERCEL;
const dbPath = isVercel ? ':memory:' : path.join(__dirname, '../../smart_village.db');

function getSqliteDb() {
  if (!sqliteDb) {
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Failed to open SQLite database:', err.message);
      } else {
        console.log(`Connected to SQLite database (${isVercel ? 'In-Memory Serverless Mode' : 'Local Disk File'})`);
      }
    });
  }
  return sqliteDb;
}

// Unified Promisified Query Helper for both MySQL & SQLite
function query(sql, params = []) {
  if (dbDriver === 'mysql' && mysqlPool) {
    return mysqlPool.execute(sql, params).then(([result]) => {
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return { insertId: result.insertId, changes: result.affectedRows };
      }
      return result;
    });
  }

  const db = getSqliteDb();
  return new Promise((resolve, reject) => {
    const trimmedSql = sql.trim().toLowerCase();
    if (trimmedSql.startsWith('select') || trimmedSql.startsWith('pragma')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, changes: this.changes });
      });
    }
  });
}

function queryOne(sql, params = []) {
  return query(sql, params).then(rows => (Array.isArray(rows) && rows.length > 0 ? rows[0] : null));
}

// Database schema & seed initialization
async function initDatabase() {
  if (process.env.DB_TYPE === 'mysql') {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'smart_village_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      await mysqlPool.query('SELECT 1');
      console.log('Connected to MySQL Pool successfully.');
      dbDriver = 'mysql';
      return;
    } catch (err) {
      console.warn('MySQL connection failed. Falling back to SQLite mode.', err.message);
      dbDriver = 'sqlite';
    }
  }

  // SQLite Initialization
  const db = getSqliteDb();
  db.serialize(async () => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`CREATE TABLE IF NOT EXISTS areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      population INTEGER DEFAULT 0,
      supervisor_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      head_name TEXT,
      contact_number TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS complaint_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      icon TEXT DEFAULT 'Wrench',
      department_id INTEGER,
      sla_hours INTEGER DEFAULT 48,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('citizen', 'admin', 'worker')) DEFAULT 'citizen',
      area_id INTEGER,
      department_id INTEGER,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (area_id) REFERENCES areas(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT UNIQUE NOT NULL,
      citizen_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      area_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location_address TEXT,
      latitude REAL,
      longitude REAL,
      photo_url TEXT,
      resolution_photo_url TEXT,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
      status TEXT CHECK(status IN ('submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed')) DEFAULT 'submitted',
      assigned_department_id INTEGER,
      assigned_worker_id INTEGER,
      admin_remarks TEXT,
      worker_notes TEXT,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (citizen_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES complaint_categories(id),
      FOREIGN KEY (area_id) REFERENCES areas(id),
      FOREIGN KEY (assigned_department_id) REFERENCES departments(id),
      FOREIGN KEY (assigned_worker_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS complaint_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      changed_by_user_id INTEGER,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (complaint_id) REFERENCES complaints(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS resource_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      icon TEXT DEFAULT 'Package'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_code TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      resource_type_id INTEGER NOT NULL,
      area_id INTEGER NOT NULL,
      department_id INTEGER,
      location_address TEXT,
      latitude REAL,
      longitude REAL,
      condition_status TEXT CHECK(condition_status IN ('active', 'needs_maintenance', 'under_repair', 'damaged', 'inactive')) DEFAULT 'active',
      installation_date TEXT,
      last_maintenance_date TEXT,
      next_maintenance_date TEXT,
      photo_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resource_type_id) REFERENCES resource_types(id),
      FOREIGN KEY (area_id) REFERENCES areas(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title_en TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      message_en TEXT NOT NULL,
      message_hi TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      related_complaint_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Check if seed data exists
    db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
      if (!err && row && row.count === 0) {
        console.log("Seeding database with realistic Smart Village demo data...");
        const seedDatabase = require('../utils/seedData');
        await seedDatabase(query);
      }
    });
  });
}

module.exports = {
  query,
  queryOne,
  initDatabase,
  getSqliteDb
};
