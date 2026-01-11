export type Status = 'malicious' | 'suspicious' | 'clean' | 'undetected' | 'harmless' | 'timeout' | 'error' | 'idle' | 'queued' | 'processing';
export type ScannerMode = 'file' | 'url' | 'search';

export interface VendorResult {
  method: string;
  engine_name: string;
  category: string;
  result: string | null;
}

export interface VirusTotalResult {
  status: 'malicious' | 'suspicious' | 'clean' | 'error' | 'idle';
  detectionRatio?: string;
  detail?: string;
  permalink?: string;
  stats?: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
    timeout: number;
  };
  analysisResults?: Record<string, VendorResult>;
  fileInfo?: {
    name?: string;
    size?: number;
    sha256?: string;
    type?: string;
    lastAnalysisDate?: string;
  };
}

export interface AppState {
  input: string;
  mode: ScannerMode;
  loading: boolean;
  error: string | null;
  result: VirusTotalResult | null;
  statusMessage: string;
}
