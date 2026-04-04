import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, {
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
    requestsPerMonth: 5,
    maxKeys: 1,
    features: [
      '5 API requests/month',
      '1 API key',
      'Browse catalog & MCP',
      'Upgrade anytime',
    ],
    stripePriceId: null as string | null,
  },
  admin: {
    name: 'Admin',
    monthlyPrice: 0,
    requestsPerMonth: Infinity,
    maxKeys: Infinity,
    features: ['Unlimited everything (Admin only)'],
    stripePriceId: null as string | null,
  },
  starter: {
    name: 'Starter',
    monthlyPrice: 5,
    requestsPerMonth: 50,
    maxKeys: 3,
    features: [
      '50 API requests/month',
      '3 API keys',
      'Access to all APIs',
      'MCP integration',
      'Community support',
    ],
    get stripePriceId() { return process.env.STRIPE_STARTER_PRICE_ID?.trim() || null; },
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 20,
    requestsPerMonth: 5_000,
    maxKeys: 10,
    features: [
      '5,000 API requests/month',
      '10 API keys',
      'Access to all APIs',
      'Full usage analytics',
      'Priority support',
      'MCP integration',
      'Webhook forwarding',
    ],
    get stripePriceId() { return process.env.STRIPE_PRO_PRICE_ID?.trim() || null; },
  },
  team: {
    name: 'Team',
    monthlyPrice: 99,
    requestsPerMonth: 50_000,
    maxKeys: Infinity,
    features: [
      '50,000 API requests/month',
      'Unlimited keys & agents',
      'Access to all APIs',
      'Advanced analytics',
      'Dedicated support',
      'MCP integration',
      'Webhook forwarding',
      'Team members (coming soon)',
      'Custom rate limits',
    ],
    get stripePriceId() { return process.env.STRIPE_TEAM_PRICE_ID?.trim() || null; },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlan(planId: string): (typeof PLANS)[PlanId] | null {
  if (planId in PLANS) return PLANS[planId as PlanId];
  return null;
}
