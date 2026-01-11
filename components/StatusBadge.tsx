
import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
  status: Status | 'idle';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'malicious':
      case 'hit':
        return 'bg-maroon-50 text-maroon-700 border-maroon-200 dark:bg-maroon-950/40 dark:text-maroon-400 dark:border-maroon-900';
      case 'suspicious':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'clean':
      case 'ok':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'error':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      case 'idle':
        return 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900/50 dark:text-slate-600 dark:border-slate-800';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'malicious':
      case 'hit':
        return '󱓇'; // Warning/Danger icon placeholder
      case 'suspicious':
      case 'error':
        return '󰀦';
      case 'clean':
      case 'ok':
        return '󰗠';
      case 'idle':
        return '󰔟';
      default:
        return '•';
    }
  };

  const label = status === 'idle' ? 'Ready' : status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold border transition-all duration-300 ${getStyles()}`}>
      <span className="uppercase tracking-widest">{label}</span>
    </span>
  );
};
