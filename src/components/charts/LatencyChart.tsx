'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface ChartProps {
    data: {
        endpoint: string;
        avgLatency: number;
        calls: number;
    }[];
}

export default function LatencyChart({ data }: ChartProps) {
    // Sort data so the longest latency is at the top/left
    const sortedData = [...data].sort((a, b) => b.avgLatency - a.avgLatency).slice(0, 10);

    return (
        <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6 w-full h-[300px]">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                    Speed & Latency
                </h3>
                <p className="text-sm text-[var(--muted)]">Average response time (ms) of your top endpoints.</p>
            </div>

            {sortedData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                    No latency data available for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={sortedData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="endpoint"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            dy={10}
                            tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                            formatter={(value: any) => [`${Number(value).toFixed(0)} ms`, 'Avg Latency']}
                        />
                        <Bar dataKey="avgLatency" radius={[4, 4, 0, 0]}>
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.avgLatency > 1000 ? '#EF4444' : entry.avgLatency > 500 ? '#F59E0B' : '#10B981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
