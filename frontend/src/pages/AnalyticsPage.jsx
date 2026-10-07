import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyticsAPI } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#0284c7', '#059669', '#f59e0b', '#7c3aed', '#ec4899', '#06b6d4', '#e11d48', '#64748b'];

export default function AnalyticsPage() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getOverview()
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen pt-32 p-8 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  const categoryChartData = data.categoryStats.map(c => ({
    name: lang === 'hi' ? c.name_hi : c.name_en,
    count: c.count
  }));

  const areaChartData = data.areaStats.map(a => ({
    name: lang === 'hi' ? a.name_hi : a.name_en,
    [t('analytics.logged')]: a.count,
    [t('analytics.resolved')]: a.resolved_count
  }));

  const resourceStatusData = data.resourceStatusStats.map(r => ({
    name: r.condition_status.replace('_', ' ').toUpperCase(),
    value: r.count
  }));

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-gov-600/10 text-gov-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
          Real-time Analytics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('analytics.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('analytics.subtitle')}
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <span className="text-3xl font-black text-gov-600 block">{data.metrics.totalComplaints}</span>
          <span className="text-xs font-semibold text-slate-500 block mt-1">{t('stats.totalComplaints')}</span>
        </div>
        <div className="glass-card p-5 text-center">
          <span className="text-3xl font-black text-emerald-600 block">{data.metrics.resolutionRate}%</span>
          <span className="text-xs font-semibold text-slate-500 block mt-1">{t('stats.resolvedRate')}</span>
        </div>
        <div className="glass-card p-5 text-center">
          <span className="text-3xl font-black text-purple-600 block">{data.metrics.avgResolutionHours}h</span>
          <span className="text-xs font-semibold text-slate-500 block mt-1">{t('stats.avgTime')}</span>
        </div>
        <div className="glass-card p-5 text-center">
          <span className="text-3xl font-black text-amber-600 block">{data.metrics.totalResources}</span>
          <span className="text-xs font-semibold text-slate-500 block mt-1">{t('stats.activeResources')}</span>
        </div>
      </div>

      {/* Chart Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaints by Category */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('analytics.byCategory')}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Area / Ward */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('analytics.byArea')}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey={t('analytics.logged')} fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey={t('analytics.resolved')} fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('analytics.monthlyTrend')}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submitted" stroke="#0284c7" strokeWidth={3} name={t('analytics.logged')} />
                <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={3} name={t('analytics.resolved')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Public Asset Health Distribution */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('analytics.resourceHealth')}
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {resourceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
