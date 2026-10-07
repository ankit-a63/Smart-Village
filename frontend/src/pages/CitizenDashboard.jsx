import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import MultiStepComplaintForm from '../components/MultiStepComplaintForm';
import ComplaintTrackerTimeline from '../components/ComplaintTrackerTimeline';
import { Plus, ListFilter, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CitizenDashboard() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchMyComplaints = async () => {
    try {
      const res = await complaintAPI.getMyComplaints();
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleOpenTracker = async (comp) => {
    setSelectedComplaint(comp);
    try {
      const res = await complaintAPI.track(comp.tracking_id);
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = complaints.filter(c => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return ['submitted', 'under_review'].includes(c.status);
    if (filterStatus === 'in_progress') return ['assigned', 'in_progress'].includes(c.status);
    if (filterStatus === 'resolved') return ['resolved', 'closed'].includes(c.status);
    return true;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-gov-600 to-emerald-600 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 block">
            Citizen Governance Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {t('citizenDashboard.welcome')} {user?.name}
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            {user?.email} • Area: Ward #{user?.area_id}
          </p>
        </div>

        <button
          onClick={() => setShowFormModal(true)}
          className="px-6 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-gov-600" />
          <span>{t('citizenDashboard.newComplaintBtn')}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logged', count: complaints.length, color: 'text-gov-600' },
          { label: 'Pending Review', count: complaints.filter(c => ['submitted', 'under_review'].includes(c.status)).length, color: 'text-amber-600' },
          { label: 'Work In Progress', count: complaints.filter(c => ['assigned', 'in_progress'].includes(c.status)).length, color: 'text-purple-600' },
          { label: 'Resolved Issues', count: complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length, color: 'text-emerald-600' }
        ].map((st, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <span className={`text-2xl font-black ${st.color} block`}>{st.count}</span>
            <span className="text-xs font-semibold text-slate-500 block mt-1">{st.label}</span>
          </div>
        ))}
      </div>

      {/* Complaints List & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {t('citizenDashboard.myComplaintsTitle')}
          </h2>

          <div className="flex gap-2">
            {[
              { id: 'all', label: t('citizenDashboard.filterAll') },
              { id: 'pending', label: t('citizenDashboard.filterPending') },
              { id: 'in_progress', label: t('citizenDashboard.filterInProgress') },
              { id: 'resolved', label: t('citizenDashboard.filterResolved') }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === f.id
                    ? 'bg-gov-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">{t('common.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 space-y-3">
            <p>{t('citizenDashboard.emptyState')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((comp) => (
              <div
                key={comp.id}
                onClick={() => handleOpenTracker(comp)}
                className="glass-card p-5 hover:border-gov-500 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gov-600 dark:text-sky-400">
                    {comp.tracking_id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {comp.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-gov-600 transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Area: {lang === 'hi' ? comp.area_name_hi : comp.area_name_en}</span>
                  <span className="flex items-center gap-1 font-semibold text-gov-600 dark:text-sky-400">
                    <Eye className="w-3.5 h-3.5" />
                    Track Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 relative">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center"
            >
              ✕
            </button>
            <MultiStepComplaintForm onSuccess={() => { fetchMyComplaints(); }} />
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 relative">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center"
            >
              ✕
            </button>
            <ComplaintTrackerTimeline complaint={selectedComplaint} history={history} />
          </div>
        </div>
      )}

    </div>
  );
}
