import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Droplets, Sun, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AnimatedHeroVillage() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full aspect-[4/3] max-w-xl mx-auto flex items-center justify-center">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gov-500/20 via-emerald-500/20 to-saffron-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      {/* SVG Village Vector Canvas */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Sky & Hills */}
        <path d="M0 400 Q200 320 400 370 T800 350 V600 H0 Z" fill="#0f172a" fillOpacity="0.05" />
        <path d="M0 430 Q300 380 600 410 T800 400 V600 H0 Z" fill="#059669" fillOpacity="0.1" />

        {/* Floating Clouds */}
        <motion.g
          animate={{ x: [-20, 30, -20] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M120 120 Q140 100 170 110 T220 120 T240 140 H110 Z" fill="#94a3b8" fillOpacity="0.3" />
          <path d="M520 90 Q540 70 570 80 T620 90 T640 110 H510 Z" fill="#94a3b8" fillOpacity="0.3" />
        </motion.g>

        {/* Sun / Solar Energy */}
        <motion.circle
          cx="680"
          cy="100"
          r="45"
          fill="#f59e0b"
          fillOpacity="0.8"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Smart Roads Network */}
        <path d="M0 520 L800 520" stroke="#334155" strokeWidth="48" strokeLinecap="round" />
        <path d="M0 520 L800 520" stroke="#fbbf24" strokeWidth="4" strokeDasharray="16 16" />

        <path d="M400 520 L400 360" stroke="#475569" strokeWidth="32" />
        <path d="M400 520 L400 360" stroke="#ffffff" strokeWidth="3" strokeDasharray="12 12" />

        {/* Village Houses */}
        {/* House 1: Panchayat Bhawan */}
        <g transform="translate(140, 320)">
          <rect x="0" y="40" width="110" height="70" rx="4" fill="#0284c7" />
          <polygon points="-10,40 55,5 120,40" fill="#0369a1" />
          <rect x="40" y="70" width="30" height="40" fill="#e0effe" />
          {/* Flag */}
          <line x1="55" y1="5" x2="55" y2="-25" stroke="#94a3b8" strokeWidth="3" />
          <polygon points="55,-25 80,-17 55,-9" fill="#ff9933" />
        </g>

        {/* House 2: Govt Primary School */}
        <g transform="translate(280, 290)">
          <rect x="0" y="50" width="130" height="80" rx="4" fill="#059669" />
          <polygon points="-10,50 65,10 140,50" fill="#047857" />
          <rect x="50" y="80" width="30" height="50" fill="#d1fae5" />
          <text x="65" y="40" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">SCHOOL</text>
        </g>

        {/* House 3: Primary Health Centre */}
        <g transform="translate(480, 310)">
          <rect x="0" y="45" width="110" height="75" rx="4" fill="#dc2626" />
          <polygon points="-10,45 55,10 120,45" fill="#b91c1c" />
          <rect x="42" y="75" width="26" height="45" fill="#fee2e2" />
          {/* Medical Cross */}
          <rect x="47" y="22" width="16" height="5" fill="#ffffff" />
          <rect x="52.5" y="16.5" width="5" height="16" fill="#ffffff" />
        </g>

        {/* Water Tank Tower with Water Level Indicator */}
        <g transform="translate(630, 260)">
          {/* Legs */}
          <line x1="20" y1="130" x2="35" y2="230" stroke="#64748b" strokeWidth="6" />
          <line x1="80" y1="130" x2="65" y2="230" stroke="#64748b" strokeWidth="6" />
          <line x1="25" y1="170" x2="75" y2="170" stroke="#64748b" strokeWidth="4" />
          {/* Tank Main */}
          <rect x="15" y="40" width="70" height="90" rx="10" fill="#0284c7" />
          {/* Animated Water Level */}
          <motion.rect
            x="20"
            y="60"
            width="60"
            height="65"
            rx="4"
            fill="#38bdf8"
            animate={{ height: [50, 68, 50] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <text x="50" y="30" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">92% WATER</text>
        </g>

        {/* Solar Panels */}
        <g transform="translate(150, 430)">
          <polygon points="0,20 40,0 80,20 40,40" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <line x1="20" y1="10" x2="60" y2="30" stroke="#38bdf8" strokeWidth="1" />
        </g>

        {/* Street Lights (Glowing Animation) */}
        {/* Pole 1 */}
        <g transform="translate(260, 420)">
          <line x1="0" y1="0" x2="0" y2="75" stroke="#475569" strokeWidth="5" />
          <path d="M0 0 Q10 -10 20 -5" stroke="#475569" strokeWidth="4" fill="none" />
          <motion.circle
            cx="20"
            cy="-5"
            r="8"
            fill="#fbbf24"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* Pole 2 */}
        <g transform="translate(460, 420)">
          <line x1="0" y1="0" x2="0" y2="75" stroke="#475569" strokeWidth="5" />
          <path d="M0 0 Q-10 -10 -20 -5" stroke="#475569" strokeWidth="4" fill="none" />
          <motion.circle
            cx="-20"
            cy="-5"
            r="8"
            fill="#fbbf24"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </g>

        {/* Trees (Slight Wind Sway) */}
        <motion.g
          transform="translate(80, 410)"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="18" y="50" width="10" height="35" fill="#78350f" />
          <circle cx="23" cy="35" r="28" fill="#059669" />
          <circle cx="10" cy="45" r="20" fill="#10b981" />
        </motion.g>

        {/* Moving Car / EV */}
        <motion.g
          animate={{ x: [0, 650, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <rect x="60" y="500" width="50" height="18" rx="6" fill="#2563eb" />
          <circle cx="75" cy="518" r="6" fill="#0f172a" />
          <circle cx="98" cy="518" r="6" fill="#0f172a" />
        </motion.g>

        {/* Location Markers */}
        <g transform="translate(200, 270)">
          <motion.g
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="0" cy="0" r="14" fill="#059669" />
            <path d="M0 -6 L4 2 L-4 2 Z" fill="#ffffff" />
          </motion.g>
        </g>
      </svg>

      {/* Floating Animated Dashboard Badge Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-4 -left-4 glass-card p-3.5 shadow-2xl flex items-center gap-3 border border-emerald-500/30"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            {t('hero.activeComplaints')}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            94.2% Resolved
          </span>
        </div>
      </motion.div>

      {/* Floating Animated Dashboard Badge Card 2 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute -bottom-4 -right-4 glass-card p-3.5 shadow-2xl flex items-center gap-3 border border-gov-500/30"
      >
        <div className="w-10 h-10 rounded-xl bg-gov-500/10 flex items-center justify-center text-gov-600 dark:text-gov-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            Smart Grid Status
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            100% Streetlights Active
          </span>
        </div>
      </motion.div>

    </div>
  );
}
