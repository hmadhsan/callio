'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import UserNav from '@/components/UserNav';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out Callio',
    features: [
      '100 API requests/month',
      '1 API key',
      'Community support',
      'Public APIs only',
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: '/month',
    description: 'For developers building real products',
    features: [
      '10,000 API requests/month',
      'Unlimited API keys',
      'All APIs including premium',
      'Priority support',
      'Usage analytics',
      'Webhook forwarding',
    ],
    cta: 'Upgrade to Pro',
    href: null, // uses checkout
    highlighted: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 99,
    period: '/month',
    description: 'For teams scaling AI agents',
    features: [
      '100,000 API requests/month',
      'Unlimited API keys',
      'All APIs including premium',
      'Dedicated support',
      'Advanced analytics',
      'Webhook forwarding',
      'Team members (coming soon)',
      'Custom rate limits',
    ],
    cta: 'Upgrade to Team',
    href: null, // uses checkout
    highlighted: false,
  },
];

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  const [loading, setLoading] = useState(false);

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
        alert(data.error || 'Failed to start checkout');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-8 flex flex-col ${
        plan.highlighted
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
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-[var(--muted)] text-sm ml-1">{plan.period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {plan.href ? (
        <Link
          href={plan.href}
          className={`w-full text-center py-3 rounded-lg font-semibold transition ${
            plan.highlighted
              ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]'
              : 'border border-[var(--line)] hover:bg-[var(--soft)]'
          }`}
        >
          {plan.cta}
        </Link>
      ) : (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            plan.highlighted
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
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--line)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Callio
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Browse</Link>
            <Link href="/docs" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Docs</Link>
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition">Dashboard</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Simple, transparent pricing
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
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
              <h3 className="font-semibold mb-1">What counts as an API request?</h3>
              <p className="text-sm text-[var(--muted)]">
                Every call through the Callio proxy counts as one request, regardless of the upstream API or method.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Can I change plans anytime?</h3>
              <p className="text-sm text-[var(--muted)]">
                Yes. Upgrade instantly, downgrade at the end of your billing period. No lock-in contracts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What happens if I hit my limit?</h3>
              <p className="text-sm text-[var(--muted)]">
                API requests will return a 429 status with a link to upgrade. Your existing integrations keep working once you upgrade.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Do I need my own API keys for providers?</h3>
              <p className="text-sm text-[var(--muted)]">
                For most APIs, yes — you bring your own provider key (e.g., OpenAI key, Stripe key). Callio manages the routing and auth injection. Some public APIs work without any provider key.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Is there an enterprise plan?</h3>
              <p className="text-sm text-[var(--muted)]">
                Yes — contact us at hello@callio.dev for custom limits, SLAs, and on-premise options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
