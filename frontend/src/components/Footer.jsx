import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-600 via-emerald-500 to-saffron-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block">
                  {t('brandName')}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest block">
                  {t('brandSubtitle')}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-emerald-400 transition-colors">{t('nav.howItWorks')}</Link></li>
              <li><Link to="/resources" className="hover:text-emerald-400 transition-colors">{t('nav.resources')}</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400 transition-colors">{t('nav.analytics')}</Link></li>
              <li><Link to="/team" className="hover:text-emerald-400 transition-colors">{t('nav.team')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gov-500 pl-3">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/complaint/new" className="hover:text-emerald-400 transition-colors">{t('hero.reportButton')}</Link></li>
              <li><Link to="/track" className="hover:text-emerald-400 transition-colors">{t('tracking.title')}</Link></li>
              <li><Link to="/resources" className="hover:text-emerald-400 transition-colors">{t('nav.resources')}</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">{t('nav.login')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-saffron-500 pl-3">
              {t('footer.contactInfo')}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gram Panchayat Bhawan, Central Sector Ward #2, Smart Village</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gov-400 shrink-0" />
                <span>+91 1800-SMART-VILLAGE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>helpdesk@smartvillage.gov.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SMART VILLAGE Management System. {t('footer.rights')}</p>
          <p className="flex items-center gap-1">
            <span>Built for Smarter & Better Villages with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
