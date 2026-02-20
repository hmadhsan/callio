import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashApiKey } from '@/lib/keys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function isPrivateHost(hostname: string) {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.local')) {
    return true;
  }

  if (/^127\./.test(lower) || /^10\./.test(lower) || /^192\.168\./.test(lower)) {
    return true;
  }

  const match172 = /^172\.(\d+)\./.exec(lower);
  if (match172) {
    const octet = Number(match172[1]);
    if (octet >= 16 && octet <= 31) {
      return true;
    }
  }

  return false;
}

function getCallioKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return request.headers.get('x-callio-key');
}

async function handleProxy(request: NextRequest, params: { apiSlug: string; path?: string[] }) {
  const callioKey = getCallioKey(request);
  if (!callioKey) {
    return NextResponse.json({ error: 'Missing Callio API key' }, { status: 401 });
  }

  const keyHash = hashApiKey(callioKey);
  const apiKey = await prisma.apiKey.findUnique({ where: { keyHash }, include: { api: true } });

  if (!apiKey || !apiKey.api || apiKey.api.slug !== params.apiSlug) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const api = apiKey.api;
  const targetOverride = request.nextUrl.searchParams.get('target');
  const useTargetOverride = Boolean(targetOverride);

  let baseUrl = api.baseUrl || '';
  if (useTargetOverride) {
    baseUrl = targetOverride as string;
  }

  if (!baseUrl) {
    return NextResponse.json({ error: 'API base URL not configured' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(baseUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid target URL' }, { status: 400 });
  }

  if (targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:') {
    return NextResponse.json({ error: 'Target URL must be http or https' }, { status: 400 });
  }

  if (isPrivateHost(targetUrl.hostname)) {
    return NextResponse.json({ error: 'Target URL not allowed' }, { status: 400 });
  }

  if (!useTargetOverride && params.path && params.path.length > 0) {
    const joinedPath = params.path.join('/');
    targetUrl.pathname = [targetUrl.pathname.replace(/\/$/, ''), joinedPath].filter(Boolean).join('/');
  }

  request.nextUrl.searchParams.delete('target');
  const remainingQuery = request.nextUrl.searchParams.toString();
  if (remainingQuery) {
    const existingParams = new URLSearchParams(targetUrl.search);
    const extraParams = new URLSearchParams(remainingQuery);
    extraParams.forEach((value, key) => {
      existingParams.append(key, value);
    });
    targetUrl.search = existingParams.toString();
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lowerKey)) {
      return;
    }
    if (lowerKey === 'authorization' || lowerKey === 'x-callio-key' || lowerKey === 'host') {
      return;
    }
    // Don't request compression from upstream to avoid decompression issues
    if (lowerKey === 'accept-encoding') {
      return;
    }
    headers.set(key, value);
  });

  const credential = await prisma.apiCredential.findUnique({
    where: { userId_apiId: { userId: apiKey.userId, apiId: api.id } },
  });

  const providerKey = credential?.providerKey || api.providerApiKey;
  if (!providerKey && !api.allowUnauthenticated) {
    return NextResponse.json({ 
      error: 'Provider key not configured', 
      message: `You haven't connected your ${api.name} account yet. Go to the API details page and click "Save Provider Key" to connect your account first.`,
      apiName: api.name
    }, { status: 400 });
  }

  if (providerKey) {
    const authHeader = api.providerAuthHeader || 'Authorization';
    const authScheme = api.providerAuthScheme ?? 'Bearer';
    headers.set(authHeader, authScheme ? `${authScheme} ${providerKey}` : providerKey);
  }

  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

  const upstream = await fetch(targetUrl.toString(), {
    method,
    headers,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lowerKey)) {
      return;
    }
    // Skip compression headers to avoid decompression issues
    if (lowerKey === 'content-encoding' || lowerKey === 'transfer-encoding') {
      return;
    }
    responseHeaders.set(key, value);
  });

  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ apiSlug: string; path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ apiSlug: string; path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ apiSlug: string; path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ apiSlug: string; path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ apiSlug: string; path?: string[] }> }) {
  return handleProxy(request, await params);
}
