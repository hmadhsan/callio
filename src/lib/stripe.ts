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

// Plan configuration – keep in sync with Stripe dashboard products.
// IDs (free / starter / pro / team) are stored in the DB — do NOT rename them.
// Display names and limits can be changed freely here.
// When updating prices, update the corresponding Stripe product in the dashboard too.
export const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    requestsPerMonth: 500,
    maxKeys: 2,
    features: [
      '500 proxy requests / month',
      '2 sandbox keys',
      'Full catalog access',
      'MCP server install',
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
  // display name: "Builder"
  starter: {
    name: 'Builder',
    monthlyPrice: 19,
    requestsPerMonth: 10_000,
    maxKeys: 5,
    features: [
      '10,000 proxy requests / month',
      '5 keys (sandbox + production)',
      'Full catalog access',
      'MCP server install',
      'Usage analytics & request logs',
      'Community support',
    ],
    get stripePriceId() { return process.env.STRIPE_STARTER_PRICE_ID?.trim() || null; },
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 49,
    requestsPerMonth: 50_000,
    maxKeys: 20,
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
    get stripePriceId() { return process.env.STRIPE_PRO_PRICE_ID?.trim() || null; },
  },
  // display name: "Scale"
  team: {
    name: 'Scale',
    monthlyPrice: 149,
    requestsPerMonth: 250_000,
    maxKeys: Infinity,
    features: [
      '250,000 proxy requests / month',
      'Unlimited keys & agents',
      'Full catalog access',
      'Advanced analytics',
      'MCP server install',
      'Webhook forwarding',
      '+$1.50 per 1,000 requests over limit',
      'Team members (coming soon)',
      'Custom rate limits',
      'Dedicated support',
    ],
    get stripePriceId() { return process.env.STRIPE_TEAM_PRICE_ID?.trim() || null; },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlan(planId: string): (typeof PLANS)[PlanId] | null {
  if (planId in PLANS) return PLANS[planId as PlanId];
  return null;
}
