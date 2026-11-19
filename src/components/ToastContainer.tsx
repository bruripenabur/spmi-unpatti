import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (toast.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-100';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40 bg-rose-950/95 text-rose-100';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'info') {
          borderClass = 'border-cyan-500/40 bg-slate-900/95 text-cyan-100';
          Icon = Info;
          iconColor = 'text-cyan-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold tracking-tight leading-snug">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-xs opacity-90 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
