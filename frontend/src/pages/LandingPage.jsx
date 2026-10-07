import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AnimatedHeroVillage from '../components/AnimatedHeroVillage';
import HowItWorksTimeline from '../components/HowItWorksTimeline';
import InteractiveVillageMap from '../components/InteractiveVillageMap';
import { analyticsAPI } from '../services/api';
import {
  Truck, Droplets, Zap, Sun, Trash2, Filter, Building2, HelpCircle,
  ShieldCheck, CheckCircle2, TrendingUp, Users, Wrench, ArrowRight, Activity
} from 'lucide-react';

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const [metrics, setMetrics] = useState({
    totalComplaints: 30,
    resolutionRate: 94,
    totalResources: 25,
    avgResolutionHours: 18.4,
    totalCitizens: 15,
    totalWorkers: 5
  });

  useEffect(() => {
    analyticsAPI.getOverview()
      .then(res => {
        if (res.data.success) {
          setMetrics(res.data.metrics);
        }
      })
      .catch(() => {});
  }, []);

  const problems = [
    { title: t('problems.road'), icon: Truck, color: 'from-amber-500 to-orange-600' },
    { title: t('problems.water'), icon: Droplets, color: 'from-blue-500 to-cyan-600' },
    { title: t('problems.electricity'), icon: Zap, color: 'from-yellow-500 to-amber-600' },
    { title: t('problems.streetLight'), icon: Sun, color: 'from-sky-500 to-blue-600' },
    { title: t('problems.sanitation'), icon: Trash2, color: 'from-emerald-500 to-teal-600' },
    { title: t('problems.drainage'), icon: Filter, color: 'from-purple-500 to-indigo-600' }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-600/10 border border-gov-600/20 text-gov-700 dark:text-sky-400 text-xs font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gov-600 dark:text-sky-400" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/complaint/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gov-600 via-gov-700 to-emerald-600 text-white font-extrabold text-sm shadow-xl hover:shadow-gov-600/30 hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>{t('hero.reportButton')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                >
                  {t('hero.exploreButton')}
                </a>
              </div>

              {/* Tagline */}
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2 italic">
                “{t('tagline')}”
              </p>
            </motion.div>

            {/* Right Animated Village Illustration & Floating Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <AnimatedHeroVillage />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Smart Village Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-gov-500/5">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              {t('intro.badge')}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('intro.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('intro.description')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Problems We Solve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('problems.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {t('problems.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob, idx) => {
            const IconComponent = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 flex items-start gap-4 hover:scale-105 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${prob.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:rotate-6 transition-transform`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-gov-600 dark:group-hover:text-emerald-400 transition-colors">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Report issues with instant photo & GPS upload. Direct auto-routing to village technician.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works Timeline */}
      <HowItWorksTimeline />

      {/* 5. Live Statistics & Animated Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: t('stats.totalComplaints'), val: metrics.totalComplaints, icon: Activity, color: 'text-gov-600' },
            { label: t('stats.resolvedRate'), val: `${metrics.resolutionRate}%`, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: t('stats.activeResources'), val: metrics.totalResources, icon: Wrench, color: 'text-amber-600' },
            { label: t('stats.avgTime'), val: `${metrics.avgResolutionHours}h`, icon: TrendingUp, color: 'text-purple-600' },
            { label: t('stats.citizensServed'), val: metrics.totalCitizens, icon: Users, color: 'text-blue-600' },
            { label: t('stats.activeWorkers'), val: metrics.totalWorkers, icon: ShieldCheck, color: 'text-teal-600' }
          ].map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-5 text-center space-y-2"
              >
                <IconComp className={`w-6 h-6 mx-auto ${stat.color}`} />
                <span className="text-2xl font-black text-slate-900 dark:text-white block">
                  {stat.val}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Interactive Village Map */}
      <InteractiveVillageMap />

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-gov-700 via-emerald-700 to-teal-800 text-white p-10 sm:p-16 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Make Your Village Smarter & Cleaner?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Join thousands of village citizens and Gram Panchayat leaders utilizing digital governance for rapid problem resolution.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all"
              >
                Register as Citizen
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl transition-all"
              >
                Admin & Worker Login
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
