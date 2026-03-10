import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSubDates(sub: Record<string, unknown>) {
  // Stripe SDK versions differ on property names
  const periodStart = (sub as Record<string, unknown>).current_period_start ?? (sub as Record<string, unknown>).currentPeriodStart;
  const periodEnd = (sub as Record<string, unknown>).current_period_end ?? (sub as Record<string, unknown>).currentPeriodEnd;
  const cancelEnd = (sub as Record<string, unknown>).cancel_at_period_end ?? (sub as Record<string, unknown>).cancelAtPeriodEnd;
  return {
    currentPeriodStart: periodStart ? new Date((periodStart as number) * 1000) : new Date(),
    currentPeriodEnd: periodEnd ? new Date((periodEnd as number) * 1000) : new Date(),
    cancelAtPeriodEnd: Boolean(cancelEnd),
  };
}

// Disable body parsing – Stripe needs raw body
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webhook signature verification failed:', msg);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = sub.metadata.userId;
          const plan = sub.metadata.plan || 'pro';
          const dates = getSubDates(sub as unknown as Record<string, unknown>);

          if (userId) {
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                stripeSubscriptionId: sub.id,
                plan,
                status: sub.status,
                ...dates,
              },
              create: {
                userId,
                stripeCustomerId: sub.customer as string,
                stripeSubscriptionId: sub.id,
                plan,
                status: sub.status,
                ...dates,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata.userId;
        const dates = getSubDates(sub as unknown as Record<string, unknown>);
        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: sub.status,
              plan: sub.status === 'canceled' ? 'free' : undefined,
              ...dates,
            },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Find subscription and attached user
        const subscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true }
        });

        if (subscription?.user?.referredById) {
          // Calculate 20% commission (amount_paid is in cents)
          const amountPaid = invoice.amount_paid / 100;
          if (amountPaid > 0) {
            const commission = amountPaid * 0.20;

            // Credit the affiliate
            await prisma.affiliate.update({
              where: { id: subscription.user.referredById },
              data: {
                balance: { increment: commission },
                totalEarned: { increment: commission },
                conversions: { increment: 1 } // Optionally just incrementing on first payment might be better, but this acts as an activities counter
              }
            });
            console.log(`Credited affiliate ${subscription.user.referredById} with $${commission} for user ${subscription.user.id}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'past_due' },
          });
        }
        break;
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webhook handler error:', msg);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
