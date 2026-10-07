import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { complaintAPI, resourceAPI, workerAPI, analyticsAPI, metaAPI } from '../services/api';
import {
  LayoutDashboard, FileText, Wrench, Users, BarChart3, Settings,
  Search, Filter, CheckCircle, Clock, AlertTriangle, UserPlus, Edit, Trash2, Plus, Shield
} from 'lucide-react';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [resources, setResources] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioFilter, setPrioFilter] = useState('');

  // Modals
  const [editComplaint, setEditComplaint] = useState(null);
  const [workerAssignId, setWorkerAssignId] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  // Resource Form Modal
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resForm, setResForm] = useState({ name_en: '', name_hi: '', resource_type_id: '1', area_id: '1', condition_status: 'active', description: '' });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [compRes, resRes, workRes, deptRes, areaRes, metaRes] = await Promise.all([
        complaintAPI.getAdminAll(),
        resourceAPI.getAll(),
        workerAPI.getAllWorkers(),
        metaAPI.getDepartments(),
        metaAPI.getAreas(),
        analyticsAPI.getOverview()
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (resRes.data.success) setResources(resRes.data.resources);
      if (workRes.data.success) setWorkers(workRes.data.workers);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);
      if (areaRes.data.success) setAreas(areaRes.data.areas);
      if (metaRes.data.success) setMetrics(metaRes.data.metrics);
    } catch (err) {
      console.error(err);
      addToast(t('common.errorMsg'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!editComplaint) return;
    setUpdating(true);

    try {
      const formData = new FormData();
      if (statusVal) formData.append('status', statusVal);
      if (workerAssignId) formData.append('assigned_worker_id', workerAssignId);
      if (adminRemarks) formData.append('admin_remarks', adminRemarks);

      const res = await complaintAPI.updateStatus(editComplaint.id, formData);
      if (res.data.success) {
        addToast(t('admin.updateStatus') + ' Success!', 'success');
        setEditComplaint(null);
        loadAllAdminData();
      }
    } catch (err) {
      addToast(t('common.errorMsg'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name_en', resForm.name_en);
      formData.append('name_hi', resForm.name_hi || resForm.name_en);
      formData.append('resource_type_id', resForm.resource_type_id);
      formData.append('area_id', resForm.area_id);
      formData.append('condition_status', resForm.condition_status);
      formData.append('description', resForm.description);

      const res = await resourceAPI.create(formData);
      if (res.data.success) {
        addToast('Public Resource Added!', 'success');
        setShowResourceModal(false);
        loadAllAdminData();
      }
    } catch (err) {
      addToast(t('common.errorMsg'), 'error');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await resourceAPI.delete(id);
      addToast('Resource deleted', 'success');
      loadAllAdminData();
    } catch (err) {
      addToast(t('common.errorMsg'), 'error');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (prioFilter && c.priority !== prioFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return c.tracking_id.toLowerCase().includes(term) || c.title.toLowerCase().includes(term) || c.citizen_name?.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">

      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 glass-card p-4 h-fit space-y-2 shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-gov-600 dark:text-sky-400" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            {t('nav.dashboard')}
          </span>
        </div>

        {[
          { id: 'complaints', label: t('admin.tabs.complaints'), icon: FileText },
          { id: 'resources', label: t('admin.tabs.resources'), icon: Wrench },
          { id: 'workers', label: t('admin.tabs.workers'), icon: Users }
        ].map(tItem => {
          const IconComp = tItem.icon;
          return (
            <button
              key={tItem.id}
              onClick={() => setActiveTab(tItem.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tItem.id
                  ? 'bg-gov-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">

        {/* Tab 1: Complaints Management */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {t('admin.title')}
                </h1>
                <p className="text-xs text-slate-500">{t('admin.subtitle')}</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">{t('admin.allStatuses')}</option>
                  <option value="submitted">{t('tracking.statusSubmitted')}</option>
                  <option value="assigned">{t('tracking.statusAssigned')}</option>
                  <option value="in_progress">{t('tracking.statusInProgress')}</option>
                  <option value="resolved">{t('tracking.statusResolved')}</option>
                  <option value="closed">{t('tracking.statusClosed')}</option>
                </select>
              </div>
            </div>

            {/* Complaints Table / Mobile Cards */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">{t('admin.table.id')}</th>
                      <th className="p-3.5">{t('admin.table.citizen')}</th>
                      <th className="p-3.5">{t('admin.table.title')}</th>
                      <th className="p-3.5">{t('admin.table.priority')}</th>
                      <th className="p-3.5">{t('admin.table.worker')}</th>
                      <th className="p-3.5">{t('admin.table.status')}</th>
                      <th className="p-3.5">{t('admin.table.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-gov-600 dark:text-sky-400">{c.tracking_id}</td>
                        <td className="p-3.5 font-medium">{c.citizen_name}</td>
                        <td className="p-3.5 font-bold max-w-xs truncate">{c.title}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            c.priority === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-gov-100 text-gov-700'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-3.5">{c.worker_name || '—'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setEditComplaint(c);
                              setWorkerAssignId(c.assigned_worker_id || '');
                              setStatusVal(c.status);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-gov-600 text-white font-bold text-[11px] hover:bg-gov-700"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Public Resources CRUD */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('resources.title')}
              </h2>
              <button
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <Plus className="w-4 h-4" />
                {t('resources.addResourceBtn')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(res => (
                <div key={res.id} className="glass-card p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gov-600">{res.resource_code}</span>
                    <button onClick={() => handleDeleteResource(res.id)} className="text-rose-500 hover:text-rose-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {lang === 'hi' ? res.name_hi : res.name_en}
                  </h4>
                  <p className="text-xs text-slate-500">{res.location_address}</p>
                  <div className="pt-2 border-t flex justify-between items-center text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                      {res.condition_status}
                    </span>
                    <span className="text-slate-400">{lang === 'hi' ? res.area_name_hi : res.area_name_en}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Village Workers List */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Village Infrastructure Workers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workers.map(w => (
                <div key={w.id} className="glass-card p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{w.name}</h4>
                    <span className="text-xs font-bold text-gov-600">{lang === 'hi' ? w.department_name_hi : w.department_name_en}</span>
                  </div>
                  <p className="text-xs text-slate-500">{w.email} • {w.phone}</p>
                  <div className="pt-2 border-t flex justify-between text-xs font-semibold text-slate-600">
                    <span>Active Tasks: {w.active_tasks}</span>
                    <span>Completed: {w.completed_tasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Edit Complaint Admin Modal */}
      {editComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateComplaint} className="glass-card p-6 w-full max-w-lg space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Update Complaint: {editComplaint.tracking_id}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.assignWorker')}</label>
              <select
                value={workerAssignId}
                onChange={e => setWorkerAssignId(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              >
                <option value="">{t('admin.unassigned')}</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({lang === 'hi' ? w.department_name_hi : w.department_name_en})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.updateStatus')}</label>
              <select
                value={statusVal}
                onChange={e => setStatusVal(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              >
                <option value="submitted">{t('tracking.statusSubmitted')}</option>
                <option value="under_review">{t('tracking.statusUnderReview')}</option>
                <option value="assigned">{t('tracking.statusAssigned')}</option>
                <option value="in_progress">{t('tracking.statusInProgress')}</option>
                <option value="resolved">{t('tracking.statusResolved')}</option>
                <option value="closed">{t('tracking.statusClosed')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.addRemark')}</label>
              <textarea
                rows={3}
                value={adminRemarks}
                onChange={e => setAdminRemarks(e.target.value)}
                placeholder="Enter remarks or instructions..."
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditComplaint(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 rounded-xl bg-gov-600 text-white font-bold text-xs"
              >
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveResource} className="glass-card p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {t('resources.addResourceBtn')}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Resource Name (English)</label>
              <input
                type="text"
                required
                value={resForm.name_en}
                onChange={e => setResForm({ ...resForm, name_en: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Resource Name (Hindi)</label>
              <input
                type="text"
                value={resForm.name_hi}
                onChange={e => setResForm({ ...resForm, name_hi: e.target.value })}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResourceModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
