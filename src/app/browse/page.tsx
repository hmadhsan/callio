import Link from 'next/link';
import { getAllApis } from '@/lib/apiService';
import { Search, ArrowRight, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BrowsePage() {
  const apis = await getAllApis();

  // Group by category
  const categories = apis.reduce<Record<string, typeof apis>>((acc, api) => {
    if (!acc[api.category]) acc[api.category] = [];
    acc[api.category].push(api);
    return acc;
  }, {});

  const categoryList = Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Callio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
            <Link href="/login" className="text-sm px-4 py-1.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-strong)] transition">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Browse APIs
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl">
            Discover and integrate APIs for your AI agents. One key, any API.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-10">
          <div className="bg-white rounded-xl border border-[var(--line)] px-5 py-3">
            <span className="text-2xl font-bold">{apis.length}</span>
            <span className="text-[var(--muted)] text-sm ml-2">APIs available</span>
          </div>
          <div className="bg-white rounded-xl border border-[var(--line)] px-5 py-3">
            <span className="text-2xl font-bold">{categoryList.length}</span>
            <span className="text-[var(--muted)] text-sm ml-2">Categories</span>
          </div>
        </div>

        {/* API Grid by Category */}
        {categoryList.map(([category, categoryApis]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-semibold">{category}</h2>
              <span className="text-xs font-mono bg-[var(--soft)] text-[var(--muted)] px-2 py-0.5 rounded-full">
                {categoryApis.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryApis.map((api) => (
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
                    <span className="bg-[var(--soft)] px-2 py-0.5 rounded">{api.authentication}</span>
                    <span className="bg-[var(--soft)] px-2 py-0.5 rounded">{api.endpointsCount} endpoints</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {apis.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] text-lg">No APIs available yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
