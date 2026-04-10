import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';
import LogsExplorer from '@/components/LogsExplorer';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    const { user, workspace } = await getCurrentUserWithWorkspace();

    if (!user || !workspace) {
        redirect('/login');
    }

    // Fetch the last 100 usage records for this workspace
    const records = await prisma.usageRecord.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
            id: true,
            apiSlug: true,
            apiKeyId: true,
            method: true,
            path: true,
            status: true,
            latencyMs: true,
            createdAt: true,
            environment: true,
        },
    });

    const apiKeyIds = Array.from(new Set(records.map((record) => record.apiKeyId).filter((id): id is string => Boolean(id))));
    const apiKeys = apiKeyIds.length > 0
        ? await prisma.apiKey.findMany({
            where: { id: { in: apiKeyIds } },
            select: {
                id: true,
                name: true,
                keyLast4: true,
            }
        })
        : [];
    const apiKeyMap = new Map(apiKeys.map((apiKey) => [apiKey.id, apiKey]));

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

                <LogsExplorer records={records.map((record) => ({
                    id: record.id,
                    apiSlug: record.apiSlug,
                    apiKeyId: record.apiKeyId,
                    method: record.method,
                    path: record.path,
                    status: record.status,
                    latencyMs: record.latencyMs,
                    createdAt: record.createdAt.toISOString(),
                    environment: record.environment,
                    apiKey: record.apiKeyId ? apiKeyMap.get(record.apiKeyId) ?? null : null,
                }))} />
            </div>
        </div>
    );
}
