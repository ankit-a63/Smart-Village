-- SMART VILLAGE MANAGEMENT SYSTEM - DEMO SEED DATA (MySQL)
USE smart_village_db;

-- 1. Insert Areas
INSERT INTO areas (id, name_en, name_hi, code, population, supervisor_name) VALUES
(1, 'Main Bazaar', 'मुख्य बाजार', 'MB-01', 3500, 'Ramesh Kumar'),
(2, 'Panchayat Area', 'पंचायत क्षेत्र', 'PA-02', 2800, 'Sunita Devi'),
(3, 'School Area', 'स्कूल क्षेत्र', 'SA-03', 2100, 'Manoj Verma'),
(4, 'North Village', 'उत्तरी गांव', 'NV-04', 3100, 'Rajesh Patel'),
(5, 'South Village', 'दक्षिणी गांव', 'SV-05', 2900, 'Anita Singh'),
(6, 'East Village', 'पूर्वी गांव', 'EV-06', 2400, 'Vikram Sharma'),
(7, 'West Village', 'पश्चिमी गांव', 'WV-07', 2600, 'Dinesh Yadav');

-- 2. Insert Departments
INSERT INTO departments (id, name_en, name_hi, code, head_name, contact_number, email) VALUES
(1, 'Roads & Infrastructure', 'सड़क एवं बुनियादी ढांचा', 'DEP-ROAD', 'Er. Suresh Chandra', '+91 98765 11111', 'roads@smartvillage.gov.in'),
(2, 'Water Supply & Sewage', 'जल आपूर्ति एवं सीवरेज', 'DEP-WATER', 'Er. Meena Kumari', '+91 98765 22222', 'water@smartvillage.gov.in'),
(3, 'Electricity & Power', 'विद्युत एवं ऊर्जा', 'DEP-ELEC', 'Er. Anil Gupta', '+91 98765 33333', 'power@smartvillage.gov.in'),
(4, 'Sanitation & Hygiene', 'स्वच्छता एवं सफाई', 'DEP-SANI', 'Dr. Priya Roy', '+91 98765 44444', 'sanitation@smartvillage.gov.in'),
(5, 'Public Works & Buildings', 'लोक निर्माण एवं भवन', 'DEP-BLDG', 'Er. K.L. Sharma', '+91 98765 55555', 'pwd@smartvillage.gov.in');

-- 3. Insert Complaint Categories
INSERT INTO complaint_categories (id, name_en, name_hi, icon, department_id, sla_hours) VALUES
(1, 'Road Problems', 'सड़क समस्याएं', 'Truck', 1, 48),
(2, 'Water Supply', 'जल आपूर्ति', 'Droplets', 2, 24),
(3, 'Electricity Issue', 'बिजली की समस्या', 'Zap', 3, 12),
(4, 'Street Light', 'स्ट्रीट लाइट', 'Sun', 3, 24),
(5, 'Sanitation & Garbage', 'स्वच्छता और कचरा', 'Trash2', 4, 24),
(6, 'Drainage Overflow', 'जल निकासी / नाली', 'Filter', 4, 36),
(7, 'Public Building', 'सार्वजनिक भवन', 'Building2', 5, 72),
(8, 'Other Village Issues', 'अन्य ग्रामीण समस्याएं', 'HelpCircle', 5, 48);

-- 4. Insert Demo Users (Passwords hashed for 'password123')
-- $2a$10$e.w2pI6hW0k7dMhS.8sNxeQ9qT9/p/pXJ399hLzS8yN standard test hash or dynamic support
INSERT INTO users (id, name, email, phone, password, role, area_id, department_id) VALUES
(1, 'Gram Panchayat Admin', 'admin@smartvillage.gov.in', '9800000001', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'admin', 2, NULL),
(2, 'Suresh Kumar (Worker)', 'worker.road@smartvillage.gov.in', '9800000002', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'worker', 1, 1),
(3, 'Ravi Teja (Worker)', 'worker.water@smartvillage.gov.in', '9800000003', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'worker', 2, 2),
(4, 'Amit Verma (Worker)', 'worker.elec@smartvillage.gov.in', '9800000004', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'worker', 3, 3),
(5, 'Sanjay Yadav (Worker)', 'worker.sani@smartvillage.gov.in', '9800000005', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'worker', 4, 4),
(6, 'Vikash Singh (Worker)', 'worker.bldg@smartvillage.gov.in', '9800000006', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'worker', 5, 5),
(7, 'Ramesh Patel (Citizen)', 'ramesh.citizen@gmail.com', '9876543210', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'citizen', 1, NULL),
(8, 'Sunita Devi (Citizen)', 'sunita.citizen@gmail.com', '9876543211', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'citizen', 2, NULL),
(9, 'Mahesh Sharma (Citizen)', 'mahesh.citizen@gmail.com', '9876543212', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'citizen', 3, NULL),
(10, 'Pooja Rani (Citizen)', 'pooja.citizen@gmail.com', '9876543213', '$2a$10$5p.OqYnZbF1hK7yH1m7R8u4aKj6mX9w9k3z.1x8qYnZbF1hK7yH1m', 'citizen', 4, NULL);
