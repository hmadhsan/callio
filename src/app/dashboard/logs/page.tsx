import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ArrowLeft, Activity, Search, Filter } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the last 100 usage records for this user
    const records = await prisma.usageRecord.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            {/* Nav */}
            <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <CallioLogo size={30} />
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
                        <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
                        <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
                        <Link href="/dashboard/logs" className="text-sm font-medium text-[var(--ink)] transition">Logs</Link>
                        <UserNav />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/dashboard" className="p-2 -ml-2 hover:bg-black/5 rounded-lg transition text-[var(--muted)] hover:text-[var(--ink)]">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            Request Logs
                        </h1>
                        <p className="text-[var(--muted)] text-sm mt-1">View the last 100 API requests made with your keys.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-[var(--line)] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[var(--line)] bg-[var(--soft)] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                            <Activity className="w-4 h-4 text-[var(--accent)]" />
                            Recent Activity
                        </div>
                    </div>

                    {records.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[var(--soft)]/50 border-b border-[var(--line)]">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-[var(--muted)]">Timestamp</th>
                                        <th className="px-6 py-3 font-medium text-[var(--muted)]">API</th>
                                        <th className="px-6 py-3 font-medium text-[var(--muted)]">Method & Path</th>
                                        <th className="px-6 py-3 font-medium text-[var(--muted)]">Status</th>
                                        <th className="px-6 py-3 font-medium text-[var(--muted)] text-right">Latency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--line)]">
                                    {records.map((record) => {
                                        const statusColor =
                                            record.status >= 200 && record.status < 300 ? 'bg-green-100 text-green-700 border-green-200' :
                                                record.status >= 400 && record.status < 500 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    record.status >= 500 ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-gray-100 text-gray-700 border-gray-200';

                                        return (
                                            <tr key={record.id} className="hover:bg-[var(--soft)]/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--muted)]">
                                                    {new Date(record.createdAt).toLocaleString(undefined, {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--ink)]">
                                                    {record.apiSlug}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${record.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                                                                record.method === 'POST' ? 'bg-green-100 text-green-700' :
                                                                    record.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {record.method}
                                                        </span>
                                                        <span className="font-mono text-xs text-[var(--muted)] truncate max-w-[200px]" title={`/${record.path}`}>
                                                            /{record.path}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${statusColor}`}>
                                                        {record.status === 0 ? 'Pending' : record.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-[var(--muted)]">
                                                    {record.latencyMs}ms
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-[var(--muted)]">
                            <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No requests have been made yet.</p>
                            <p className="text-sm mt-1">Connect an agent and start using APIs to see logs here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
