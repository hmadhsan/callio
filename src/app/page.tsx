import Link from 'next/link';
import { CalendarDays, Sparkles, ArrowRight, Zap, Lock, Rocket, Gauge, Check } from 'lucide-react';
import WaitlistForm from '@/components/WaitlistForm';

function CallioLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0a0a0a" />
      <path
        d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12c2.1 0 4.08-.54 5.8-1.49"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="28" cy="14" r="3" fill="white" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      {/* Top nav */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-[rgba(250,250,250,0.8)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <CallioLogo size={34} />
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.04),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--line)] bg-white/80">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">API marketplace for agents</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-display tracking-tight leading-tight">
            Connect all your APIs in one place.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[var(--muted)] max-w-2xl">
            Give your agents access to any API they need. Authentication, discovery, and execution—all handled automatically.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="https://cal.com/hammad-hassan-py6mdj/callio-demo?overlayCalendar=true"
              target="_blank"
              rel="noopener noreferrer"
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
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="group rounded-xl border border-[var(--line)] bg-gradient-to-br from-white to-[var(--soft)] hover:border-[var(--accent)] hover:shadow-lg transition px-4 py-5 cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="text-sm font-semibold text-[var(--ink)]">50+ APIs</div>
              <div className="text-xs text-[var(--muted)] mt-1">Ready to go</div>
            </div>
            <div className="group rounded-xl border border-[var(--line)] bg-gradient-to-br from-white to-[var(--soft)] hover:border-[var(--accent)] hover:shadow-lg transition px-4 py-5 cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="text-sm font-semibold text-[var(--ink)]">Unified auth</div>
              <div className="text-xs text-[var(--muted)] mt-1">One setup</div>
            </div>
            <div className="group rounded-xl border border-[var(--line)] bg-gradient-to-br from-white to-[var(--soft)] hover:border-[var(--accent)] hover:shadow-lg transition px-4 py-5 cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="text-sm font-semibold text-[var(--ink)]">Agent-ready</div>
              <div className="text-xs text-[var(--muted)] mt-1">Out of box</div>
            </div>
            <div className="group rounded-xl border border-[var(--line)] bg-gradient-to-br from-white to-[var(--soft)] hover:border-[var(--accent)] hover:shadow-lg transition px-4 py-5 cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="text-sm font-semibold text-[var(--ink)]">Fast setup</div>
              <div className="text-xs text-[var(--muted)] mt-1">Minutes, not days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a demo */}
      <section id="demo" className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display">Book a live demo</h2>
          <p className="mt-4 text-[var(--muted)] text-lg max-w-xl mx-auto">
            See Callio in action. Pick a time that works for you and we'll walk you through everything.
          </p>
          <a
            href="https://cal.com/hammad-hassan-py6mdj/callio-demo?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--accent)] text-white text-lg font-semibold hover:bg-[var(--accent-strong)] transition shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
          >
            Schedule a demo <CalendarDays className="w-5 h-5" />
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> Tailored to your use case</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> 30-min session</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> No commitment</span>
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
