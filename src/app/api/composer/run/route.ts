import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workflow = body.workflow;

    if (!workflow || !Array.isArray(workflow.steps)) {
      return NextResponse.json({ error: 'Invalid workflow payload.' }, { status: 400 });
    }

    const CALLIO_BASE_URL = process.env.CALLIO_BASE_URL ?? 'https://callio.dev';
    let CALLIO_API_KEY = process.env.CALLIO_API_KEY;

    // Development override: allow passing a one-off API key via header `x-callio-api-key`
    if (!CALLIO_API_KEY && process.env.NODE_ENV !== 'production') {
      const headerKey = request.headers.get('x-callio-api-key') || request.headers.get('X-Callio-Api-Key');
      if (headerKey) CALLIO_API_KEY = headerKey;
    }

    if (!CALLIO_API_KEY) {
      return NextResponse.json({ error: 'Server missing CALLIO_API_KEY. Set env to run test-run.' }, { status: 400 });
    }

    const results: Array<{ stepId: string; ok: boolean; status: number; body: unknown; error?: string }> = [];

    for (const [idx, step] of workflow.steps.entries()) {
      const slug = step.apiSlug;
      const path = step.path || '/';
      const method = (step.method || 'GET').toUpperCase();

      // Build payload from previous step output when available
      const previous = idx === 0 ? body.input ?? {} : results[idx - 1]?.body ?? {};

      const url = `${CALLIO_BASE_URL.replace(/\/$/, '')}/api/proxy/${slug}${path}`;

      try {
        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${CALLIO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: method === 'GET' ? undefined : JSON.stringify(previous ?? {}),
        });

        const text = await res.text();
        let parsed: unknown = text;
        try {
          parsed = text ? JSON.parse(text) : null;
        } catch {
          parsed = text;
        }

        results.push({ stepId: step.id ?? `step_${idx + 1}`, ok: res.ok, status: res.status, body: parsed });

        if (!res.ok) {
          // stop on failure
          break;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ stepId: step.id ?? `step_${idx + 1}`, ok: false, status: 0, body: null, error: message });
        break;
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Composer run error:', error);
    return NextResponse.json({ error: 'Failed to run workflow.' }, { status: 500 });
  }
}
