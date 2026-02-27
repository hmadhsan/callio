'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ChartProps {
    data: {
        date: string;
        requests: number;
    }[];
}

export default function RequestsChart({ data }: ChartProps) {
    return (
        <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6 w-full h-[300px]">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                    API Requests (30 Days)
                </h3>
                <p className="text-sm text-[var(--muted)]">Volume of requests sent through your API keys.</p>
            </div>

            {data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                    No usage data available for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="requests"
                            stroke="var(--accent)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: 'var(--accent)', stroke: 'white', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
