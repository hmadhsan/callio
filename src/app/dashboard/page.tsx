import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import { getAllApis } from '@/lib/apiService';
import prisma from '@/lib/prisma';
import GenerateKeyForm from '@/components/GenerateKeyForm';
import KeyTableRow from '@/components/KeyTableRow';
import { Key, Layers, Plus, ArrowRight, Settings, Zap, Star } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import { PLANS } from '@/lib/stripe';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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

  // Fetch subscription and usage
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });
  let planId = (subscription?.plan || 'free') as keyof typeof PLANS;
  if (user.email === 'hammadhassan616@gmail.com') {
    planId = 'admin';
  }
  const planConfig = PLANS[planId];
  const maxKeys = planConfig.maxKeys;

  const periodStart = subscription?.currentPeriodStart
    || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const usageCount = await prisma.usageRecord.count({
    where: { userId: user.id, createdAt: { gte: periodStart } },
  });

  const usagePercent = Math.min(Math.round((usageCount / planConfig.requestsPerMonth) * 100), 100);
  const barColor = usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-green-500';

  // Fetch Favorite APIs
  const favoriteApis = await prisma.favoriteApi.findMany({
    where: { userId: user.id },
    include: { api: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/keys" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Keys</Link>
            <Link href="/dashboard/logs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Logs</Link>
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
          {/* Agent Connections Card */}
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">Agent Connections</span>
            </div>
            <p className="text-3xl font-bold">
              {apiKeys.length}
              <span className="text-sm font-normal text-[var(--muted)]"> / {maxKeys === Infinity ? '∞' : maxKeys}</span>
            </p>
          </div>

          {/* Usage Card */}
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">Requests This Month</span>
            </div>
            <p className="text-3xl font-bold">
              {usageCount}
              <span className="text-sm font-normal text-[var(--muted)]"> / {planConfig.requestsPerMonth.toLocaleString()}</span>
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3 mb-2">
              <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${usagePercent}%` }} />
            </div>
            <Link href="/dashboard/logs" className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 mt-1">
              View full logs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Plan Card */}
          <div className="bg-white rounded-xl border border-[var(--line)] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted)]">Plan</span>
            </div>
            <p className="text-2xl font-bold capitalize">{planConfig.name}</p>
            {planId === 'free' && (
              <Link
                href="/pricing"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                Upgrade <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="mb-8">
          <DashboardCharts />
        </div>

        {/* Favorite APIs Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Favorite APIs <span className="text-sm font-normal text-[var(--muted)]">({favoriteApis.length})</span>
            </h2>
          </div>

          {favoriteApis.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteApis.map(({ api }: any) => (
                <Link
                  key={api.id}
                  href={`/skills/callio/${api.slug}`}
                  className="group bg-white rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)] hover:shadow-md transition-all relative"
                >
                  <div className="flex items-start gap-3 mb-2 pr-8">
                    <span className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--soft)] rounded-lg">
                      {api.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm group-hover:text-[var(--accent)] transition truncate">{api.name}</h3>
                      <p className="text-[10px] text-[var(--muted)] font-mono truncate">callio/{api.slug}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{api.shortDescription}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--line)] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-[var(--soft)] rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-[var(--muted)]" />
              </div>
              <h3 className="text-[var(--ink)] font-medium mb-1">No favorite APIs are available</h3>
              <p className="text-[var(--muted)] text-sm mb-6">You have the option to save favorite apis</p>
              <Link
                href="/browse"
                className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-strong)] transition shadow-sm"
              >
                Discover APIs
              </Link>
            </div>
          )}
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Your API Keys</h2>
            <Link href="/keys" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <GenerateKeyForm apis={apis} />

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
