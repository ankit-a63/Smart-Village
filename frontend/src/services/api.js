import axios from 'axios';

// API Base URL Detection
const IS_LOCAL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = import.meta.env.VITE_API_URL || (IS_LOCAL ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('svms_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Initial Mock Seed Data for Vercel Static Fallback
const DEFAULT_CATEGORIES = [
  { id: 1, name_en: 'Road Problems', name_hi: 'सड़क समस्याएं', icon: 'Truck', sla_hours: 48 },
  { id: 2, name_en: 'Water Supply', name_hi: 'जल आपूर्ति', icon: 'Droplets', sla_hours: 24 },
  { id: 3, name_en: 'Electricity Issue', name_hi: 'बिजली की समस्या', icon: 'Zap', sla_hours: 12 },
  { id: 4, name_en: 'Street Light', name_hi: 'स्ट्रीट लाइट', icon: 'Sun', sla_hours: 24 },
  { id: 5, name_en: 'Sanitation & Garbage', name_hi: 'स्वच्छता और कचरा', icon: 'Trash2', sla_hours: 24 },
  { id: 6, name_en: 'Drainage Overflow', name_hi: 'जल निकासी / नाली', icon: 'Filter', sla_hours: 36 },
  { id: 7, name_en: 'Public Building', name_hi: 'सार्वजनिक भवन', icon: 'Building2', sla_hours: 72 },
  { id: 8, name_en: 'Other Village Issues', name_hi: 'अन्य ग्रामीण समस्याएं', icon: 'HelpCircle', sla_hours: 48 }
];

const DEFAULT_AREAS = [
  { id: 1, name_en: 'Main Bazaar', name_hi: 'मुख्य बाजार', code: 'MB-01', population: 3500 },
  { id: 2, name_en: 'Panchayat Area', name_hi: 'पंचायत क्षेत्र', code: 'PA-02', population: 2800 },
  { id: 3, name_en: 'School Area', name_hi: 'स्कूल क्षेत्र', code: 'SA-03', population: 2100 },
  { id: 4, name_en: 'North Village', name_hi: 'उत्तरी गांव', code: 'NV-04', population: 3100 },
  { id: 5, name_en: 'South Village', name_hi: 'दक्षिणी गांव', code: 'SV-05', population: 2900 },
  { id: 6, name_en: 'East Village', name_hi: 'पूर्वी गांव', code: 'EV-06', population: 2400 },
  { id: 7, name_en: 'West Village', name_hi: 'पश्चिमी गांव', code: 'WV-07', population: 2600 }
];

const DEFAULT_DEPARTMENTS = [
  { id: 1, name_en: 'Roads & Infrastructure', name_hi: 'सड़क एवं बुनियादी ढांचा', code: 'DEP-ROAD' },
  { id: 2, name_en: 'Water Supply & Sewage', name_hi: 'जल आपूर्ति एवं सीवरेज', code: 'DEP-WATER' },
  { id: 3, name_en: 'Electricity & Power', name_hi: 'विद्युत एवं ऊर्जा', code: 'DEP-ELEC' },
  { id: 4, name_en: 'Sanitation & Hygiene', name_hi: 'स्वच्छता एवं सफाई', code: 'DEP-SANI' },
  { id: 5, name_en: 'Public Works & Buildings', name_hi: 'लोक निर्माण एवं भवन', code: 'DEP-BLDG' }
];

const DEFAULT_WORKERS = [
  { id: 2, name: 'Suresh Kumar (Road Specialist)', email: 'worker.road@smartvillage.gov.in', phone: '9800000002', area_id: 1, department_id: 1, department_name_en: 'Roads & Infrastructure', department_name_hi: 'सड़क एवं बुनियादी ढांचा', active_tasks: 2, completed_tasks: 8 },
  { id: 3, name: 'Ravi Teja (Water Technician)', email: 'worker.water@smartvillage.gov.in', phone: '9800000003', area_id: 2, department_id: 2, department_name_en: 'Water Supply & Sewage', department_name_hi: 'जल आपूर्ति एवं सीवरेज', active_tasks: 3, completed_tasks: 12 },
  { id: 4, name: 'Amit Verma (Lineman)', email: 'worker.elec@smartvillage.gov.in', phone: '9800000004', area_id: 3, department_id: 3, department_name_en: 'Electricity & Power', department_name_hi: 'विद्युत एवं ऊर्जा', active_tasks: 1, completed_tasks: 15 },
  { id: 5, name: 'Sanjay Yadav (Sanitation Lead)', email: 'worker.sani@smartvillage.gov.in', phone: '9800000005', area_id: 4, department_id: 4, department_name_en: 'Sanitation & Hygiene', department_name_hi: 'स्वच्छता एवं सफाई', active_tasks: 2, completed_tasks: 9 },
  { id: 6, name: 'Vikash Singh (PWD Supervisor)', email: 'worker.bldg@smartvillage.gov.in', phone: '9800000006', area_id: 5, department_id: 5, department_name_en: 'Public Works & Buildings', department_name_hi: 'लोक निर्माण एवं भवन', active_tasks: 0, completed_tasks: 5 }
];

const DEFAULT_COMPLAINTS = [
  { id: 1, tracking_id: 'SVMS-2026-00001', citizen_id: 7, citizen_name: 'Ramesh Patel', citizen_phone: '9876543210', category_id: 1, category_name_en: 'Road Problems', category_name_hi: 'सड़क समस्याएं', category_icon: 'Truck', area_id: 1, area_name_en: 'Main Bazaar', area_name_hi: 'मुख्य बाजार', title: 'Broken Pothole near Main Market Entry', description: 'Large pothole causing severe traffic slowdown and motorcycle slips near the main bazaar gate.', location_address: 'Main Market Gate No. 2, Ward 4', latitude: 26.8467, longitude: 80.9462, priority: 'high', status: 'in_progress', assigned_department_id: 1, department_name_en: 'Roads & Infrastructure', department_name_hi: 'सड़क एवं बुनियादी ढांचा', assigned_worker_id: 2, worker_name: 'Suresh Kumar (Road Specialist)', created_at: '2026-10-06T10:00:00Z' },
  { id: 2, tracking_id: 'SVMS-2026-00002', citizen_id: 8, citizen_name: 'Sunita Devi', citizen_phone: '9876543211', category_id: 2, category_name_en: 'Water Supply', category_name_hi: 'जल आपूर्ति', category_icon: 'Droplets', area_id: 3, area_name_en: 'School Area', area_name_hi: 'स्कूल क्षेत्र', title: 'Water Pipe Leakage near Primary School', description: 'Clean drinking water pipe burst on main road, wasting hundreds of liters daily.', location_address: 'Govt Primary School Road, Ward 2', latitude: 26.8480, longitude: 80.9480, priority: 'critical', status: 'assigned', assigned_department_id: 2, department_name_en: 'Water Supply & Sewage', department_name_hi: 'जल आपूर्ति एवं सीवरेज', assigned_worker_id: 3, worker_name: 'Ravi Teja (Water Technician)', created_at: '2026-10-06T12:30:00Z' },
  { id: 3, tracking_id: 'SVMS-2026-00003', citizen_id: 9, citizen_name: 'Mahesh Sharma', citizen_phone: '9876543212', category_id: 3, category_name_en: 'Electricity Issue', category_name_hi: 'बिजली की समस्या', category_icon: 'Zap', area_id: 2, area_name_en: 'Panchayat Area', area_name_hi: 'पंचायत क्षेत्र', title: 'Low Voltage and Transformer Sparking', description: 'Frequent voltage drops and sparking observed at Panchayat Bhawan transformer.', location_address: 'Panchayat Bhawan Premises', latitude: 26.8450, longitude: 80.9450, priority: 'high', status: 'submitted', assigned_department_id: 3, department_name_en: 'Electricity & Power', department_name_hi: 'विद्युत एवं ऊर्जा', assigned_worker_id: null, worker_name: null, created_at: '2026-10-07T08:00:00Z' },
  { id: 4, tracking_id: 'SVMS-2026-00004', citizen_id: 10, citizen_name: 'Pooja Rani', citizen_phone: '9876543213', category_id: 4, category_name_en: 'Street Light', category_name_hi: 'स्ट्रीट लाइट', category_icon: 'Sun', area_id: 4, area_name_en: 'North Village', area_name_hi: 'उत्तरी गांव', title: '5 Street Lights Not Working in North Lane', description: 'North village main lane is in pitch darkness after sunset due to burnt out solar lights.', location_address: 'North Village Lane 3', latitude: 26.8500, longitude: 80.9410, priority: 'medium', status: 'resolved', assigned_department_id: 3, department_name_en: 'Electricity & Power', department_name_hi: 'विद्युत एवं ऊर्जा', assigned_worker_id: 4, worker_name: 'Amit Verma (Lineman)', created_at: '2026-10-05T14:10:00Z' },
  { id: 5, tracking_id: 'SVMS-2026-00005', citizen_id: 11, citizen_name: 'Anil Gupta', citizen_phone: '9876543214', category_id: 5, category_name_en: 'Sanitation & Garbage', category_name_hi: 'स्वच्छता और कचरा', category_icon: 'Trash2', area_id: 5, area_name_en: 'South Village', area_name_hi: 'दक्षिणी गांव', title: 'Garbage Dump Overflow near Health Centre', description: 'Uncollected domestic waste creating health risk near primary health clinic entrance.', location_address: 'Health Centre Outer Wall', latitude: 26.8420, longitude: 80.9490, priority: 'high', status: 'in_progress', assigned_department_id: 4, department_name_en: 'Sanitation & Hygiene', department_name_hi: 'स्वच्छता एवं सफाई', assigned_worker_id: 5, worker_name: 'Sanjay Yadav (Sanitation Lead)', created_at: '2026-10-06T15:20:00Z' }
];

const DEFAULT_RESOURCES = [
  { id: 1, resource_code: 'HP-001', name_en: 'Bazaar Handpump', name_hi: 'बाजार हैंडपंप', resource_type_id: 1, type_name_en: 'Hand Pump', type_name_hi: 'हैंडपंप', area_id: 1, area_name_en: 'Main Bazaar', area_name_hi: 'मुख्य बाजार', location_address: 'Main Bazaar Square', latitude: 26.8465, longitude: 80.9463, condition_status: 'active', description: 'Main public drinking water handpump.' },
  { id: 2, resource_code: 'HP-002', name_en: 'School Handpump', name_hi: 'स्कूल हैंडपंप', resource_type_id: 1, type_name_en: 'Hand Pump', type_name_hi: 'हैंडपंप', area_id: 3, area_name_en: 'School Area', area_name_hi: 'स्कूल क्षेत्र', location_address: 'Primary School Courtyard', latitude: 26.8481, longitude: 80.9479, condition_status: 'active', description: 'Drinking water pump for primary school.' },
  { id: 3, resource_code: 'SL-101', name_en: 'Solar Street Light Pole #1', name_hi: 'सोलर स्ट्रीट लाइट पोल #1', resource_type_id: 2, type_name_en: 'Street Light', type_name_hi: 'स्ट्रीट लाइट', area_id: 1, area_name_en: 'Main Bazaar', area_name_hi: 'मुख्य बाजार', location_address: 'Main Bazaar Entry', latitude: 26.8462, longitude: 80.9460, condition_status: 'active', description: '100W Solar LED pole light.' },
  { id: 4, resource_code: 'SCH-01', name_en: 'Govt Primary School', name_hi: 'शासकीय प्राथमिक विद्यालय', resource_type_id: 3, type_name_en: 'School', type_name_hi: 'विद्यालय', area_id: 3, area_name_en: 'School Area', area_name_hi: 'स्कूल क्षेत्र', location_address: 'School Area Central', latitude: 26.8480, longitude: 80.9480, condition_status: 'active', description: 'Gram Panchayat primary education school.' },
  { id: 5, resource_code: 'HC-01', name_en: 'Primary Health Centre (PHC)', name_hi: 'प्राथमिक स्वास्थ्य केंद्र', resource_type_id: 4, type_name_en: 'Health Centre', type_name_hi: 'स्वास्थ्य केंद्र', area_id: 5, area_name_en: 'South Village', area_name_hi: 'दक्षिणी गांव', location_address: 'South Health Complex', latitude: 26.8419, longitude: 80.9490, condition_status: 'active', description: 'Main village health center facility.' },
  { id: 6, resource_code: 'WT-01', name_en: 'Overhead Reservoir 50,000L', name_hi: 'ओवरहेड पानी की टंकी', resource_type_id: 5, type_name_en: 'Water Tank', type_name_hi: 'पानी की टंकी', area_id: 2, area_name_en: 'Panchayat Area', area_name_hi: 'पंचायत क्षेत्र', location_address: 'Panchayat Water Complex', latitude: 26.8447, longitude: 80.9457, condition_status: 'under_repair', description: 'Main drinking water distribution overhead tank.' }
];

// Helper to get or set local Storage state for Vercel fallback
function getLocalState(key, defaultVal) {
  try {
    const saved = localStorage.getItem(`svms_state_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalState(key, val) {
  try {
    localStorage.setItem(`svms_state_${key}`, JSON.stringify(val));
  } catch {}
}

// Fallback helper wrapper for API calls
async function callApi(fn, fallbackFn) {
  try {
    return await fn();
  } catch (err) {
    if (!IS_LOCAL) {
      return { data: await fallbackFn() };
    }
    throw err;
  }
}

export const authAPI = {
  login: (credentials) => callApi(
    () => api.post('/auth/login', credentials),
    async () => {
      const email = credentials.email.toLowerCase();
      let role = 'citizen';
      let name = 'Ramesh Patel (Citizen)';
      let id = 7;
      let department_id = null;

      if (email.includes('admin')) {
        role = 'admin';
        name = 'Gram Panchayat Admin';
        id = 1;
      } else if (email.includes('worker')) {
        role = 'worker';
        name = 'Suresh Kumar (Worker)';
        id = 2;
        department_id = 1;
      }

      const user = { id, name, email: credentials.email, role, area_id: 1, department_id };
      return { success: true, user, token: 'vercel_demo_token_' + Date.now() };
    }
  ),
  register: (userData) => callApi(
    () => api.post('/auth/register', userData),
    async () => {
      const user = { id: Date.now(), name: userData.name, email: userData.email, role: 'citizen', area_id: userData.area_id || 1 };
      return { success: true, user, token: 'vercel_demo_token_' + Date.now() };
    }
  ),
  getProfile: () => callApi(
    () => api.get('/auth/profile'),
    async () => {
      const savedUser = JSON.parse(localStorage.getItem('svms_user') || 'null');
      return { success: true, user: savedUser || { id: 1, name: 'Gram Panchayat Admin', role: 'admin', email: 'admin@smartvillage.gov.in' } };
    }
  )
};

export const complaintAPI = {
  submit: (formData) => callApi(
    () => api.post('/complaints/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      const nextId = list.length + 1;
      const tracking_id = `SVMS-2026-${String(nextId).padStart(5, '0')}`;
      const title = formData.get('title') || 'Public Infrastructure Issue';
      const desc = formData.get('description') || 'Reported problem details.';
      const prio = formData.get('priority') || 'medium';
      const areaId = parseInt(formData.get('area_id') || '1', 10);
      const catId = parseInt(formData.get('category_id') || '1', 10);

      const areaObj = DEFAULT_AREAS.find(a => a.id === areaId) || DEFAULT_AREAS[0];
      const catObj = DEFAULT_CATEGORIES.find(c => c.id === catId) || DEFAULT_CATEGORIES[0];

      const newComp = {
        id: Date.now(),
        tracking_id,
        citizen_id: 7,
        citizen_name: 'Ramesh Patel',
        citizen_phone: '9876543210',
        category_id: catId,
        category_name_en: catObj.name_en,
        category_name_hi: catObj.name_hi,
        category_icon: catObj.icon,
        area_id: areaId,
        area_name_en: areaObj.name_en,
        area_name_hi: areaObj.name_hi,
        title,
        description: desc,
        location_address: formData.get('location_address') || areaObj.name_en,
        priority: prio,
        status: 'submitted',
        assigned_department_id: 1,
        department_name_en: 'Roads & Infrastructure',
        department_name_hi: 'सड़क एवं बुनियादी ढांचा',
        created_at: new Date().toISOString()
      };

      setLocalState('complaints', [newComp, ...list]);
      return { success: true, tracking_id, complaint_id: newComp.id };
    }
  ),
  getMyComplaints: () => callApi(
    () => api.get('/complaints/my-complaints'),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      return { success: true, count: list.length, complaints: list };
    }
  ),
  getPublicAll: () => callApi(
    () => api.get('/complaints/all-public'),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      return { success: true, count: list.length, complaints: list };
    }
  ),
  getAdminAll: (params) => callApi(
    () => api.get('/complaints/admin/all', { params }),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      return { success: true, count: list.length, complaints: list };
    }
  ),
  track: (id) => callApi(
    () => api.get(`/complaints/track/${id}`),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      const found = list.find(c => c.tracking_id === id || String(c.id) === String(id)) || list[0];
      const history = [
        { id: 1, complaint_id: found.id, status: 'submitted', remarks: 'Complaint logged into Smart Village Portal.', created_at: found.created_at }
      ];
      if (found.status !== 'submitted') {
        history.push({ id: 2, complaint_id: found.id, status: found.status, remarks: `Status updated to ${found.status}`, created_at: new Date().toISOString() });
      }
      return { success: true, complaint: found, history };
    }
  ),
  updateStatus: (id, formData) => callApi(
    () => api.put(`/complaints/admin/update/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      const updated = list.map(c => {
        if (String(c.id) === String(id)) {
          const newStatus = formData.get('status') || c.status;
          const newWorkerId = formData.get('assigned_worker_id');
          let workerName = c.worker_name;
          if (newWorkerId) {
            const w = DEFAULT_WORKERS.find(wk => String(wk.id) === String(newWorkerId));
            if (w) workerName = w.name;
          }
          return { ...c, status: newStatus, assigned_worker_id: newWorkerId || c.assigned_worker_id, worker_name: workerName };
        }
        return c;
      });
      setLocalState('complaints', updated);
      return { success: true, message_en: 'Complaint updated successfully' };
    }
  )
};

export const resourceAPI = {
  getAll: (params) => callApi(
    () => api.get('/resources/public', { params }),
    async () => {
      const list = getLocalState('resources', DEFAULT_RESOURCES);
      return { success: true, count: list.length, resources: list };
    }
  ),
  getTypes: () => callApi(
    () => api.get('/resources/types'),
    async () => {
      return {
        success: true,
        types: [
          { id: 1, name_en: 'Hand Pump', name_hi: 'हैंडपंप', icon: 'Droplets' },
          { id: 2, name_en: 'Street Light', name_hi: 'स्ट्रीट लाइट', icon: 'Sun' },
          { id: 3, name_en: 'School', name_hi: 'विद्यालय', icon: 'GraduationCap' },
          { id: 4, name_en: 'Health Centre', name_hi: 'स्वास्थ्य केंद्र', icon: 'HeartPulse' },
          { id: 5, name_en: 'Water Tank', name_hi: 'पानी की टंकी', icon: 'Container' }
        ]
      };
    }
  ),
  getDetail: (id) => callApi(
    () => api.get(`/resources/detail/${id}`),
    async () => {
      const list = getLocalState('resources', DEFAULT_RESOURCES);
      const found = list.find(r => String(r.id) === String(id) || r.resource_code === id) || list[0];
      return { success: true, resource: found };
    }
  ),
  create: (formData) => callApi(
    () => api.post('/resources/admin/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => {
      const list = getLocalState('resources', DEFAULT_RESOURCES);
      const name_en = formData.get('name_en') || 'Public Asset';
      const name_hi = formData.get('name_hi') || name_en;
      const typeId = parseInt(formData.get('resource_type_id') || '1', 10);
      const areaId = parseInt(formData.get('area_id') || '1', 10);

      const areaObj = DEFAULT_AREAS.find(a => a.id === areaId) || DEFAULT_AREAS[0];

      const newRes = {
        id: Date.now(),
        resource_code: `RES-${String(list.length + 1).padStart(4, '0')}`,
        name_en,
        name_hi,
        resource_type_id: typeId,
        area_id: areaId,
        area_name_en: areaObj.name_en,
        area_name_hi: areaObj.name_hi,
        location_address: areaObj.name_en + ' Ward',
        condition_status: formData.get('condition_status') || 'active',
        description: formData.get('description') || 'Smart Village public asset.'
      };

      setLocalState('resources', [newRes, ...list]);
      return { success: true, resource_id: newRes.id, resource_code: newRes.resource_code };
    }
  ),
  update: (id, formData) => callApi(
    () => api.put(`/resources/admin/update/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    async () => {
      const list = getLocalState('resources', DEFAULT_RESOURCES);
      const updated = list.map(r => String(r.id) === String(id) ? { ...r, condition_status: formData.get('condition_status') || r.condition_status } : r);
      setLocalState('resources', updated);
      return { success: true };
    }
  ),
  delete: (id) => callApi(
    () => api.delete(`/resources/admin/delete/${id}`),
    async () => {
      const list = getLocalState('resources', DEFAULT_RESOURCES);
      const filtered = list.filter(r => String(r.id) !== String(id));
      setLocalState('resources', filtered);
      return { success: true };
    }
  )
};

export const workerAPI = {
  getAssignedTasks: () => callApi(
    () => api.get('/workers/assigned'),
    async () => {
      const list = getLocalState('complaints', DEFAULT_COMPLAINTS);
      return { success: true, count: list.length, tasks: list };
    }
  ),
  getAllWorkers: () => callApi(
    () => api.get('/workers/list'),
    async () => {
      return { success: true, count: DEFAULT_WORKERS.length, workers: DEFAULT_WORKERS };
    }
  )
};

export const analyticsAPI = {
  getOverview: () => callApi(
    () => api.get('/analytics/overview'),
    async () => {
      const complaints = getLocalState('complaints', DEFAULT_COMPLAINTS);
      const resources = getLocalState('resources', DEFAULT_RESOURCES);

      const resolved = complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
      const total = complaints.length || 1;

      return {
        success: true,
        metrics: {
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter(c => ['submitted', 'under_review'].includes(c.status)).length,
          inProgressComplaints: complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
          resolvedComplaints: resolved,
          highPriorityComplaints: complaints.filter(c => ['high', 'critical'].includes(c.priority)).length,
          resolutionRate: Math.round((resolved / total) * 100),
          avgResolutionHours: 18.4,
          totalResources: resources.length,
          resourcesNeedingMaintenance: resources.filter(r => r.condition_status !== 'active').length,
          totalCitizens: 15,
          totalWorkers: 5
        },
        categoryStats: DEFAULT_CATEGORIES.map(c => ({
          name_en: c.name_en,
          name_hi: c.name_hi,
          count: complaints.filter(cp => cp.category_id === c.id).length || 1
        })),
        areaStats: DEFAULT_AREAS.map(a => ({
          name_en: a.name_en,
          name_hi: a.name_hi,
          count: complaints.filter(cp => cp.area_id === a.id).length || 1,
          resolved_count: complaints.filter(cp => cp.area_id === a.id && ['resolved', 'closed'].includes(cp.status)).length
        })),
        resourceStatusStats: [
          { condition_status: 'active', count: resources.filter(r => r.condition_status === 'active').length },
          { condition_status: 'needs_maintenance', count: resources.filter(r => r.condition_status === 'needs_maintenance').length },
          { condition_status: 'under_repair', count: resources.filter(r => r.condition_status === 'under_repair').length },
          { condition_status: 'damaged', count: resources.filter(r => r.condition_status === 'damaged').length }
        ],
        monthlyTrends: [
          { month: 'May', submitted: 15, resolved: 12 },
          { month: 'Jun', submitted: 20, resolved: 18 },
          { month: 'Jul', submitted: 25, resolved: 22 },
          { month: 'Aug', submitted: 28, resolved: 25 },
          { month: 'Sep', submitted: 32, resolved: 29 },
          { month: 'Oct', submitted: complaints.length, resolved }
        ]
      };
    }
  )
};

export const notificationAPI = {
  getAll: () => callApi(
    () => api.get('/notifications'),
    async () => {
      return {
        success: true,
        unread_count: 1,
        notifications: [
          { id: 1, title_en: 'Complaint SVMS-2026-00001 Updated', title_hi: 'शिकायत SVMS-2026-00001 अपडेट की गई', message_en: 'Status changed to In Progress by worker.', message_hi: 'स्थिति बदलकर कार्य प्रगति पर की गई।', is_read: 0, created_at: new Date().toISOString() }
        ]
      };
    }
  ),
  markRead: (id) => callApi(
    () => api.put(`/notifications/mark-read/${id}`),
    async () => { return { success: true }; }
  )
};

export const metaAPI = {
  getAreas: () => callApi(() => api.get('/meta/areas'), async () => ({ success: true, areas: DEFAULT_AREAS })),
  getDepartments: () => callApi(() => api.get('/meta/departments'), async () => ({ success: true, departments: DEFAULT_DEPARTMENTS })),
  getCategories: () => callApi(() => api.get('/meta/categories'), async () => ({ success: true, categories: DEFAULT_CATEGORIES }))
};

export default api;
