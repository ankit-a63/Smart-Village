import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { workerAPI, complaintAPI } from '../services/api';
import { Wrench, CheckCircle, Clock, MapPin, Upload, AlertCircle } from 'lucide-react';

export default function WorkerDashboard() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState('in_progress');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await workerAPI.getAssignedTasks();
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      if (notes) formData.append('worker_notes', notes);
      if (photo) formData.append('resolution_photo', photo);

      const res = await complaintAPI.updateStatus(selectedTask.id, formData);
      if (res.data.success) {
        addToast(t('worker.updateStatusBtn') + ' Success!', 'success');
        setSelectedTask(null);
        setPhoto(null);
        setNotes('');
        fetchTasks();
      }
    } catch (err) {
      addToast(t('common.errorMsg'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Worker Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-gov-700 text-white flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-200 block">
            {t('worker.title')}
          </span>
          <h1 className="text-2xl font-black mt-1">
            {t('worker.welcome')} {user?.name}
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            Department Technician • Assigned Ward #{user?.area_id}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
          <Wrench className="w-6 h-6" />
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('worker.activeTasks')} ({tasks.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-slate-500">{t('common.loading')}</div>
        ) : tasks.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">
            {t('common.noData')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((tItem) => (
              <div key={tItem.id} className="glass-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gov-600">{tItem.tracking_id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    tItem.priority === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {tItem.priority}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{tItem.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{tItem.description}</p>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gov-600" />
                    <span>Location: <strong>{tItem.location_address}</strong></span>
                  </p>
                  <p>Citizen: <strong>{tItem.citizen_name}</strong> ({tItem.citizen_phone})</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedTask(tItem);
                    setStatus(tItem.status === 'assigned' ? 'in_progress' : tItem.status);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                >
                  {t('worker.updateStatusBtn')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateProgress} className="glass-card p-6 w-full max-w-lg space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {t('worker.updateStatusBtn')}: {selectedTask.tracking_id}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('admin.table.status')}</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              >
                <option value="in_progress">{t('worker.statusInProgress')}</option>
                <option value="resolved">{t('worker.statusResolved')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Work Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('worker.workNotesPlaceholder')}
                className="w-full p-2.5 rounded-xl border bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('worker.uploadResolutionPhoto')}</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files[0])}
                className="w-full text-xs text-slate-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                {t('worker.markCompleted')}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
