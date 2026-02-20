import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashApiKey } from '@/lib/keys';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { apiSlug, endpointPath, method, parameters, apiKey } = await request.json();

    if (!apiSlug || !endpointPath || !method || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: apiSlug, endpointPath, method, apiKey' },
        { status: 400 }
      );
    }

    // Validate API key (allow demo testing)
    let apiKeyRecord;
    const keyHash = hashApiKey(apiKey);
    
    try {
      apiKeyRecord = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: { api: true },
      });
    } catch {
      // If key lookup fails, continue with demo mode
      apiKeyRecord = null;
    }

    // Get API info
    const api = await prisma.api.findUnique({
      where: { slug: apiSlug },
      include: { endpoints: true },
    });

    if (!api) {
      return NextResponse.json({ error: 'API not found' }, { status: 404 });
    }

    // Check if key matches API (if key exists)
    if (apiKeyRecord?.api && apiKeyRecord.api.slug !== apiSlug) {
      return NextResponse.json({ error: 'API key does not match this API' }, { status: 401 });
    }

    // Build request URL
    let url = `${api.baseUrl}${endpointPath}`;

    // Replace path parameters
    if (parameters && typeof parameters === 'object') {
      Object.entries(parameters).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          url = url.replace(`{${key}}`, String(value));
        }
      });
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add auth header if it looks like a real key (not a placeholder)
    if (apiKey && !apiKey.includes('_') && apiKey.length > 10) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Add provider auth if needed
    if (api.providerApiKey && api.providerAuthHeader) {
      headers[api.providerAuthHeader] = api.providerApiKey;
    }

    // Prepare request body for POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && parameters) {
      // Filter out empty parameters
      const filteredParams: Record<string, any> = {};
      Object.entries(parameters).forEach(([key, value]) => {
        if (value && typeof value === 'string' ? value.trim() : value) {
          filteredParams[key] = value;
        }
      });
      body = JSON.stringify(filteredParams);
    }

    // Make the request to the actual API
    console.log(`Test request: ${method} ${url}`);
    const startTime = Date.now();
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseTime = Date.now() - startTime;
    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return NextResponse.json(
      {
        status: response.status,
        statusText: response.statusText,
        responseTime,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test request error:', error);
    return NextResponse.json(
      { error: 'Failed to execute test request', details: String(error) },
      { status: 500 }
    );
  }
}

