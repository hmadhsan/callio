import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getAllApis } from '@/lib/apiService';
import prisma from '@/lib/prisma';
import GenerateKeyForm from '@/components/GenerateKeyForm';
import KeyTableRow from '@/components/KeyTableRow';
import { Key, Layers, Plus, ArrowRight, Settings } from 'lucide-react';
import UserNav from '@/components/UserNav';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    include: { api: true },
    orderBy: { createdAt: 'desc' },
  });

  const apis = await getAllApis();

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Callio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Dashboard
            </h1>
            <p className="text-[var(--muted)]">Manage your API keys and explore available APIs</p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            List an API
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">API Keys</span>
            </div>
            <p className="text-3xl font-bold">{apiKeys.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">Available APIs</span>
            </div>
            <p className="text-3xl font-bold">{apis.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">Account</span>
            </div>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Your API Keys</h2>
            <Link href="/keys" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <GenerateKeyForm />

          {apiKeys.length > 0 ? (
            <div className="mt-5 border border-[var(--line)] rounded-lg overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-[var(--soft)]">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-[var(--muted)]">Key</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--muted)]">Name</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--muted)]">API</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--muted)]">Created</th>
                    <th className="text-right px-4 py-2 font-medium text-[var(--muted)]">Actions</th>
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
            <p className="text-[var(--muted)] text-sm mt-4">No API keys yet. Generate one to start using APIs.</p>
          )}
        </div>

        {/* Quick Access APIs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Available APIs</h2>
            <Link href="/browse" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
              Browse all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apis.slice(0, 6).map((api) => (
              <Link
                key={api.id}
                href={`/skills/callio/${api.slug}`}
                className="group bg-white rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{api.icon}</span>
                  <h3 className="font-medium group-hover:text-[var(--accent)] transition">{api.name}</h3>
                </div>
                <p className="text-xs text-[var(--muted)] line-clamp-2">{api.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
