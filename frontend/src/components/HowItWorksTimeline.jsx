import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FilePlus, Search, UserCheck, Wrench, CheckCircle2 } from 'lucide-react';

export default function HowItWorksTimeline() {
  const { t } = useLanguage();

  const steps = [
    {
      num: 1,
      title: t('howItWorks.step1'),
      desc: t('howItWorks.step1Desc'),
      icon: FilePlus,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30'
    },
    {
      num: 2,
      title: t('howItWorks.step2'),
      desc: t('howItWorks.step2Desc'),
      icon: Search,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30'
    },
    {
      num: 3,
      title: t('howItWorks.step3'),
      desc: t('howItWorks.step3Desc'),
      icon: UserCheck,
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/30'
    },
    {
      num: 4,
      title: t('howItWorks.step4'),
      desc: t('howItWorks.step4Desc'),
      icon: Wrench,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30'
    },
    {
      num: 5,
      title: t('howItWorks.step5'),
      desc: t('howItWorks.step5Desc'),
      icon: CheckCircle2,
      color: 'from-sky-500 to-blue-600',
      shadow: 'shadow-sky-500/30'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gov-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase border border-emerald-500/20 inline-block mb-4">
            Workflow Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-4 text-base text-slate-400">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Connected Line & Cards */}
        <div className="relative">
          {/* Connected Line Background for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <motion.div
            className="hidden lg:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-sky-500 -translate-y-1/2 z-0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="glass-card bg-slate-800/80 border-slate-700 p-6 flex flex-col items-center text-center group hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 shadow-lg ${step.shadow} mb-5 group-hover:rotate-6 transition-transform`}>
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                      <IconComp className="w-7 h-7" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
