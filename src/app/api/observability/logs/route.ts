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
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const apiSlug = url.searchParams.get('apiSlug');
    const status = url.searchParams.get('status');
    const days = parseInt(url.searchParams.get('days') || '7');

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {
      workspaceId: workspace.id,
      createdAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (apiSlug) {
      where.apiSlug = apiSlug;
    }

    if (status) {
      const statusCode = parseInt(status);
      if (!isNaN(statusCode)) {
        where.status = statusCode;
      }
    }

    // Fetch logs and total count
    const [logs, total] = await Promise.all([
      prisma.apiCallLog.findMany({
        where,
        select: {
          id: true,
          apiSlug: true,
          method: true,
          path: true,
          status: true,
          latencyMs: true,
          requestSize: true,
          responseSize: true,
          errorMessage: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.apiCallLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Observability logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
