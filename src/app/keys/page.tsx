import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getAllApis } from '@/lib/apiService';
import GenerateKeyForm from '@/components/GenerateKeyForm';
import KeyTableRow from '@/components/KeyTableRow';
import { ArrowLeft, Key, Shield } from 'lucide-react';
import CallioLogo from '@/components/CallioLogo';
import UserNav from '@/components/UserNav';

export const dynamic = 'force-dynamic';

export default async function KeysPage() {
  const { user, workspace } = await getCurrentUserWithWorkspace();

  if (!user || !workspace) {
    redirect('/login');
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    include: { api: true },
    orderBy: { createdAt: 'desc' },
  });

  const apis = await getAllApis();

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Key className="w-6 h-6" />
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>API Keys</h1>
        </div>
        <p className="text-[var(--muted)] mb-8">
          Create and manage your Callio API keys. Use these keys to authenticate requests to any API through the Callio proxy.
        </p>

        {/* Security note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Keep your keys safe</p>
            <p className="text-amber-700">API keys are shown once at creation. Store them securely — you won't be able to view them again.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <GenerateKeyForm apis={apis} />

          {apiKeys.length > 0 ? (
            <div className="mt-6 border border-[var(--line)] rounded-lg overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-[var(--soft)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted)]">Key</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted)]">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted)]">Environment</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted)]">API</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--muted)]">Created</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <KeyTableRow key={key.id} apiKey={key} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 mt-4">
              <Key className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-40" />
              <p className="text-[var(--muted)]">No keys yet</p>
              <p className="text-sm text-[var(--muted)]">Generate a sandbox key to prototype, or a production key to put your agent in front of real traffic.</p>
            </div>
          )}
        </div>

        {/* Usage example */}
        <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6 text-sm">
          <p className="text-gray-400 mb-3 font-medium">Quick start — make an API call through Callio:</p>
          <pre className="text-green-400 font-mono text-xs overflow-x-auto">
            {`curl -X GET "https://callio.dev/api/proxy/jsonplaceholder/posts/1" \\
  -H "Authorization: Bearer callio_your_key_here"`}
          </pre>
        </div>
      </div>
    </div>
  );
}
