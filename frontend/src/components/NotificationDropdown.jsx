import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              {t('notifications.title')}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-gov-600 dark:text-gov-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                {t('notifications.noNotifications')}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 transition-colors ${
                    n.is_read ? 'bg-white dark:bg-slate-900' : 'bg-gov-50/60 dark:bg-slate-800/80 font-medium'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {lang === 'hi' ? n.title_hi : n.title_en}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {lang === 'hi' ? n.message_hi : n.message_en}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
