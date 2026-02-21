import Link from 'next/link';
import { getAllApis } from '@/lib/apiService';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import BrowseGrid from '@/components/BrowseGrid';

export const dynamic = 'force-dynamic';

export default async function BrowsePage() {
  const apis = await getAllApis();
  const categoryCount = new Set(apis.map((a) => a.category)).size;

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Discover APIs
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl">
            {apis.length} APIs across {categoryCount} categories. One key, any API.
          </p>
        </div>

        {/* Client-side interactive grid */}
        <BrowseGrid apis={apis} />
      </div>
    </div>
  );
}
