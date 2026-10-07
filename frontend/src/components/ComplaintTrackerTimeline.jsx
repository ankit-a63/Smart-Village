import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText, Search, UserCheck, Wrench, CheckCircle, Lock,
  Calendar, MapPin, AlertTriangle, User, Shield
} from 'lucide-react';

export default function ComplaintTrackerTimeline({ complaint, history = [] }) {
  const { lang, t } = useLanguage();

  if (!complaint) return null;

  const steps = [
    { key: 'submitted', label: t('tracking.statusSubmitted'), icon: FileText },
    { key: 'under_review', label: t('tracking.statusUnderReview'), icon: Search },
    { key: 'assigned', label: t('tracking.statusAssigned'), icon: UserCheck },
    { key: 'in_progress', label: t('tracking.statusInProgress'), icon: Wrench },
    { key: 'resolved', label: t('tracking.statusResolved'), icon: CheckCircle },
    { key: 'closed', label: t('tracking.statusClosed'), icon: Lock }
  ];

  const statusOrder = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
  const currentIndex = statusOrder.indexOf(complaint.status);

  return (
    <div className="space-y-8">

      {/* Header Info Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-gov-600 dark:text-sky-400 uppercase tracking-widest block">
              {complaint.tracking_id}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {complaint.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              complaint.priority === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
              complaint.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
              'bg-gov-100 text-gov-700 dark:bg-gov-950 dark:text-gov-300'
            }`}>
              {complaint.priority} Priority
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold uppercase">
              {complaint.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar Timeline */}
        <div className="py-4">
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            {/* Active Line */}
            <motion.div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-gov-600 via-emerald-500 to-teal-500 -translate-y-1/2 z-0 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.max(0.05, currentIndex / (steps.length - 1)) }}
              transition={{ duration: 1 }}
            />

            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const isDone = idx <= currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gov-600 text-white ring-4 ring-gov-500/30 scale-110'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 hidden md:block text-center max-w-[80px] ${
                    isCurrent ? 'text-gov-600 dark:text-sky-400 font-extrabold' : isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gov-600 shrink-0" />
              <span>Location: <strong>{complaint.location_address || 'Area Main Road'}</strong> ({lang === 'hi' ? complaint.area_name_hi : complaint.area_name_en})</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Filed On: <strong>{new Date(complaint.created_at).toLocaleDateString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Category: <strong>{lang === 'hi' ? complaint.category_name_hi : complaint.category_name_en}</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Department: <strong>{lang === 'hi' ? complaint.department_name_hi : complaint.department_name_en || 'Pending Assignment'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Worker: <strong>{complaint.worker_name || 'Unassigned'}</strong></span>
            </div>
          </div>
        </div>

        {/* Description & Photos */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Description</h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              {complaint.description}
            </p>
          </div>

          {(complaint.photo_url || complaint.resolution_photo_url) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {complaint.photo_url && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Citizen Issue Photo</span>
                  <img src={`http://localhost:5000${complaint.photo_url}`} alt="Issue" className="w-full h-40 object-cover rounded-xl border" />
                </div>
              )}
              {complaint.resolution_photo_url && (
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 block mb-1">Resolution Work Photo</span>
                  <img src={`http://localhost:5000${complaint.resolution_photo_url}`} alt="Resolution" className="w-full h-40 object-cover rounded-xl border border-emerald-500/40" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {t('tracking.historyHeader')}
          </h3>
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((h) => (
              <div key={h.id} className="pt-3 flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-gov-600 dark:text-sky-400 capitalize">{h.status.replace('_', ' ')}</span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{h.remarks}</p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(h.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
