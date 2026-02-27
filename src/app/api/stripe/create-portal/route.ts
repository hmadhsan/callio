import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get(SESSION_COOKIE)?.value;
        if (!token) return NextResponse.redirect(new URL('/login', request.url));

        const user = await getUserFromSessionToken(token);
        if (!user) return NextResponse.redirect(new URL('/login', request.url));

        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id },
        });

        if (!subscription || !subscription.stripeCustomerId) {
            // If the user has no stripe customer id yet, send them to pricing to start a sub
            return NextResponse.redirect(new URL('/pricing', request.url));
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
        });

        return NextResponse.redirect(portalSession.url, 303);
    } catch (err: any) {
        console.error('Error creating Stripe portal session:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
