import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function parseOpenApi(openapi: any) {
  if (!openapi || typeof openapi !== 'object' || !openapi.paths) {
    return [];
  }

  const endpoints: Array<{
    method: string;
    path: string;
    description: string;
    parameters: Array<{ name: string; type: string; required: boolean; description: string }>;
    responseExample: unknown;
  }> = [];

  Object.entries(openapi.paths).forEach(([path, methods]) => {
    if (!methods || typeof methods !== 'object') {
      return;
    }

    Object.entries(methods as Record<string, any>).forEach(([method, operation]) => {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        return;
      }

      const combinedParams = [
        ...(operation.parameters || []),
        ...((methods as any).parameters || []),
      ];

      const parameters = combinedParams.map((param: any) => ({
        name: param.name || 'param',
        type: param.schema?.type || 'string',
        required: Boolean(param.required),
        description: param.description || '',
      }));

      const responseExample =
        operation.responses?.['200']?.content?.['application/json']?.example ||
        operation.responses?.['200']?.content?.['application/json']?.examples?.default?.value ||
        {};

      endpoints.push({
        method: method.toUpperCase(),
        path,
        description: operation.summary || operation.description || '',
        parameters,
        responseExample,
      });
    });
  });

  return endpoints.slice(0, 100);
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apis = await prisma.api.findMany({
    where: { providerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ apis });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      category,
      icon,
      shortDescription,
      fullDescription,
      documentation,
      authentication,
      rateLimit,
      pricing,
      webhook,
      useCases,
      openapiJson,
    } = body;

    if (!name || !category || !shortDescription || !fullDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let suffix = 1;

    while (await prisma.api.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    let parsedOpenapi = null;
    let endpoints: ReturnType<typeof parseOpenApi> = [];

    if (openapiJson) {
      try {
        parsedOpenapi = typeof openapiJson === 'string' ? JSON.parse(openapiJson) : openapiJson;
        endpoints = parseOpenApi(parsedOpenapi);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid OpenAPI JSON' }, { status: 400 });
      }
    }

    const api = await prisma.api.create({
      data: {
        slug,
        name,
        category,
        icon: icon || '🔌',
        shortDescription,
        fullDescription,
        documentation: documentation || null,
        authentication: authentication || 'API Key (Bearer token)',
        rateLimit: rateLimit || 'Not specified',
        pricing: pricing || 'Contact us',
        webhook: Boolean(webhook),
        useCases: Array.isArray(useCases) ? useCases : [],
        openapiJson: parsedOpenapi,
        providerId: user.id,
      },
    });

    if (endpoints.length > 0) {
      await prisma.endpoint.createMany({
        data: endpoints.map((endpoint) => ({
          apiId: api.id,
          method: endpoint.method,
          path: endpoint.path,
          description: endpoint.description,
          parameters: endpoint.parameters,
          responseExample: endpoint.responseExample,
        })),
      });
    }

    return NextResponse.json({ api }, { status: 201 });
  } catch (error) {
    console.error('API create error:', error);
    return NextResponse.json({ error: 'Unable to create API' }, { status: 500 });
  }
}
