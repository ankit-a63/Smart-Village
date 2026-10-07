# SMART VILLAGE Management System 🏛️🌾

> **TAGLINE:** *“Digital Solutions for Smarter, Cleaner & Better Villages”*

An enterprise-grade, production-quality full-stack e-governance platform designed for Gram Panchayats and rural smart-city infrastructure management.

---

## 🌟 Key Features

1. **Complete Bilingual Localization (English | हिंदी)**
   - 100% complete translation system (`locales/en.json` & `locales/hi.json`).
   - Dynamic language switching (`EN | हिंदी`) across all UI elements, navigation, forms, modals, tables, badges, notifications, and analytics labels.
   - Persistent language selection in `localStorage`.

2. **Full-Stack Civic Workflow (Real Database CRUD)**
   - Citizen Complaint Logging: Multi-step submission wizard with photo upload & GPS Geolocation picker fallback.
   - Auto-generated Tracking IDs (`SVMS-2026-00001`).
   - Admin Review & Governance: Assignment of dedicated field workers and department routing.
   - Worker Field Portal: Status update, work notes logging, and completion photo upload.
   - Status Tracking Timeline: Animated 6-phase status tracker (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`).

3. **Public Resource Management Module**
   - Inventory catalog of village handpumps, streetlights, schools, health centers, water tanks, public toilets.
   - Condition status tracking (`Active`, `Needs Maintenance`, `Under Repair`, `Damaged`).
   - Maintenance schedule tracking.

4. **Interactive Leaflet Village Map**
   - Geographic visualization of monitored assets and reported issues with custom SVG markers and animated popups.

5. **Real-time Analytics Engine**
   - Interactive Recharts dashboards for category breakdown, ward/area distribution, monthly trends, resolution efficiency, and asset health.

6. **Notification System & Theme System**
   - Dynamic unread count badge & dropdown notification center.
   - Dark & Light mode toggle with smooth transitions.

---

## 👥 5-Member Team Contribution

| Member | Role | Key Module Ownership |
| :--- | :--- | :--- |
| **Member 1** | Citizen Portal Lead | Citizen dashboard, Multi-step complaint wizard, GPS picker, Bilingual translation context |
| **Member 2** | Admin Governance Lead | Gram Panchayat Admin dashboard, Worker assignment, Department routing, Status verification |
| **Member 3** | Resource & Mapping Specialist | Public Resource inventory CRUD, Leaflet interactive map with custom SVG markers |
| **Member 4** | Backend & Database Architect | Express REST APIs, JWT auth, Multer file uploads, MySQL schema & zero-config SQLite driver |
| **Member 5** | Analytics & QA Specialist | Recharts analytics engine, Framer Motion scroll reveals, Vector village SVG graphics, QA testing |

---

## 🔑 Quick Demo Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Panchayat Admin** | `admin@smartvillage.gov.in` | `password123` | Full access to complaints, worker assignment, resource CRUD, analytics |
| **Field Worker** | `worker.road@smartvillage.gov.in` | `password123` | Field task view, work status update, resolution photo upload |
| **Citizen** | `citizen@smartvillage.gov.in` | `password123` | Report new complaints, track status, view notifications |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, Leaflet / React-Leaflet
- **Backend:** Node.js, Express.js, JWT, bcryptjs, Multer
- **Database:** Dual Database Adapter:
  - Production: **MySQL** (`database/schema.sql` & `database/seed.sql`)
  - Out-of-the-box zero setup: **SQLite** (`smart_village.db` auto-created & pre-seeded)

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run the command below from the root directory:
```bash
npm run install:all
```
*Or manually:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run Backend & Frontend

**Option A (Backend):**
```bash
cd backend
npm start
```
*Backend API will run at `http://localhost:5000` and automatically initialize the pre-seeded SQLite database!*

**Option B (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend app will run at `http://localhost:3000`.*

---

## 📡 Database Setup (MySQL Option)

To run with MySQL instead of SQLite:
1. Import `database/schema.sql` into MySQL.
2. Import `database/seed.sql`.
3. Create `.env` in `backend/` with:
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=smart_village_db
   PORT=5000
   JWT_SECRET=smart_village_secret_key_2026
   ```

---

## 🔮 Future Scope

- **AI-based Complaint Categorization & Priority Scoring** using Gemini API.
- **SMS & WhatsApp Alerts** for instant updates to citizens without smartphones.
- **IoT Sensor Integration** for automatic street-light fault detection and water tank level alerts.
- **Native Android / iOS App** via React Native / Flutter.
