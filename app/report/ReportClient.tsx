"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmissionDocument } from '@/components/pdf/SubmissionDocument';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <p>Loading PDF Viewer...</p>,
});

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false,
});

export default function ReportClient({ data, code }: { data: any, code: string }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-800">Hackathon Submission Preview</h1>
                <div className="flex gap-4">
                    <PDFDownloadLink
                        document={<SubmissionDocument data={data} code={code} />}
                        fileName="Aadhaar_Insight_Submission.pdf"
                        className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
                    >
                        {/* @ts-ignore */}
                        {({ blob, url, loading, error }) =>
                            loading ? 'Generating PDF...' : 'Download Submission PDF'
                        }
                    </PDFDownloadLink>
                </div>
            </div>

            <div className="flex-1 p-8">
                <PDFViewer className="w-full h-full min-h-[800px] rounded-lg shadow-lg border border-slate-300">
                    <SubmissionDocument data={data} code={code} />
                </PDFViewer>
            </div>
        </div>
    );
}
