import Link from 'next/link';
import { getAllApis } from '@/lib/apiService';
import { ArrowRight } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const apis = await getAllApis();

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono bg-[var(--soft)] text-[var(--muted)] px-2.5 py-1 rounded-full">callio</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Skills & APIs
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl">
            The building blocks your agent needs. Install skills and call APIs with a single key.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apis.map((api) => (
            <Link
              key={api.id}
              href={`/skills/callio/${api.slug}`}
              className="group bg-white rounded-xl border border-[var(--line)] p-5 hover:border-[var(--accent)] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{api.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-[var(--accent)] transition truncate">{api.name}</h3>
                  <span className="text-xs text-[var(--muted)] font-mono">callio/{api.slug}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">{api.shortDescription}</p>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="bg-[var(--soft)] px-2 py-0.5 rounded">{api.category}</span>
                <span className="bg-[var(--soft)] px-2 py-0.5 rounded">{api.endpointsCount} endpoints</span>
              </div>
            </Link>
          ))}
        </div>

        {apis.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] text-lg">No skills available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
