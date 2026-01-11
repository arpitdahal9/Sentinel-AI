import React from 'react';
import { VendorResult } from '../types';

interface VendorGridProps {
    results: Record<string, VendorResult>;
}

export const VendorGrid: React.FC<VendorGridProps> = ({ results }) => {
    const vendors = Object.entries(results).sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-6">
            {vendors.map(([name, vendorData]) => {
                const data = vendorData as VendorResult;
                const isMalicious = data.category === 'malicious' || data.category === 'suspicious';
                const isUndetected = data.category === 'undetected' || data.category === 'harmless' || data.result === 'clean';

                return (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-maroon-600 transition-colors">
                                {name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isMalicious ? 'bg-maroon-600' : isUndetected ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}>
                                {isUndetected ? (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : isMalicious ? (
                                    <span className="text-white text-[8px] font-black">!</span>
                                ) : null}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isMalicious ? 'text-maroon-700 dark:text-maroon-400' : isUndetected ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                {data.category === 'undetected' ? 'Undetected' : data.result || data.category}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
