import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { stripe, PLANS, PlanId } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { plan } = await request.json() as { plan: PlanId };

    if (!plan || !(plan in PLANS) || plan === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    if (!planConfig.stripePriceId) {
      return NextResponse.json({ error: 'Stripe not configured for this plan. Set STRIPE_PRO_PRICE_ID/STRIPE_TEAM_PRICE_ID.' }, { status: 500 });
    }

    // Find or create Stripe customer
    let subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    let customerId: string;

    if (subscription?.stripeCustomerId) {
      // Validate the stored customer still exists (handles test→live key switch)
      try {
        await stripe.customers.retrieve(subscription.stripeCustomerId);
        customerId = subscription.stripeCustomerId;
      } catch {
        // Customer doesn't exist (likely test→live switch), create a new one
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await prisma.subscription.update({
          where: { userId: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      // Upsert subscription record
      subscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          stripeCustomerId: customerId,
          plan: 'free',
          status: 'active',
        },
      });
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callio.dev';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/pricing`,
      subscription_data: {
        metadata: { userId: user.id, plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Checkout error:', msg);
    return NextResponse.json({ error: 'Failed to create checkout session', detail: msg }, { status: 500 });
  }
}
