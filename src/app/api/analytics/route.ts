import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithWorkspace } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { user, workspace } = await getCurrentUserWithWorkspace();

        if (!user || !workspace) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '30', 10);

        // Calculate the cutoff date
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        cutoff.setHours(0, 0, 0, 0);

        // Fetch all raw usage records for this workspace in the timeframe
        // Note: In a production app with millions of rows, you'd want to use Prisma's `groupBy`
        // or raw SQL query, but fetching raw and mapping in JS is fine for our scale.
        const records = await prisma.usageRecord.findMany({
            where: {
                workspaceId: workspace.id,
                environment: 'production',
                createdAt: {
                    gte: cutoff,
                }
            },
            select: {
                apiSlug: true,
                path: true,
                createdAt: true,
                latencyMs: true,
            }
        });

        // 1. Group Requests by Date for Line Chart
        const requestsByDate: Record<string, number> = {};

        // Pre-fill last N days so the chart doesn't have gaps
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            requestsByDate[dateStr] = 0;
        }

        // 2. Group Latency by Endpoint for Bar Chart
        const latencyByEndpoint: Record<string, { totalLatency: number, count: number }> = {};

        records.forEach(record => {
            // Aggregate Date
            const dateStr = new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (requestsByDate[dateStr] !== undefined) {
                requestsByDate[dateStr]++;
            } else {
                requestsByDate[dateStr] = 1;
            }

            // Aggregate Endpoint
            const endpointRef = `/${record.apiSlug}/${record.path}`.replace(/\/+/g, '/');
            if (!latencyByEndpoint[endpointRef]) {
                latencyByEndpoint[endpointRef] = { totalLatency: 0, count: 0 };
            }
            latencyByEndpoint[endpointRef].totalLatency += record.latencyMs;
            latencyByEndpoint[endpointRef].count++;
        });

        const requestData = Object.keys(requestsByDate).map(date => ({
            date,
            requests: requestsByDate[date],
        }));

        const latencyData = Object.keys(latencyByEndpoint).map(endpoint => ({
            endpoint,
            avgLatency: latencyByEndpoint[endpoint].totalLatency / latencyByEndpoint[endpoint].count,
            calls: latencyByEndpoint[endpoint].count,
        }));

        return NextResponse.json({
            requestData,
            latencyData,
        });

    } catch (err: any) {
        console.error('Analytics aggregation error:', err);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
