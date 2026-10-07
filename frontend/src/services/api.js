import axios from 'axios';

// Dynamic API Base URL detection for Production/Vercel vs Local Dev
const API_BASE = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inject Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('svms_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
};

export const complaintAPI = {
  submit: (formData) => api.post('/complaints/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  getPublicAll: () => api.get('/complaints/all-public'),
  getAdminAll: (params) => api.get('/complaints/admin/all', { params }),
  track: (id) => api.get(`/complaints/track/${id}`),
  updateStatus: (id, formData) => api.put(`/complaints/admin/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const resourceAPI = {
  getAll: (params) => api.get('/resources/public', { params }),
  getTypes: () => api.get('/resources/types'),
  getDetail: (id) => api.get(`/resources/detail/${id}`),
  create: (formData) => api.post('/resources/admin/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/resources/admin/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/resources/admin/delete/${id}`)
};

export const workerAPI = {
  getAssignedTasks: () => api.get('/workers/assigned'),
  getAllWorkers: () => api.get('/workers/list')
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview')
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/mark-read/${id}`)
};

export const metaAPI = {
  getAreas: () => api.get('/meta/areas'),
  getDepartments: () => api.get('/meta/departments'),
  getCategories: () => api.get('/meta/categories')
};

export default api;
