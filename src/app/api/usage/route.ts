import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace, isAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PLANS, getPlan } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { user, workspace } = await getCurrentUserWithWorkspace();
    if (!user || !workspace) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    let plan = subscription?.plan || 'free';
    if (isAdmin(user.email)) {
      plan = 'admin';
    }
    const planConfig = getPlan(plan);

    // Get usage count for current period
    const periodStart = subscription?.currentPeriodStart || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const usageCount = await prisma.usageRecord.count({
      where: {
        workspaceId: workspace.id,
        createdAt: { gte: periodStart },
      },
    });

    return NextResponse.json({
      plan,
      status: subscription?.status || 'active',
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
      currentPeriodEnd: subscription?.currentPeriodEnd || null,
      usage: {
        used: usageCount,
        limit: planConfig?.requestsPerMonth || PLANS.free.requestsPerMonth,
        percentage: Math.round((usageCount / (planConfig?.requestsPerMonth || PLANS.free.requestsPerMonth)) * 100),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Usage error:', msg);
    return NextResponse.json({ error: 'Failed to get usage' }, { status: 500 });
  }
}
