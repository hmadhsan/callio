import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSessionToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    const apiSlug = url.searchParams.get('apiSlug');

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Build filter
    const where: any = {
      workspaceId: workspace.id,
      createdAt: { gte: startDate },
    };

    if (apiSlug) {
      where.apiSlug = apiSlug;
    }

    // Get all logs in the time range
    const logs = await prisma.apiCallLog.findMany({
      where,
      select: {
        status: true,
        latencyMs: true,
        requestSize: true,
        responseSize: true,
        errorMessage: true,
        apiSlug: true,
        createdAt: true,
      },
    });

    // Calculate aggregated stats
    const stats = {
      totalRequests: logs.length,
      successCount: logs.filter(l => l.status >= 200 && l.status < 300).length,
      errorCount: logs.filter(l => l.status >= 400).length,
      avgLatencyMs: logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / logs.length) : 0,
      minLatencyMs: logs.length > 0 ? Math.min(...logs.map(l => l.latencyMs)) : 0,
      maxLatencyMs: logs.length > 0 ? Math.max(...logs.map(l => l.latencyMs)) : 0,
      totalRequestSize: logs.reduce((sum, l) => sum + (l.requestSize || 0), 0),
      totalResponseSize: logs.reduce((sum, l) => sum + (l.responseSize || 0), 0),
      statusCounts: getStatusCounts(logs),
      apiBreakdown: getApiBreakdown(logs),
    };

    // Calculate hourly trend for the last 24 hours if days >= 1
    const hourlyTrend = getHourlyTrend(logs, days);

    return NextResponse.json({
      stats,
      hourlyTrend,
      period: { days, startDate: startDate.toISOString() },
    });
  } catch (error: unknown) {
    console.error('Observability stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

function getStatusCounts(logs: any[]): Record<number, number> {
  const counts: Record<number, number> = {};
  logs.forEach(log => {
    const code = log.status;
    counts[code] = (counts[code] || 0) + 1;
  });
  return counts;
}

function getApiBreakdown(logs: any[]): Record<string, { count: number; avgLatency: number; errorCount: number }> {
  const breakdown: Record<string, { count: number; avgLatency: number; errorCount: number }> = {};
  logs.forEach(log => {
    const api = log.apiSlug;
    if (!breakdown[api]) {
      breakdown[api] = { count: 0, avgLatency: 0, errorCount: 0 };
    }
    breakdown[api].count++;
    breakdown[api].avgLatency += log.latencyMs;
    if (log.status >= 400) {
      breakdown[api].errorCount++;
    }
  });

  // Calculate averages
  Object.keys(breakdown).forEach(api => {
    breakdown[api].avgLatency = Math.round(breakdown[api].avgLatency / breakdown[api].count);
  });

  return breakdown;
}

function getHourlyTrend(logs: any[], days: number): any[] {
  const trend: Record<string, { timestamp: string; count: number; errors: number }> = {};

  logs.forEach(log => {
    const date = new Date(log.createdAt);
    const hour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    const key = hour.toISOString();

    if (!trend[key]) {
      trend[key] = { timestamp: key, count: 0, errors: 0 };
    }
    trend[key].count++;
    if (log.status >= 400) {
      trend[key].errors++;
    }
  });

  return Object.values(trend).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
