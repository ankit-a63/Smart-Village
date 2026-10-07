import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Shield, CheckCircle, Code, MapPin, Database, BarChart3 } from 'lucide-react';

export default function TeamContributionPage() {
  const { lang, t } = useLanguage();

  const members = [
    {
      role: 'Member 1: Citizen Portal Lead',
      name: 'Priya Sharma (Frontend Specialist)',
      module: 'Citizen Portal & Complaint Reporting Workflow',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      tasks: [
        'Multi-step complaint submission form with category selection & priority rating.',
        'Browser HTML5 Geolocation API integration with manual fallback.',
        'Real-time complaint tracking timeline component with live status badges.',
        'Full Hindi & English bilingual translation context integration.'
      ]
    },
    {
      role: 'Member 2: Admin Governance Lead',
      name: 'Rahul Verma (Full Stack Dev)',
      module: 'Gram Panchayat Admin Portal & Worker Assignment',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      tasks: [
        'Admin dashboard with full complaint lifecycle controls and status filters.',
        'Dynamic worker & department auto-routing and manual re-assignment.',
        'Admin remarks & resolution verification system.',
        'Role-based route protection middleware for Admin & Worker views.'
      ]
    },
    {
      role: 'Member 3: Resource & Mapping Specialist',
      name: 'Amit Patel (GIS & Asset Dev)',
      module: 'Public Resource Management & Leaflet Interactive Map',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
      tasks: [
        'Interactive Leaflet vector map with custom SVG markers for handpumps, streetlights, schools, health centers.',
        'Public resource inventory CRUD (Handpumps, Streetlights, Water Tanks, Schools).',
        'Asset condition tracking (Active, Needs Maintenance, Damaged).',
        'Filtering map markers by infrastructure type and village ward.'
      ]
    },
    {
      role: 'Member 4: Backend & Database Architect',
      name: 'Suresh Kumar (Backend Engineer)',
      module: 'Express REST APIs & Database Architecture',
      icon: Database,
      color: 'from-amber-500 to-orange-600',
      tasks: [
        'Express.js REST API server with JWT authentication & bcrypt password hashing.',
        'MySQL production schema.sql + seed.sql and zero-config SQLite adapter fallback.',
        'Multer file upload middleware for complaint & resolution photo attachments.',
        'Structured REST endpoints (/auth, /complaints, /resources, /workers, /analytics, /notifications).'
      ]
    },
    {
      role: 'Member 5: Analytics & QA Specialist',
      name: 'Neha Gupta (UI/UX & Data Analyst)',
      module: 'Analytics Engine, Scroll Animations & Testing',
      icon: BarChart3,
      color: 'from-rose-500 to-pink-600',
      tasks: [
        'Recharts analytics engine for category distribution, area resolution rate, and monthly trends.',
        'Framer Motion scroll reveal animations & vector Smart Village hero graphics.',
        'Dark/Light mode theme system with persistent preferences.',
        'End-to-end integration testing across all 25 test flows.'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-gov-600/10 text-gov-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
          Academic & Engineering Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('team.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('team.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {members.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div key={idx} className="glass-card p-6 sm:p-8 space-y-4 hover:border-gov-500 transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${m.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gov-600 dark:text-sky-400 uppercase tracking-widest block">
                      {m.role}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {m.name}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {m.module}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {m.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
