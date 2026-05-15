import Link from 'next/link';
import { ArrowRight, Layers, WandSparkles } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';
import SmartApiComposer from '@/components/SmartApiComposer';

export const dynamic = 'force-dynamic';

export default function ComposePage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <CallioLogo size={30} />
          <nav className="flex items-center gap-4 text-sm text-[var(--muted)]">
            <Link href="/browse" className="hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/mcp" className="hover:text-[var(--ink)] transition">MCP</Link>
            <Link href="/docs" className="hover:text-[var(--ink)] transition">Docs</Link>
            <UserNav />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[linear-gradient(130deg,#dbeafe_0%,#f8fafc_35%,#fff7ed_100%)] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute right-[-20px] top-[-20px] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.28),transparent_70%)]" />
          <div className="absolute left-[35%] top-[45%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.22),transparent_70%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
              <WandSparkles className="h-3.5 w-3.5" />
              New: Smart API Composer
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              From plain English to multi-step API workflows.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[#334155] sm:text-base">
              Describe your goal once. Callio generates a workflow graph, runnable code, and MCP tool config so your team can ship faster with full visibility.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[var(--muted)]">
                <Layers className="h-3.5 w-3.5" />
                Workflow graph
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[var(--muted)]">
                <ArrowRight className="h-3.5 w-3.5" />
                Runnable TypeScript or Python
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[var(--muted)]">
                <ArrowRight className="h-3.5 w-3.5" />
                MCP config hints
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <SmartApiComposer />
        </section>
      </main>
    </div>
  );
}