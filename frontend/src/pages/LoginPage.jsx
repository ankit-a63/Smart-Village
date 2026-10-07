import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import { Shield, UserCheck, Wrench, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast(t('auth.emailLabel') + ' & ' + t('auth.passwordLabel') + ' required', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        login(res.data.user, res.data.token);
        addToast(t('auth.loginTitle') + ' ' + res.data.user.name, 'success');
        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.role === 'worker') navigate('/worker');
        else navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.response?.data?.message_en || t('auth.invalidCreds'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCreds = (demoEmail, role) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gov-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="glass-card p-4 space-y-2 border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {t('auth.demoLoginNotice')}
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setDemoCreds('admin@smartvillage.gov.in', 'admin')}
              className="px-2 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold transition-all flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setDemoCreds('worker.road@smartvillage.gov.in', 'worker')}
              className="px-2 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold transition-all flex items-center justify-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Worker</span>
            </button>
            <button
              onClick={() => setDemoCreds('citizen@smartvillage.gov.in', 'citizen')}
              className="px-2 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold transition-all flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              {t('auth.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@smartvillage.gov.in"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              {t('auth.passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? t('common.loading') : t('auth.loginBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-gov-600 font-bold hover:underline">
            {t('auth.registerBtn')}
          </Link>
        </p>

      </div>
    </div>
  );
}
