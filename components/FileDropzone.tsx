import React, { useState, useCallback } from 'react';

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    loading: boolean;
    disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, loading, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
    }, [disabled, onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    }, [onFileSelect]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group w-full min-h-[300px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-500 ${isDragging
                ? 'border-maroon-600 bg-maroon-50/10 dark:bg-maroon-900/10 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-800/50 hover:border-maroon-400 dark:hover:border-maroon-800/50 bg-slate-50/30 dark:bg-slate-900/20'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                disabled={disabled}
            />

            {/* Central Icon / Illustration */}
            <div className={`relative transition-transform duration-500 ${isDragging ? 'rotate-12 scale-110' : 'group-hover:scale-105'}`}>
                <div className={`w-28 h-28 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 shadow-2xl transition-all ${isDragging ? 'border-maroon-500 shadow-maroon-500/20' : ''
                    }`}>
                    <svg className={`w-14 h-14 ${isDragging ? 'text-maroon-600' : 'text-slate-400 dark:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <circle cx="12" cy="14" r="3" strokeWidth={2} />
                        <path d="M12 11v6m-3-3h6" strokeWidth={2} />
                    </svg>
                </div>
                {/* Scanner bar effect */}
                <div className={`absolute top-1/2 left-[-10px] right-[-10px] h-[2px] bg-maroon-500/50 shadow-[0_0_15px_rgba(153,27,27,0.5)] transition-all duration-1000 animate-scan pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <div className="text-center space-y-4">
                <label
                    htmlFor="file-upload"
                    className={`inline-block px-10 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 shadow-lg hover:border-maroon-500 hover:text-maroon-600 transition-all cursor-pointer ${disabled ? 'pointer-events-none opacity-50' : 'active:scale-95'
                        }`}
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 animate-spin text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        'Choose file'
                    )}
                </label>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                        {isDragging ? 'Drop it here' : 'Drop file here'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-tighter">
                        Max Payload: 32MB
                    </p>
                </div>
            </div>

            {/* Terms Disclaimer matching screenshot */}
            <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-sm text-center font-medium leading-relaxed mt-4">
                By submitting data above, you are agreeing to our <span className="text-slate-500 underline underline-offset-2">Terms of Service</span> and <span className="text-slate-500 underline underline-offset-2">Privacy Notice</span>. Please do not submit any personal information.
            </p>
        </div>
    );
};
