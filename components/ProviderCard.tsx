
import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { Status } from '../types';

interface ProviderCardProps {
  name: string;
  status: Status | 'idle';
  summary?: string;
  details?: any;
  loading?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ name, status, summary, details, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isIdle = status === 'idle';

  return (
    <div className={`relative bg-white dark:bg-slate-900 border transition-all duration-500 rounded-2xl overflow-hidden shadow-sm ${
      isIdle 
        ? 'border-slate-200 dark:border-slate-800 opacity-60 grayscale' 
        : 'border-maroon-100 dark:border-maroon-900/50 ring-1 ring-maroon-500/5'
    }`}>
      {loading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-tighter text-maroon-800 dark:text-maroon-400">
              {name}
            </h3>
            <span className="text-[9px] text-slate-400 font-medium">Security Module</span>
          </div>
          <StatusBadge status={status} />
        </div>
        
        <div className="min-h-[40px] flex items-center">
          <p className={`text-sm leading-relaxed ${isIdle ? 'text-slate-300 italic' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
            {isIdle ? 'Awaiting scan target...' : summary}
          </p>
        </div>

        {!isIdle && details && (
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-maroon-600 hover:bg-maroon-50 dark:hover:bg-maroon-900/20 transition-all flex items-center justify-between"
            >
              <span>{isOpen ? 'Close Raw' : 'Inspection Data'}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="mt-3 animate-in zoom-in-95 fade-in duration-200">
                <pre className="mono text-[10px] bg-slate-900 p-3 rounded-lg overflow-x-auto text-maroon-200 leading-tight border border-maroon-900/30">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
