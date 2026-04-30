'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import UserNav from '@/components/UserNav';
import CallioLogo from '@/components/CallioLogo';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Prototype your agent, no card needed',
    features: [
      '500 proxy requests / month',
      '2 sandbox keys',
      'Full catalog access',
      'MCP server install',
    ],
    cta: 'Sign up free',
    href: '/signup',
    highlighted: false,
  },
  {
    id: 'starter',
    name: 'Builder',
    price: 19,
    period: '/month',
    description: 'Ship your first AI product without watching every call',
    features: [
      '10,000 proxy requests / month',
      '5 keys (sandbox + production)',
      'Full catalog access',
      'MCP server install',
      'Usage analytics & request logs',
      'Community support',
    ],
    cta: 'Get started',
    href: null,
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: '/month',
    description: 'For agents in production that real users depend on',
    features: [
      '50,000 proxy requests / month',
      '20 keys (sandbox + production)',
      'Full catalog access',
      'Usage analytics & request logs',
      'MCP server install',
      'Webhook forwarding',
      '+$2 per 1,000 requests over limit',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    href: null,
    highlighted: true,
  },
  {
    id: 'team',
    name: 'Scale',
    price: 149,
    period: '/month',
    description: 'High-volume or multi-agent systems',
    features: [
      '250,000 proxy requests / month',
      'Unlimited keys & agents',
      'Full catalog access',
      'Advanced analytics',
      'MCP server install',
      'Webhook forwarding',
      '+$1.50 per 1,000 requests over limit',
      'Custom rate limits',
      'Team members (coming soon)',
      'Dedicated support',
    ],
    cta: 'Upgrade to Scale',
    href: null,
    highlighted: false,
  },
];

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setLoggedIn(!!data?.user))
      .catch(() => { });

    const onAuthChange = (e: Event) => {
      setLoggedIn(!!(e as CustomEvent).detail?.user);
    };
    window.addEventListener('callio:auth-change', onAuthChange);
    return () => window.removeEventListener('callio:auth-change', onAuthChange);
  }, []);

  const effectiveHref = plan.href;
  const effectiveCta = plan.cta;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.detail || data.error || 'Failed to start checkout');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-8 flex flex-col ${plan.highlighted
        ? 'border-[var(--accent)] shadow-lg ring-1 ring-[var(--accent)] relative'
        : 'border-[var(--line)]'
        }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
      <p className="text-sm text-[var(--muted)] mb-4">{plan.description}</p>
      <div className="mb-6">
        {plan.price === 0 ? (
          <span className="text-4xl font-bold">Free</span>
        ) : (
          <>
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-[var(--muted)] text-sm ml-1">{plan.period}</span>
          </>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {effectiveHref ? (
        <Link
          href={effectiveHref}
          className={`w-full text-center py-3 rounded-lg font-semibold transition ${plan.highlighted
            ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]'
            : 'border border-[var(--line)] hover:bg-[var(--soft)]'
            }`}
        >
          {effectiveCta}
        </Link>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${plan.highlighted
            ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-50'
            : 'border border-[var(--line)] hover:bg-[var(--soft)] disabled:opacity-50'
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            plan.cta
          )}
        </button>
      )}
      {plan.price > 0 && (
        <p className="text-xs text-center text-[var(--muted)] mt-3">Cancel anytime, no questions asked</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <CallioLogo size={30} />
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Docs</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Pricing built around your agent traffic
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Start free. Pay as your agent calls more APIs in production. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-1">What counts as a proxy request?</h3>
              <p className="text-sm text-[var(--muted)]">
                Every HTTP call routed through the Callio gateway counts as one request, regardless of the upstream API, method, or payload size. Sandbox key traffic never counts toward your quota.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What does the Free plan include?</h3>
              <p className="text-sm text-[var(--muted)]">
                <strong>500 proxy requests per month</strong> and <strong>2 sandbox keys</strong> so you can build, test, and install MCP into your agent before committing to a paid tier. No card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What happens if I go over my limit?</h3>
              <p className="text-sm text-[var(--muted)]">
                On Free and Builder, requests return a 429 until the next billing period or you upgrade. On Pro and Scale there is an overage rate ($2 and $1.50 per 1,000 requests respectively) so your agent keeps running — no hard cutoff.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Do I need my own provider keys?</h3>
              <p className="text-sm text-[var(--muted)]">
                For most upstream APIs, yes — you bring your own key (e.g., your OpenAI key, your SendGrid key) and Callio injects it at the proxy. It is stored AES-256 encrypted. Some public APIs work without any provider key.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Can I change plans anytime?</h3>
              <p className="text-sm text-[var(--muted)]">
                Yes. Upgrade instantly and the new limits take effect immediately. Downgrade takes effect at the end of your current billing period. No lock-in contracts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Is there an enterprise or custom plan?</h3>
              <p className="text-sm text-[var(--muted)]">
                Yes — <Link href="/contact" className="text-[var(--accent)] hover:underline">contact us</Link> for volume pricing, custom rate limits, SLAs, and on-premise options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
