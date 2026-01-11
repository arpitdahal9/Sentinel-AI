import React, { useState } from 'react';
import { AppState, VirusTotalResult, ScannerMode } from './types';
import { checkVirusTotalId, checkVirusTotalFile } from './lib/virustotal';
import { VendorGrid } from './components/VendorGrid';
import { FileDropzone } from './components/FileDropzone';

const INITIAL_STATE: AppState = {
  input: '',
  mode: 'url',
  loading: false,
  error: null,
  result: null,
  statusMessage: 'System Standby',
};

const CircularScore: React.FC<{ malicious: number; total: number }> = ({ malicious, total }) => {
  const percentage = total > 0 ? (malicious / total) * 100 : 0;
  const strokeDasharray = 251.2; // 2 * PI * r (r=40)
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;
  const isDanger = malicious > 0;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${isDanger ? 'text-maroon-600' : 'text-emerald-500'} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-black ${isDanger ? 'text-maroon-700' : 'text-slate-900 dark:text-white'}`}>{malicious}</span>
        <div className="w-8 h-[1px] bg-slate-300 dark:bg-slate-700 my-1" />
        <span className="text-[10px] font-bold text-slate-400 uppercase">{total}</span>
      </div>
    </div>
  );
};

const ContentSection: React.FC = () => {
  return (
    <div className="mt-40 space-y-40">
      {/* Intro Header */}
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
          Why it's vital to use a <span className="text-maroon-600">virus scanner</span>
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Scan first, ask questions later. Spot viruses before they infiltrate your devices and compromise your sensitive data.
        </p>
      </div>

      {/* Feature Blocks */}
      <div className="space-y-48">
        {/* Block 1 - Privacy */}
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32">
          <div className="flex-1 space-y-8">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">Viruses hate your privacy</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              A potent virus can steal sensitive information like your credentials or passwords, encrypt and lock you out of your data, make individual transactions within apps, and even attack other devices on connected networks.
            </p>
            <div className="flex items-center gap-3 text-maroon-600 font-black text-sm uppercase tracking-widest group cursor-pointer">
              <span>Secure your identity</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-maroon-600/20 blur-[100px] rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000" />
              <img
                src="/privacy_shield.png"
                alt="Privacy Shield"
                className="relative w-96 h-96 object-contain drop-shadow-[0_20px_50px_rgba(153,27,27,0.3)] animate-float"
              />
            </div>
          </div>
        </div>

        {/* Block 2 - Malware */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 md:gap-32">
          <div className="flex-1 space-y-8">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">Stop malware before it stops you</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Once a virus has propagated, it can infect all your programs and applications without prejudice. Its destructive code can and likely will spread everywhere. That is why it is crucial to utilize a virus scanner before interacting with unknown files.
            </p>
            <div className="flex items-center gap-3 text-maroon-600 font-black text-sm uppercase tracking-widest group cursor-pointer">
              <span>Prevent Infection</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-96 h-96 bg-white dark:bg-[#12151c] rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/10 to-transparent" />
              <svg className="w-48 h-48 text-maroon-800 group-hover:scale-110 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-maroon-600/10" />
            </div>
          </div>
        </div>

        {/* Block 3 - Edge Heuristics */}
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32">
          <div className="flex-1 space-y-8">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">Sentinel AI Edge Heuristics</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Beyond cloud scanning, our local engine performs real-time heuristic analysis on file behavior. Detect zero-day threats and suspicious patterns at the edge before they even reach the network.
            </p>
            <div className="flex items-center gap-3 text-maroon-600 font-black text-sm uppercase tracking-widest group cursor-pointer">
              <span>Local Analysis</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-96 h-96 bg-white dark:bg-[#12151c] rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/10 to-transparent" />
              <svg className="w-48 h-48 text-maroon-700/50 group-hover:scale-110 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchitectureSection: React.FC = () => {
  return (
    <div className="mt-64 pt-24 border-t border-slate-200 dark:border-slate-800/50">
      <div className="text-center space-y-4 mb-20">
        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">Intelligence Architecture</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
          Sentinel AI utilizes a multi-layered verification pipeline to ensure maximum accuracy and zero-day threat detection.
        </p>
      </div>

      {/* Flowchart Design */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto relative px-10">
        {/* Connection Lines (Desktop Hide/Show) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -translate-y-1/2 z-0" />

        {[
          { label: 'Input Submission', desc: 'Secure Handshake', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { label: 'Sentinel AI Core', desc: 'Behavioral Analysis', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { label: 'VirusTotal API', desc: '70+ Security Vendors', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', primary: true },
          { label: 'Security Verdict', desc: 'Telemetry Report', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
        ].map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-700 shadow-2xl ${step.primary
              ? 'bg-maroon-800 text-white scale-125 shadow-maroon-900/40 outline outline-4 outline-maroon-600/10'
              : 'bg-white dark:bg-slate-900 text-slate-400 group-hover:text-maroon-600 border border-slate-100 dark:border-slate-800 shadow-slate-200/50'
              }`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{step.label}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{step.desc}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'detection' | 'details'>('detection');

  const handleAction = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.input.trim()) return;

    setState(p => ({ ...p, loading: true, error: null, result: null }));
    const result = await checkVirusTotalId(state.input.trim(), state.mode === 'url' ? 'url' : 'search');

    setState(p => ({
      ...p,
      loading: false,
      result,
      statusMessage: result.status === 'error' ? 'Analysis Failed' : 'Security Check Complete'
    }));
  };

  const reset = () => setState(INITIAL_STATE);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 selection:bg-maroon-500 selection:text-white pb-20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-maroon-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-maroon-800 rounded-xl flex items-center justify-center shadow-lg shadow-maroon-900/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-maroon-800 dark:text-maroon-500">
              Sentinel <span className="text-slate-900 dark:text-white">AI</span>
            </h2>
            <div className="h-1.5 w-24 bg-maroon-600 rounded-full" />
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Ultimate threat intelligence terminal. Detect malware, phishing, and security breaches with global cloud analysis.
          </p>

          <div className="flex justify-center pt-8">
            <div className="flex border-b border-slate-200 dark:border-slate-800 w-full max-w-2xl">
              {(['url', 'search', 'file'] as ScannerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setState(p => ({ ...p, mode: m, result: null, input: '', error: null }))}
                  className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${state.mode === m ? 'text-maroon-700 dark:text-maroon-500' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {m}
                  {state.mode === m && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-maroon-600 animate-in slide-in-from-left-full duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="space-y-12">
          {/* Action Area */}
          {!state.result && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              {state.mode === 'file' ? (
                <FileDropzone
                  loading={state.loading}
                  onFileSelect={async (file) => {
                    setState(p => ({ ...p, loading: true, error: null }));
                    const result = await checkVirusTotalFile(file, (msg) => setState(p => ({ ...p, statusMessage: msg })));
                    setState(p => ({ ...p, loading: false, result, statusMessage: result.status === 'error' ? 'Analysis Failed' : 'SECURED' }));
                  }}
                />
              ) : (
                <form onSubmit={handleAction} className="max-w-3xl mx-auto bg-white dark:bg-[#12151c] p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                      {state.mode === 'url' ? 'Input URL' : 'Search IP, Domain or Hash'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={state.input}
                        onChange={(e) => setState(p => ({ ...p, input: e.target.value }))}
                        placeholder={state.mode === 'url' ? 'https://example.com' : '8.8.8.8, example.com, or file hash...'}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800/50 rounded-2xl py-5 px-6 text-lg font-medium focus:border-maroon-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <button
                    disabled={state.loading || !state.input.trim()}
                    className="w-full py-5 rounded-2xl bg-maroon-800 hover:bg-maroon-900 text-white font-black uppercase tracking-widest shadow-xl shadow-maroon-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {state.loading ? 'Processing Terminal...' : 'Execute Intelligence Scan'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Error Display */}
          {state.error && (
            <div className="p-4 bg-maroon-50 border border-maroon-200 text-maroon-800 rounded-xl text-center font-bold text-sm">
              {state.error}
            </div>
          )}

          {/* Results Dashboard */}
          {state.result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
              {/* Top Result Card */}
              <div className="bg-white dark:bg-[#12151c] rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex flex-col items-center gap-4">
                    <CircularScore
                      malicious={state.result.stats?.malicious || 0}
                      total={(state.result.stats?.malicious || 0) + (state.result.stats?.undetected || 0) + (state.result.stats?.harmless || 0) + (state.result.stats?.suspicious || 0)}
                    />
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Score</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black break-all text-slate-800 dark:text-white">
                          {state.result.fileInfo?.name || state.input}
                        </h2>
                        <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span>SHA256: {state.result.fileInfo?.sha256?.substring(0, 16)}...</span>
                          {state.result.fileInfo?.size && <span>Size: {(state.result.fileInfo.size / 1024 / 1024).toFixed(2)} MB</span>}
                        </div>
                      </div>
                      <button onClick={reset} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-maroon-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    <div className={`p-4 rounded-2xl border flex items-center gap-4 ${state.result.status === 'clean'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'
                      : 'bg-maroon-500/5 border-maroon-500/20 text-maroon-600'
                      }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${state.result.status === 'clean' ? 'bg-emerald-500' : 'bg-maroon-600'}`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={state.result.status === 'clean' ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                      </div>
                      <span className="text-sm font-black uppercase tracking-wide">
                        {state.result.status === 'clean' ? 'No security vendors flagged this item' : `${state.result.stats?.malicious} vendors flagged this item`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-10 border-t border-slate-100 dark:border-slate-800 flex gap-8">
                  {(['detection', 'details'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${activeTab === t ? 'text-maroon-700 dark:text-maroon-400' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      {t}
                      {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-maroon-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'detection' && state.result.analysisResults && (
                <div className="bg-white dark:bg-[#12151c] rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-500">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Security Vendors' Analysis</h3>
                  </div>
                  <div className="p-10">
                    <VendorGrid results={state.result.analysisResults} />
                  </div>
                </div>
              )}

              {activeTab === 'details' && state.result.fileInfo && (
                <div className="bg-white dark:bg-[#12151c] rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-500">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Technical Specifications</h3>
                  </div>
                  <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'File Name', value: state.result.fileInfo.name },
                      { label: 'File Type', value: state.result.fileInfo.type || 'Binary / Executable' },
                      { label: 'File Size', value: state.result.fileInfo.size ? `${(state.result.fileInfo.size / 1024 / 1024).toFixed(3)} MB` : 'N/A' },
                      { label: 'SHA-256 Hash', value: state.result.fileInfo.sha256, mono: true },
                      { label: 'Analysis Date', value: new Date(state.result.fileInfo.lastAnalysisDate || '').toLocaleString() },
                      { label: 'Scan ID', value: state.result.permalink?.split('/').pop() || 'N/A', mono: true }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                        <p className={`text-sm font-bold truncate ${item.mono ? 'mono text-maroon-700 dark:text-maroon-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.value || 'Not available'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <ArchitectureSection />
        <ContentSection />
      </div>

      <footer className="mt-48 pb-16 text-center space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            Developed by <span className="text-maroon-700 dark:text-maroon-500">Sentinel Intelligence</span>
          </p>
          <p className="text-[10px] font-bold text-slate-400/80 dark:text-slate-600 max-w-lg leading-relaxed uppercase tracking-widest">
            This service is powered by the VirusTotal v3 API. By utilizing this terminal, you benefit from the aggregated intelligence of over 70 premier security vendors worldwide.
          </p>
        </div>
        <div className="flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
          <div className="flex items-center gap-2 text-slate-400 font-black tracking-tight text-xs uppercase">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            VirusTotal API v3
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
