-- SMART VILLAGE MANAGEMENT SYSTEM
-- Database Schema for MySQL

CREATE DATABASE IF NOT EXISTS smart_village_db;
USE smart_village_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'admin', 'worker') DEFAULT 'citizen',
  area_id INT,
  department_id INT,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Areas Table
CREATE TABLE IF NOT EXISTS areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  population INT DEFAULT 0,
  supervisor_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  head_name VARCHAR(100),
  contact_number VARCHAR(20),
  email VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Complaint Categories Table
CREATE TABLE IF NOT EXISTS complaint_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'Wrench',
  department_id INT,
  sla_hours INT DEFAULT 48,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 5. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_id VARCHAR(30) UNIQUE NOT NULL,
  citizen_id INT NOT NULL,
  category_id INT NOT NULL,
  area_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location_address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photo_url VARCHAR(255),
  resolution_photo_url VARCHAR(255),
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed') DEFAULT 'submitted',
  assigned_department_id INT,
  assigned_worker_id INT,
  admin_remarks TEXT,
  worker_notes TEXT,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES complaint_categories(id),
  FOREIGN KEY (area_id) REFERENCES areas(id),
  FOREIGN KEY (assigned_department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_worker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Complaint Status History
CREATE TABLE IF NOT EXISTS complaint_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_by_user_id INT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- 7. Resource Types Table
CREATE TABLE IF NOT EXISTS resource_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'Package'
);

-- 8. Public Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_code VARCHAR(30) UNIQUE NOT NULL,
  name_en VARCHAR(120) NOT NULL,
  name_hi VARCHAR(120) NOT NULL,
  resource_type_id INT NOT NULL,
  area_id INT NOT NULL,
  department_id INT,
  location_address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  condition_status ENUM('active', 'needs_maintenance', 'under_repair', 'damaged', 'inactive') DEFAULT 'active',
  installation_date DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  photo_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_type_id) REFERENCES resource_types(id),
  FOREIGN KEY (area_id) REFERENCES areas(id),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 9. Maintenance Records Table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id INT NOT NULL,
  worker_id INT,
  details TEXT NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  performed_date DATE NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title_en VARCHAR(150) NOT NULL,
  title_hi VARCHAR(150) NOT NULL,
  message_en TEXT NOT NULL,
  message_hi TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  related_complaint_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
