import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { Menu, X, Shield, User, LogOut, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.howItWorks'), path: '/#how-it-works' },
    { name: t('nav.resources'), path: '/resources' },
    { name: t('nav.analytics'), path: '/analytics' },
    { name: t('nav.map'), path: '/#interactive-map' },
    { name: t('nav.team'), path: '/team' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'glass-nav py-3'
        : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-4 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-600 via-emerald-500 to-saffron-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-gov-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-gov-700 via-emerald-600 to-saffron-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent block leading-tight">
                {t('brandName')}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                {t('brandSubtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gov-600 dark:hover:text-emerald-400 ${
                  location.pathname === link.path
                    ? 'text-gov-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated && <NotificationDropdown />}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-Over */}
      {mobileOpen && (
        <div className="lg:hidden glass-card mx-4 mt-3 p-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gov-600 text-white text-sm font-semibold shadow-md"
                >
                  {t('nav.dashboard')} ({user.name})
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full text-center py-2 rounded-xl text-rose-600 border border-rose-200 dark:border-rose-900 text-xs font-semibold"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
