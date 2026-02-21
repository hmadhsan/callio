import Link from 'next/link';
import {
  CalendarDays, Sparkles, Zap, Lock, Rocket, Gauge, Check,
  Search, Shield, Cpu, Globe, MessageSquare, Database, BarChart3, CreditCard,
  Mail, Cloud, Code2, ChevronDown, Terminal, Layers, Workflow
} from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogoComponent from '@/components/CallioLogo';
import AuthAwareCTA from '@/components/AuthAwareCTA';

const API_CATEGORIES = [
  { icon: Search, name: 'Search', desc: 'Web, news, products' },
  { icon: Mail, name: 'Email', desc: 'Send, verify, find' },
  { icon: CreditCard, name: 'Payments', desc: 'Stripe, billing' },
  { icon: Database, name: 'Data', desc: 'Enrich, scrape, extract' },
  { icon: MessageSquare, name: 'Messaging', desc: 'SMS, chat, notifications' },
  { icon: BarChart3, name: 'Analytics', desc: 'Tracking, insights' },
  { icon: Cloud, name: 'Cloud', desc: 'AWS, GCP, Azure' },
  { icon: Shield, name: 'Identity', desc: 'Auth, KYC, verify' },
  { icon: Globe, name: 'Social', desc: 'LinkedIn, X, Instagram' },
  { icon: Cpu, name: 'AI / ML', desc: 'Models, embeddings' },
  { icon: Code2, name: 'Dev Tools', desc: 'GitHub, CI/CD, logs' },
  { icon: Layers, name: 'Storage', desc: 'Files, S3, CDN' },
];

const FAQS = [
  {
    q: 'What is Callio?',
    a: 'Callio is an API marketplace and gateway built for AI agents. It lets your agents discover, authenticate, and call any API through a single unified interface.',
  },
  {
    q: 'How is this different from just calling APIs directly?',
    a: 'With Callio, you don\'t manage individual API keys, handle different auth flows, or write custom integration code for each API. One setup, all APIs.',
  },
  {
    q: 'Who is Callio for?',
    a: 'AI developers building agent workflows, API providers wanting distribution to AI agents, and startups that need to ship fast without infrastructure overhead.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes. We have a generous free tier for developers. Sign up to get started instantly.',
  },
  {
    q: 'Can I add my own API to Callio?',
    a: 'Absolutely. API providers can list their APIs on Callio and get instant distribution to thousands of AI agents. Book a demo to learn more.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[var(--line)]">
      <summary className="flex items-center justify-between py-5 cursor-pointer text-left">
        <span className="font-medium text-[var(--ink)] pr-4">{q}</span>
        <ChevronDown className="w-5 h-5 text-[var(--muted)] shrink-0 group-open:rotate-180 transition-transform" />
      </summary>
      <p className="pb-5 text-[var(--muted)] leading-relaxed">{a}</p>
    </details>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-[rgba(250,250,250,0.8)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <CallioLogoComponent size={34} />
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/browse" className="hover:text-[var(--accent)] transition">Browse APIs</Link>
            <Link href="/pricing" className="hover:text-[var(--accent)] transition">Pricing</Link>
            <Link href="/docs" className="hover:text-[var(--accent)] transition">Docs</Link>
            <Link href="/how-it-works" className="hover:text-[var(--accent)] transition">How it works</Link>
          </nav>
          <UserNav variant="landing" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.04),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--line)] bg-white/80">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">API marketplace for agents</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-display tracking-tight leading-tight max-w-3xl">
            One gateway for every API<br className="hidden sm:block" /> your agents need.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[var(--muted)] max-w-2xl">
            Give your agents access to any API — search, payments, email, data, and more. Authentication, discovery, and execution handled automatically.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <AuthAwareCTA
              className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] transition"
            />
            <Link
              href="/browse"
              className="px-6 py-3 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--soft)] transition font-semibold inline-flex items-center gap-2"
            >
              Browse APIs <Search className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">50+</div>
              <div className="text-[var(--muted)]">APIs available</div>
            </div>
            <div className="w-px bg-[var(--line)]" />
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">1</div>
              <div className="text-[var(--muted)]">API key needed</div>
            </div>
            <div className="w-px bg-[var(--line)]" />
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">&lt;5 min</div>
              <div className="text-[var(--muted)]">Setup time</div>
            </div>
            <div className="w-px bg-[var(--line)] hidden sm:block" />
            <div className="hidden sm:block">
              <div className="text-2xl font-semibold text-[var(--ink)]">99.9%</div>
              <div className="text-[var(--muted)]">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">How it works</h2>
            <p className="mt-3 text-[var(--muted)] text-lg max-w-xl mx-auto">Three steps. That&apos;s it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display text-[var(--line)] select-none">1</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center mb-4">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect once</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Get a single API key. That&apos;s your access to the entire Callio marketplace — no per-API setup.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display text-[var(--line)] select-none">2</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Discover APIs</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Browse or let your agent search for the right API. Callio handles auth, rate limits, and routing.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-2 text-6xl font-display text-[var(--line)] select-none">3</div>
              <div className="relative bg-[var(--page-bg)] rounded-2xl border border-[var(--line)] p-6 pt-10 h-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center mb-4">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Execute &amp; ship</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Call any API through one unified endpoint. Your agent handles the rest — you ship faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Code snippet ── */}
      <section className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display">Simple to integrate</h2>
            <p className="mt-4 text-[var(--muted)] text-lg">
              One API key. One endpoint. Every API your agent needs — no boilerplate, no per-service auth headaches.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">Works with any language or framework</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">SDKs for Python, TypeScript, Go</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[var(--ink)]" />
                <span className="text-[var(--muted)]">OpenAPI spec for every listed API</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0a0a0a] text-[#e4e4e7] p-6 font-mono text-sm leading-relaxed overflow-x-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="text-[#6b7280] mb-1"># Install</div>
            <div><span className="text-[#a78bfa]">pip install</span> callio</div>
            <div className="mt-4 text-[#6b7280]"># Use any API in 3 lines</div>
            <div><span className="text-[#60a5fa]">from</span> callio <span className="text-[#60a5fa]">import</span> Callio</div>
            <div className="mt-1">client = Callio(<span className="text-[#fbbf24]">api_key</span>=<span className="text-[#34d399]">&quot;callio_...&quot;</span>)</div>
            <div className="mt-3 text-[#6b7280]"># Search the web</div>
            <div>results = client.<span className="text-[#fbbf24]">call</span>(<span className="text-[#34d399]">&quot;search&quot;</span>, query=<span className="text-[#34d399]">&quot;latest AI news&quot;</span>)</div>
            <div className="mt-3 text-[#6b7280]"># Send an email</div>
            <div>client.<span className="text-[#fbbf24]">call</span>(<span className="text-[#34d399]">&quot;email/send&quot;</span>, to=<span className="text-[#34d399]">&quot;user@co.com&quot;</span>, body=<span className="text-[#34d399]">&quot;Hello!&quot;</span>)</div>
            <div className="mt-3 text-[#6b7280]"># Enrich a lead</div>
            <div>lead = client.<span className="text-[#fbbf24]">call</span>(<span className="text-[#34d399]">&quot;enrich&quot;</span>, email=<span className="text-[#34d399]">&quot;ceo@startup.io&quot;</span>)</div>
          </div>
        </div>
      </section>

      {/* ── API Showcase ── */}
      <section id="apis" className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">APIs for everything</h2>
            <p className="mt-3 text-[var(--muted)] text-lg max-w-xl mx-auto">
              Search, payments, AI, scraping, messaging — all accessible through one gateway.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {API_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="group rounded-xl border border-[var(--line)] bg-[var(--page-bg)] hover:border-[var(--accent)] hover:shadow-md transition p-5 cursor-default"
              >
                <cat.icon className="w-6 h-6 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">{cat.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            And many more. New APIs added every week.
          </p>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display">Built for</h2>
            <p className="mt-3 text-[var(--muted)] text-lg">Whether you build agents or provide APIs — Callio is for you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI developers</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Give your agents real-world capabilities. One API key to search the web, send emails, process payments, enrich data, and more.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">API providers</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                List your API on Callio and get instant distribution to thousands of AI agents. No sales team needed — agents discover and use your API automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center mb-5">
                <Rocket className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Startups</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Ship in days, not months. Skip the infrastructure work — Callio handles auth, rate limiting, and routing so you can focus on your product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-24 bg-white border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-display text-center mb-10">Frequently asked questions</h2>
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Book a demo ── */}
      <section id="demo" className="py-20 sm:py-24 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display">See it in action</h2>
          <p className="mt-4 text-[var(--muted)] text-lg max-w-xl mx-auto">
            Pick a time and we&apos;ll walk you through everything — tailored to your use case.
          </p>
          <a
            href="https://cal.com/hammad-hassan-py6mdj/callio-demo?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--accent)] text-white text-lg font-semibold hover:bg-[var(--accent-strong)] transition shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
          >
            Schedule a demo <CalendarDays className="w-5 h-5" />
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> 30-min session</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> Tailored walkthrough</span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-[var(--ink)]" /> No commitment</span>
          </div>
        </div>
      </section>

      {/* ── Contact Us ── */}
      <section id="contact" className="py-20 sm:py-24 bg-[var(--accent)] text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display">Get in touch</h2>
          <p className="mt-4 text-white/70 text-lg">
            Have questions, feedback, or want to list your API? We&apos;d love to hear from you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:founders@callio.dev"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[var(--accent)] font-semibold rounded-full hover:bg-white/90 transition text-sm"
            >
              <Mail className="w-4 h-4" />
              founders@callio.dev
            </a>
            <AuthAwareCTA
              className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 bg-[#0a0a0a] text-[#a1a1aa]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="#fff" />
                  <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12c2.1 0 4.08-.54 5.8-1.49" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="14" r="3" fill="#0a0a0a" />
                </svg>
                <span className="text-white font-semibold">Callio</span>
              </div>
              <p className="text-sm max-w-xs">The API marketplace for AI agents. One gateway to discover, authenticate, and execute any API.</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Product</div>
                <div className="space-y-2">
                  <Link href="/browse" className="block hover:text-white transition">Browse APIs</Link>
                  <Link href="/pricing" className="block hover:text-white transition">Pricing</Link>
                  <Link href="/how-it-works" className="block hover:text-white transition">How it works</Link>
                  <Link href="/docs" className="block hover:text-white transition">Docs</Link>
                  <a href="https://cal.com/hammad-hassan-py6mdj/callio-demo?overlayCalendar=true" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Book a demo</a>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Account</div>
                <div className="space-y-2">
                  <Link href="/signup" className="block hover:text-white transition">Sign Up</Link>
                  <Link href="/login" className="block hover:text-white transition">Log In</Link>
                  <Link href="/dashboard" className="block hover:text-white transition">Dashboard</Link>
                  <Link href="/keys" className="block hover:text-white transition">API Keys</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2">
                  <a href="#contact" className="block hover:text-white transition">Contact</a>
                  <a href="mailto:founders@callio.dev" className="block hover:text-white transition">Contact</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>&copy; 2026 Callio. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">X / Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
              <a href="mailto:founders@callio.dev" className="hover:text-white transition">founders@callio.dev</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
