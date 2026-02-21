import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

// Keep a convenience alias but lazy
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

// Plan configuration – keep in sync with Stripe dashboard products
export const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    requestsPerMonth: 100,
    features: [
      '100 API requests/month',
      '1 API key',
      'Community support',
      'Public APIs only',
    ],
    stripePriceId: null as string | null,
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 20,
    requestsPerMonth: 10_000,
    features: [
      '10,000 API requests/month',
      'Unlimited API keys',
      'All APIs including premium',
      'Priority support',
      'Usage analytics',
      'Webhook forwarding',
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || null,
  },
  team: {
    name: 'Team',
    monthlyPrice: 99,
    requestsPerMonth: 100_000,
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
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID || null,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlan(planId: string): (typeof PLANS)[PlanId] | null {
  if (planId in PLANS) return PLANS[planId as PlanId];
  return null;
}
