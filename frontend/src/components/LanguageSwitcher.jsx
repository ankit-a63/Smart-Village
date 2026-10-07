import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
      <Globe className="w-4 h-4 ml-2 text-slate-500 dark:text-slate-400" />
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
          lang === 'en'
            ? 'bg-gov-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-gov-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
          lang === 'hi'
            ? 'bg-gov-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-gov-600'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
