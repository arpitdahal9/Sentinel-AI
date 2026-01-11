import { VirusTotalResult } from '../types';

const VT_KEY = (import.meta as any).env.VITE_VIRUSTOTAL_API_KEY;

export async function checkVirusTotalId(id: string, mode: 'url' | 'search'): Promise<VirusTotalResult> {
    try {
        const resourceId = mode === 'url' ? btoa(id).replace(/=/g, '') : id;
        const endpoint = mode === 'url' ? `/api/virustotal/urls/${resourceId}` : `/api/virustotal/search?query=${id}`;

        const response = await fetch(endpoint, {
            headers: { 'x-apikey': VT_KEY }
        });

        if (!response.ok) {
            if (response.status === 404 && mode === 'url') {
                const scanResponse = await fetch('/api/virustotal/urls', {
                    method: 'POST',
                    headers: {
                        'x-apikey': VT_KEY,
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    body: `url=${encodeURIComponent(id)}`
                });
                const scanData = await scanResponse.json();
                return { status: 'loading', detail: 'Analysis started. Please check back in a moment.', permalink: `https://virustotal.com/gui/url/${scanData.data?.id}` };
            }
            throw new Error(`VirusTotal API error: ${response.statusText}`);
        }

        const data = await response.json();
        const resultData = mode === 'search' ? data.data?.[0] : data.data;

        if (!resultData) throw new Error('No results found for this target.');

        const stats = resultData.attributes.last_analysis_stats;
        const isMalicious = stats.malicious > 0 || stats.suspicious > 0;

        return {
            status: isMalicious ? 'hit' : 'clean',
            stats: {
                malicious: stats.malicious,
                suspicious: stats.suspicious,
                harmless: stats.harmless,
                undetected: stats.undetected,
            },
            analysisResults: resultData.attributes.last_analysis_results,
            permalink: `https://virustotal.com/gui/${mode}/${resultData.id}`,
            fileInfo: mode === 'search' ? {
                sha256: resultData.attributes.sha256,
                name: resultData.attributes.meaningful_name || id,
                size: resultData.attributes.size,
                type: resultData.attributes.type_description,
                lastAnalysisDate: resultData.attributes.last_analysis_date ? new Date(resultData.attributes.last_analysis_date * 1000).toISOString() : undefined
            } : undefined
        };
    } catch (err) {
        return { status: 'error', detail: err instanceof Error ? err.message : 'Unknown error' };
    }
}

export async function checkVirusTotalFile(file: File, onStatusUpdate?: (msg: string) => void): Promise<VirusTotalResult> {
    try {
        onStatusUpdate?.('Initializing secure upload...');
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/virustotal/files', {
            method: 'POST',
            headers: { 'x-apikey': VT_KEY },
            body: formData
        });

        if (!uploadResponse.ok) throw new Error('File upload failed');
        const uploadData = await uploadResponse.json();
        const analysisId = uploadData.data.id;

        let attempts = 0;
        while (attempts < 60) {
            onStatusUpdate?.(`Analyzing packet telemetry... (${attempts * 2}s)`);
            const pollResponse = await fetch(`/api/virustotal/analyses/${analysisId}`, {
                headers: { 'x-apikey': VT_KEY }
            });
            const pollData = await pollResponse.json();
            const status = pollData.data.attributes.status;

            if (status === 'completed') {
                const fileId = pollData.meta.file_info.sha256;
                return checkVirusTotalId(fileId, 'search');
            }

            await new Promise(r => setTimeout(r, 2000));
            attempts++;
        }
        throw new Error('Analysis timed out. Please check VirusTotal directly.');
    } catch (err) {
        return { status: 'error', detail: err instanceof Error ? err.message : 'File scan failed' };
    }
}
