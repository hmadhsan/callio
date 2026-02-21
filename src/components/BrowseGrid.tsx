'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface Api {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
  shortDescription: string;
  authentication: string;
  webhook: boolean;
  featured: boolean;
  pricing: string;
  allowUnauthenticated: boolean;
  endpointsCount: number;
}

export default function BrowseGrid({ apis }: { apis: Api[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);


  // Extract unique categories, sorted alphabetically
  const categories = useMemo(() => {
    const cats = Array.from(new Set(apis.map((a) => a.category))).sort();
    return cats;
  }, [apis]);

  // Filter APIs based on search and category
  const filtered = useMemo(() => {
    let result = apis;

    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q)
      );
    }

    return result;
  }, [apis, search, activeCategory]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    apis.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [apis]);

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search APIs by name, category, or description..."
          className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
            !activeCategory
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--ink)]'
          }`}
        >
          All ({apis.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--ink)]'
            }`}
          >
            {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory) && (
        <p className="text-sm text-[var(--muted)] mb-4">
          {filtered.length} {filtered.length === 1 ? 'API' : 'APIs'} found
          {activeCategory && <span> in <strong className="text-[var(--ink)]">{activeCategory}</strong></span>}
          {search && <span> matching &ldquo;<strong className="text-[var(--ink)]">{search}</strong>&rdquo;</span>}
        </p>
      )}

      {/* API Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((api) => (
          <Link
            key={api.id}
            href={`/skills/callio/${api.slug}`}
            className="group bg-white rounded-xl border border-[var(--line)] p-5 hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col relative"
          >

            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl flex-shrink-0 w-9 h-9 flex items-center justify-center bg-[var(--soft)] rounded-lg">
                {api.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm group-hover:text-[var(--accent)] transition truncate">
                  {api.name}
                </h3>
                <span className="text-[10px] text-[var(--muted)] font-mono">callio/{api.slug}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4 flex-1 leading-relaxed">
              {api.shortDescription}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-[var(--soft)] text-[var(--ink)] px-2 py-0.5 rounded text-[10px] font-medium">
                {api.category}
              </span>
              <span className="bg-[var(--soft)] px-2 py-0.5 rounded text-[10px] text-[var(--muted)]">
                {api.endpointsCount} {api.endpointsCount === 1 ? 'endpoint' : 'endpoints'}
              </span>
              {api.pricing && (
                <span className="bg-[var(--soft)] px-2 py-0.5 rounded text-[10px] text-[var(--muted)]">
                  {api.pricing}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--muted)] text-lg mb-2">No APIs match your search.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(null); }}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
