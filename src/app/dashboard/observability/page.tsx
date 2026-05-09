import { redirect } from 'next/navigation';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';
import ObservabilityStats from '@/components/ObservabilityStats';
import ObservabilityLogs from '@/components/ObservabilityLogs';
import { BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Observability | Callio',
};

export default async function ObservabilityPage() {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromSessionToken(token);
  if (!user) {
    redirect('/login');
  }

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Header */}
      <div className="border-b border-[var(--line)] bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="text-3xl font-bold text-[var(--ink)]">Observability</h1>
          </div>
          <p className="text-[var(--muted)]">Monitor API calls, track performance, and identify issues in your agent.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-8">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[1, 7, 30].map((days) => (
            <button
              key={days}
              className="px-3 py-2 rounded border border-[var(--line)] hover:bg-[var(--soft)] text-sm font-medium"
            >
              Last {days === 1 ? '24h' : `${days}d`}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <ObservabilityStats days={7} />
        </div>

        {/* Logs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Calls</h2>
          <ObservabilityLogs days={7} />
        </div>
      </div>
    </div>
  );
}
