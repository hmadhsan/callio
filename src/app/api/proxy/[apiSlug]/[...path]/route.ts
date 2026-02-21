import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashApiKey } from '@/lib/keys';
import { PLANS } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const rawKey = authHeader.slice(7);
  const keyHash = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { user: true },
  });

  return apiKey;
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ apiSlug: string; path: string[] }> }
) {
  try {
    const { apiSlug, path } = await params;

    // Authenticate
    const apiKey = await authenticateRequest(request);
    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or missing API key. Pass your Callio key as: Authorization: Bearer callio_...' }, { status: 401 });
    }

    // Find the API
    const api = await prisma.api.findUnique({ where: { slug: apiSlug } });
    if (!api) {
      return NextResponse.json({ error: `API "${apiSlug}" not found` }, { status: 404 });
    }

    // Build target URL
    let targetUrl: string;
    const pathStr = path?.join('/') || '';

    // Check for ?target= parameter (forwarding mode)
    const url = new URL(request.url);
    const targetParam = url.searchParams.get('target');

    if (targetParam) {
      targetUrl = targetParam;
    } else if (api.baseUrl) {
      targetUrl = `${api.baseUrl.replace(/\/$/, '')}/${pathStr}`;
      // Forward query params
      const queryParams = new URLSearchParams();
      url.searchParams.forEach((value, key) => {
        if (key !== 'target') {
          queryParams.set(key, value);
        }
      });
      const qs = queryParams.toString();
      if (qs) targetUrl += `?${qs}`;
    } else {
      return NextResponse.json({ error: 'This API has no base URL configured' }, { status: 400 });
    }

    // Build headers for upstream request
    const upstreamHeaders: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'User-Agent': 'Callio-Proxy/1.0',
    };

    // If API requires provider auth, get the user's stored credential
    if (!api.allowUnauthenticated) {
      // Check if user has stored a provider key
      const credential = await prisma.apiCredential.findUnique({
        where: {
          userId_apiId: {
            userId: apiKey.userId,
            apiId: api.id,
          },
        },
      });

      if (credential) {
        const scheme = api.providerAuthScheme || 'Bearer';
        const header = api.providerAuthHeader || 'Authorization';
        upstreamHeaders[header] = `${scheme} ${credential.providerKey}`;
      } else if (api.providerApiKey) {
        // Use the API's built-in key (for demo/free APIs)
        const scheme = api.providerAuthScheme || 'Bearer';
        const header = api.providerAuthHeader || 'Authorization';
        upstreamHeaders[header] = `${scheme} ${api.providerApiKey}`;
      } else {
        return NextResponse.json({
          error: 'Provider API key not configured. Save your provider key in the API settings.',
          code: 'PROVIDER_KEY_MISSING',
        }, { status: 403 });
      }
    }

    // ── Usage limit check ──────────────────────────────────
    const subscription = await prisma.subscription.findUnique({
      where: { userId: apiKey.userId },
    });
    const plan = (subscription?.plan || 'free') as keyof typeof PLANS;
    const limit = PLANS[plan]?.requestsPerMonth || PLANS.free.requestsPerMonth;

    // ── Plan-based API access check (free = public APIs only) ──
    const canAccessPremium = PLANS[plan]?.premiumApis ?? false;
    if (!canAccessPremium && !api.allowUnauthenticated) {
      return NextResponse.json({
        error: 'This API requires a Pro or Team plan. Free accounts can only use public APIs.',
        plan,
        upgrade: 'https://callio.dev/pricing',
      }, { status: 403 });
    }

    const periodStart = subscription?.currentPeriodStart
      || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const usageCount = await prisma.usageRecord.count({
      where: {
        userId: apiKey.userId,
        createdAt: { gte: periodStart },
      },
    });

    if (usageCount >= limit) {
      return NextResponse.json({
        error: 'Monthly request limit reached',
        plan,
        used: usageCount,
        limit,
        upgrade: 'https://callio.dev/pricing',
      }, { status: 429 });
    }

    // Reserve a usage slot before making the upstream call (prevents race condition)
    const usageRecord = await prisma.usageRecord.create({
      data: {
        userId: apiKey.userId,
        apiSlug,
        method: request.method,
        path: pathStr,
        status: 0,
        latencyMs: 0,
      },
    });

    // Make the upstream request
    const startTime = Date.now();
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: upstreamHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.text();
        if (body) fetchOptions.body = body;
      } catch {
        // No body
      }
    }

    const upstream = await fetch(targetUrl, fetchOptions);
    const latencyMs = Date.now() - startTime;

    // Update usage record with actual status and latency (non-blocking)
    prisma.usageRecord.update({
      where: { id: usageRecord.id },
      data: { status: upstream.status, latencyMs },
    }).catch((err: unknown) => console.error('Usage record update error:', err));

    // Return the upstream response — intercept provider auth errors for better messaging
    const responseBody = await upstream.text();
    
    // If upstream returned 401/403 with auth error, it likely means the stored provider key is wrong
    if (upstream.status === 401 || upstream.status === 403) {
      try {
        const errorData = JSON.parse(responseBody);
        const errorMsg = errorData?.error?.message || errorData?.message || '';
        if (errorMsg.includes('Incorrect API key') || errorMsg.includes('invalid_api_key') || errorMsg.includes('Invalid API Key')) {
          return NextResponse.json({
            error: 'Your saved provider key is invalid or expired. Please re-save the correct provider key on the API detail page.',
            code: 'PROVIDER_KEY_INVALID',
            upstream_error: errorMsg,
          }, { status: 403 });
        }
      } catch {
        // Not JSON, just pass through
      }
    }
    
    const responseHeaders = new Headers();
    responseHeaders.set('content-type', upstream.headers.get('content-type') || 'application/json');
    responseHeaders.set('x-callio-proxy', 'true');
    responseHeaders.set('x-callio-api', apiSlug);
    responseHeaders.set('x-callio-upstream-status', String(upstream.status));

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    console.error('Proxy error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Proxy request failed', detail: error instanceof Error ? error.message : String(error) }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
