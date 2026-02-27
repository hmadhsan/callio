'use client';

import { useEffect, useState } from 'react';
import RequestsChart from './charts/RequestsChart';
import LatencyChart from './charts/LatencyChart';
import { Loader2 } from 'lucide-react';

export default function DashboardCharts() {
    const [data, setData] = useState<{ requestData: any[], latencyData: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics?days=30')
            .then(res => res.json())
            .then(d => {
                if (!d.error) {
                    setData(d);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load charts', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-12 bg-white rounded-xl border border-[var(--line)] shadow-sm">
                <Loader2 className="w-8 h-8 text-[var(--muted)] animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RequestsChart data={data.requestData} />
            <LatencyChart data={data.latencyData} />
        </div>
    );
}
