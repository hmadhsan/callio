import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashApiKey } from '@/lib/keys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/zapier/trigger/[slug]
 *
 * Zapier / Make polling trigger: returns the last 10 usage records for the
 * given API slug, scoped to the authenticated workspace.
 *
 * Auth: Bearer <callio_api_key>   (standard Callio key from /keys)
 *
 * Response shape Zapier expects: an array of objects, each with a unique `id`.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // ── Authenticate via Bearer token ─────────────────────────────────────
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header. Use: Bearer <callio_api_key>' },
                { status: 401 }
            );
        }

        const rawKey = authHeader.slice(7);
        const keyHash = hashApiKey(rawKey);

        const apiKey = await prisma.apiKey.findUnique({
            where: { keyHash },
        });

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        // Check scopes — if the key is scoped, it must include this API
        if (apiKey.scopes.length > 0 && !apiKey.scopes.includes(slug)) {
            return NextResponse.json(
                { error: `Forbidden: key does not have access to "${slug}"` },
                { status: 403 }
            );
        }

        // ── Verify the API exists ────────────────────────────────────────────
        const api = await prisma.api.findUnique({ where: { slug } });
        if (!api) {
            return NextResponse.json(
                { error: `API "${slug}" not found` },
                { status: 404 }
            );
        }

        // ── Fetch last 10 usage records for this workspace + API ─────────────
        const records = await prisma.usageRecord.findMany({
            where: {
                workspaceId: apiKey.workspaceId,
                apiSlug: slug,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        // Map to Zapier-friendly shape (must have unique `id` field)
        const data = records.map((r) => ({
            id: r.id,
            apiSlug: r.apiSlug,
            method: r.method,
            path: r.path,
            statusCode: r.status,
            latencyMs: r.latencyMs,
            triggeredAt: r.createdAt.toISOString(),
        }));

        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Zapier trigger error:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
