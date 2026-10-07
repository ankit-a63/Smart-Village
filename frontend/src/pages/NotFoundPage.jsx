import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-40 pb-20 flex items-center justify-center px-4">
      <div className="glass-card p-10 text-center max-w-md space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">Page Not Found</h2>
        <p className="text-xs text-slate-500">The requested page does not exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gov-600 text-white font-bold text-xs shadow-md hover:bg-gov-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
