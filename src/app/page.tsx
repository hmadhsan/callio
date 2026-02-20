import Link from 'next/link';
import { CalendarDays, Sparkles, ArrowRight } from 'lucide-react';
import WaitlistForm from '@/components/WaitlistForm';
import BookDemoForm from '@/components/BookDemoForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      {/* Top nav */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-[rgba(249,247,242,0.7)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-semibold">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">Callio</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#demo" className="hover:text-[var(--accent)] transition">Book a demo</a>
            <a href="#waitlist" className="hover:text-[var(--accent)] transition">Join waitlist</a>
          </nav>
          <a
            href="#waitlist"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] transition"
          >
            Get early access
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,170,70,0.22),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(74,144,226,0.18),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--line)] bg-white/80">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">API marketplace for agents</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-display tracking-tight leading-tight">
            One gateway for every API your agents need.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[var(--muted)] max-w-2xl">
            Callio unifies authentication, discovery, and execution so you can ship agent workflows faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#demo"
              className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] transition inline-flex items-center gap-2"
            >
              Book a demo <CalendarDays className="w-4 h-4" />
            </a>
            <a
              href="#waitlist"
              className="px-6 py-3 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--soft)] transition font-semibold inline-flex items-center gap-2"
            >
              Join waitlist <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-[var(--muted)]">
            <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">50+ APIs</div>
            <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">Unified auth</div>
            <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">Agent-ready</div>
            <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">Fast setup</div>
          </div>
        </div>
      </section>

      {/* Book a demo */}
      <section id="demo" className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display">Book a live demo</h2>
            <p className="mt-4 text-[var(--muted)] text-lg">
              See how Callio turns any API into an agent-ready toolchain. Tell us what you're building and we'll tailor the walkthrough.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <BookDemoForm />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="text-sm uppercase tracking-widest text-[var(--muted)]">Live session preview</div>
            <div className="mt-4 rounded-xl bg-[#101418] text-[#e7eef9] p-5 font-mono text-sm">
              <div className="text-[#8ea0c3]">$ callio connect search</div>
              <div className="mt-2">Authenticated OK</div>
              <div className="mt-2">Routing to search-discovery API...</div>
              <div className="mt-3 text-[#7df2b1]">200 OK</div>
              <div className="mt-3 text-[#9ab2d6]">{"{ \"results\": 1,250, \"latency\": \"92ms\" }"}</div>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
              <div>- Custom API onboarding walkthrough</div>
              <div>- Security + auth flow review</div>
              <div>- Agent execution demo with your use case</div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-display text-center">Join the waitlist</h2>
          <p className="mt-4 text-center text-[var(--muted)] text-lg">
            Early access for API providers and AI builders. We email you as soon as your spot opens.
          </p>
          <div className="mt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <div>(c) 2026 Callio. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#demo" className="hover:text-[var(--accent)] transition">Book a demo</a>
            <a href="#waitlist" className="hover:text-[var(--accent)] transition">Waitlist</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
