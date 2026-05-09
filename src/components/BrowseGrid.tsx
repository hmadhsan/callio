'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import CarbonAd from './CarbonAd';

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

// Emoji per canonical category. Falls back to ✨ for anything unmapped.
const CATEGORY_EMOJI: Record<string, string> = {
  'AI & LLMs': '🧠',
  'AI': '🧠',
  'AI & ML': '🧠',
  'AI Search': '🔎',
  'AI & Machine Learning': '🧠',
  'LLM': '🧠',
  'Search': '🔎',
  'Web Search': '🔎',
  'Browser Automation': '🌐',
  'Communications': '💬',
  'Messaging': '💬',
  'Email': '📧',
  'Email Finder': '📬',
  'CRM': '💼',
  'Sales': '📈',
  'Data & Scraping': '📊',
  'Data': '📊',
  'Data & Reference': '📚',
  'Data & Storage': '🗄️',
  'Data Collection': '📚',
  'Dataset': '🗂️',
  'Brand Data': '🏷️',
  'Company Search': '🏢',
  'People Search': '👤',
  'Scrape': '🕷️',
  'Development': '🛠️',
  'Developer Tools': '🛠️',
  'Compliance': '🛡️',
  'Document Processing': '📄',
  'Productivity': '✅',
  'Sales & CRM': '💼',
  'Finance': '💸',
  'Finance & Payments': '💸',
  'Payments': '💸',
  'Prediction Markets': '📊',
  'Analytics': '📈',
  'Maps & Weather': '🗺️',
  'Maps': '🗺️',
  'Maps & Location': '🗺️',
  'Weather': '🌤️',
  'Storage & Media': '🎬',
  'Cloud Storage': '🗄️',
  'Storage': '🗄️',
  'Media': '🎬',
  'Image': '🖼️',
  'Video': '🎥',
  'Translation': '🌍',
  'Identity & Auth': '🔐',
  'Identity Verification': '🪪',
  'Database': '🗄️',
  'News & Media': '📰',
  'Travel & Lifestyle': '✈️',
  'E-commerce': '🛒',
  'eCommerce': '🛍️',
  'Public Data': '📚',
  'Fun & Testing': '🎮',
  'Fun & Games': '🎮',
};

const emojiFor = (cat: string) => CATEGORY_EMOJI[cat] ?? '✨';

// "no-key"   = works without any upstream provider key.
// "free-key" = upstream provider offers a free plan / free key.
// "byok"     = user must bring a provider key without a clear free tier.
type KeyTier = 'no-key' | 'free-key' | 'byok';
const keyTierOf = (api: { allowUnauthenticated: boolean; pricing: string }): KeyTier => {
  if (api.allowUnauthenticated) return 'no-key';
  return /\bfree\b/i.test(api.pricing) ? 'free-key' : 'byok';
};

export default function BrowseGrid({
  apis,
  initialFavoritedIds = []
}: {
  apis: Api[];
  initialFavoritedIds?: string[];
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeKeyTier, setActiveKeyTier] = useState<KeyTier | null>(null);

  // No-key vs BYOK counts across the whole catalog
  const keyTierCounts = useMemo(() => {
    let noKey = 0;
    let freeKey = 0;
    let byok = 0;
    apis.forEach((a) => {
      const tier = keyTierOf(a);
      if (tier === 'no-key') noKey++;
      else if (tier === 'free-key') freeKey++;
      else byok++;
    });
    return { noKey, freeKey, byok };
  }, [apis]);

  // Count per category (computed first so we can sort pills by it)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    apis.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [apis]);

  // Categories sorted by count desc (busiest first), then name
  const categories = useMemo(() => {
    return Array.from(new Set(apis.map((a) => a.category))).sort((a, b) => {
      const diff = (categoryCounts[b] || 0) - (categoryCounts[a] || 0);
      return diff !== 0 ? diff : a.localeCompare(b);
    });
  }, [apis, categoryCounts]);

  // Filter APIs based on search, key tier, and category
  const filtered = useMemo(() => {
    let result = apis;

    if (activeKeyTier) {
      result = result.filter((a) => keyTierOf(a) === activeKeyTier);
    }

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
  }, [apis, search, activeCategory, activeKeyTier]);

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

      {/* Key tier filter (no-key vs BYOK) */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-medium text-[var(--muted)] mr-1">Setup:</span>
        <button
          onClick={() => setActiveKeyTier(null)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition border ${!activeKeyTier
            ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
            : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
            }`}
        >
          All <span className="tabular-nums opacity-70">{apis.length}</span>
        </button>
        <button
          onClick={() => setActiveKeyTier(activeKeyTier === 'no-key' ? null : 'no-key')}
          title="Works with just a Callio key — no provider account needed"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition border ${activeKeyTier === 'no-key'
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-500'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeKeyTier === 'no-key' ? 'bg-white' : 'bg-emerald-500'}`} />
          No key needed <span className="tabular-nums opacity-70">{keyTierCounts.noKey}</span>
        </button>
        <button
          onClick={() => setActiveKeyTier(activeKeyTier === 'free-key' ? null : 'free-key')}
          title="Provider offers a free API key or free tier for getting started"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition border ${activeKeyTier === 'free-key'
            ? 'bg-sky-600 text-white border-sky-600'
            : 'bg-white text-sky-700 border-sky-200 hover:border-sky-500'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeKeyTier === 'free-key' ? 'bg-white' : 'bg-sky-500'}`} />
          Free key <span className="tabular-nums opacity-70">{keyTierCounts.freeKey}</span>
        </button>
        <button
          onClick={() => setActiveKeyTier(activeKeyTier === 'byok' ? null : 'byok')}
          title="Bring your own provider API key — Callio injects it for you"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition border ${activeKeyTier === 'byok'
            ? 'bg-amber-600 text-white border-amber-600'
            : 'bg-white text-amber-700 border-amber-200 hover:border-amber-500'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeKeyTier === 'byok' ? 'bg-white' : 'bg-amber-500'}`} />
          BYOK <span className="tabular-nums opacity-70">{keyTierCounts.byok}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${!activeCategory
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition border ${activeCategory === cat
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--ink)]'
              }`}
          >
            <span aria-hidden>{emojiFor(cat)}</span>
            <span>{cat}</span>
            <span className={`text-[11px] tabular-nums ${activeCategory === cat ? 'text-white/80' : 'text-[var(--muted)]'}`}>
              {categoryCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory || activeKeyTier) && (
        <p className="text-sm text-[var(--muted)] mb-4">
          {filtered.length} {filtered.length === 1 ? 'API' : 'APIs'} found
          {activeKeyTier && (
            <span> · <strong className={
              activeKeyTier === 'no-key'
                ? 'text-emerald-700'
                : activeKeyTier === 'free-key'
                  ? 'text-sky-700'
                  : 'text-amber-700'
            }>{
                activeKeyTier === 'no-key'
                  ? 'No key needed'
                  : activeKeyTier === 'free-key'
                    ? 'Free key'
                    : 'BYOK'
              }</strong></span>
          )}
          {activeCategory && <span> in <strong className="text-[var(--ink)]">{activeCategory}</strong></span>}
          {search && <span> matching &ldquo;<strong className="text-[var(--ink)]">{search}</strong>&rdquo;</span>}
        </p>
      )}

      {/* Carbon Ads Placement */}
      <CarbonAd />

      {/* API Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {filtered.map((api) => {
          const isFavorited = initialFavoritedIds.includes(api.id);
          const keyTier = keyTierOf(api);
          const keyChipClass =
            keyTier === 'no-key'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : keyTier === 'free-key'
                ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';

          return (
            <div key={api.id} className="relative group">
              <Link
                href={`/skills/callio/${api.slug}`}
                className="bg-white rounded-xl border border-[var(--line)] p-5 hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex items-start gap-3 mb-3 pr-8">
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
                  <span className="inline-flex items-center gap-1 bg-[var(--soft)] text-[var(--ink)] px-2 py-0.5 rounded text-[10px] font-medium">
                    <span aria-hidden>{emojiFor(api.category)}</span>
                    {api.category}
                  </span>
                  <span className="bg-[var(--soft)] px-2 py-0.5 rounded text-[10px] text-[var(--muted)]">
                    {api.endpointsCount} {api.endpointsCount === 1 ? 'endpoint' : 'endpoints'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${keyChipClass}`}
                      title={
                      keyTier === 'no-key'
                        ? `Works with just a Callio key. Pricing: ${api.pricing || 'Free'}`
                        : keyTier === 'free-key'
                          ? `Provider offers a free key/tier. Pricing: ${api.pricing || 'Free tier available'}`
                          : `Bring your own provider key. Pricing: ${api.pricing || 'Varies'}`
                    }
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        keyTier === 'no-key'
                          ? 'bg-emerald-500'
                          : keyTier === 'free-key'
                            ? 'bg-sky-500'
                            : 'bg-amber-500'
                      }`}
                    />
                    {keyTier === 'no-key' ? 'No key' : keyTier === 'free-key' ? 'Free key' : 'BYOK'}
                  </span>
                </div>
              </Link>
              <FavoriteButton apiId={api.id} initialIsFavorite={isFavorited} />
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--muted)] text-lg mb-2">No APIs match your search.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(null); setActiveKeyTier(null); }}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
