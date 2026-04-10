import type { ApiKeyEnvironment } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashApiKey } from '@/lib/keys';
import { PLANS } from '@/lib/stripe';
import { decryptProviderKey } from '@/lib/crypto';
import { getUserFromSessionToken, getActiveWorkspace, SESSION_COOKIE, isAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  // Try Bearer token first
  if (authHeader?.startsWith('Bearer ')) {
    const rawKey = authHeader.slice(7);
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: true },
    });

    if (apiKey && !apiKey.deletedAt) {
      return {
        userId: apiKey.userId,
        userEmail: apiKey.user?.email ?? null,
        workspaceId: apiKey.workspaceId,
        type: 'api_key' as const,
        scopes: apiKey.scopes,
        keyId: apiKey.id,
        monthlyLimit: apiKey.monthlyLimit,
        environment: apiKey.environment,
      };
    }
  }

  // Fallback to session cookie for playground testing 
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const user = await getUserFromSessionToken(token);
    if (user) {
      const workspace = await getActiveWorkspace(user.id);
      return {
        userId: user.id,
        userEmail: user.email,
        workspaceId: workspace?.id,
        type: 'session' as const,
        scopes: [] as string[],
        keyId: null,
        monthlyLimit: null,
        environment: 'production' as ApiKeyEnvironment,
      };
    }
  }

  return null;
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ apiSlug: string; path: string[] }> }
) {
  try {
    const { apiSlug, path } = await params;

    // Authenticate
    const auth = await authenticateRequest(request);
    if (!auth || !auth.workspaceId) {
      return NextResponse.json({ error: 'Invalid or missing API key, or no active workspace found.' }, { status: 401 });
    }

    // Check API Scoping
    if (auth.type === 'api_key' && auth.scopes && auth.scopes.length > 0) {
      if (!auth.scopes.includes(apiSlug)) {
        return NextResponse.json({ error: `Forbidden: API key does not have access to "${apiSlug}"` }, { status: 403 });
      }
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
      let base = api.baseUrl.replace(/\/$/, '');
      let pathToAppend = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;

      try {
        const url = new URL(base);
        if (url.pathname !== '/' && url.pathname.length > 1) {
          // Check if pathToAppend starts with the pathname from baseUrl (e.g. Hunter /v2)
          if (pathToAppend.startsWith(url.pathname)) {
            // Trim the overlapping path from the base URL so we don't duplicate it
            base = base.substring(0, base.length - url.pathname.length);
          }
        }
      } catch (e) {
        // Ignore parsing errors and fallback to simple concat
      }

      targetUrl = `${base}${pathToAppend}`;

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
      // Check if workspace has stored a provider key
      const credential = await prisma.apiCredential.findFirst({
        where: {
          workspaceId: auth.workspaceId,
          apiId: api.id,
        },
      });

      if (credential) {
        const scheme = api.providerAuthScheme || 'Bearer';
        const header = api.providerAuthHeader || 'Authorization';
        const decryptedKey = decryptProviderKey(credential.providerKey);
        upstreamHeaders[header] = `${scheme} ${decryptedKey}`;
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
      where: { userId: auth.userId },
      include: { user: true },
    });
    let plan = (subscription?.plan || 'free') as keyof typeof PLANS;
    if (isAdmin(auth.userEmail)) {
      plan = 'admin';
    }
    const limit = PLANS[plan]?.requestsPerMonth || PLANS.free.requestsPerMonth;

    const periodStart = subscription?.currentPeriodStart
      || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const usageEnv: ApiKeyEnvironment =
      auth.type === 'api_key' ? auth.environment : 'production';

    const usageCount = await prisma.usageRecord.count({
      where: {
        workspaceId: auth.workspaceId,
        createdAt: { gte: periodStart },
        environment: 'production',
      },
    });

    // Check specific API Key limit
    if (auth.type === 'api_key' && auth.monthlyLimit) {
      const keyUsageCount = await prisma.usageRecord.count({
        where: {
          apiKeyId: auth.keyId,
          createdAt: { gte: periodStart },
        },
      });

      if (keyUsageCount >= auth.monthlyLimit) {
        return NextResponse.json({
          error: `API Key monthly limit of ${auth.monthlyLimit} requests reached`,
          used: keyUsageCount,
          limit: auth.monthlyLimit,
        }, { status: 429 });
      }
    }

    if (usageEnv === 'production' && usageCount >= limit) {
      return NextResponse.json({
        error: 'Monthly request limit reached for this account',
        plan,
        used: usageCount,
        limit,
        upgrade: 'https://callio.dev/pricing',
      }, { status: 429 });
    }

    // Reserve a usage slot before making the upstream call (prevents race condition)
    const usageRecord = await prisma.usageRecord.create({
      data: {
        userId: auth.userId,
        workspaceId: auth.workspaceId,
        apiSlug,
        apiKeyId: auth.keyId,
        method: request.method,
        path: pathStr,
        status: 0,
        latencyMs: 0,
        environment: usageEnv,
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
    responseHeaders.set('x-callio-environment', usageEnv);
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
