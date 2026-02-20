import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromSessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const user = await getUserFromSessionToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      icon,
      shortDescription,
      fullDescription,
      documentation,
      baseUrl,
      allowUnauthenticated,
      authentication,
      rateLimit,
      pricing,
      webhook,
      useCases,
      openapiJson,
    } = body;

    if (!name || !category || !shortDescription || !fullDescription) {
      return NextResponse.json({ error: 'Name, category, short description, and full description are required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const existing = await prisma.api.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'An API with this name already exists' }, { status: 409 });
    }

    const api = await prisma.api.create({
      data: {
        slug,
        name,
        category: category || 'Other',
        icon: icon || '🔌',
        shortDescription,
        fullDescription,
        documentation: documentation || null,
        baseUrl: baseUrl || null,
        allowUnauthenticated: allowUnauthenticated || false,
        authentication: authentication || 'API Key',
        rateLimit: rateLimit || '100 requests/min',
        pricing: pricing || 'Free',
        webhook: webhook || false,
        useCases: useCases || [],
        openapiJson: openapiJson ? JSON.parse(openapiJson) : null,
        providerId: user.id,
      },
    });

    // If OpenAPI JSON provided, try to auto-create endpoints
    if (openapiJson) {
      try {
        const spec = JSON.parse(openapiJson);
        if (spec.paths) {
          const endpoints = [];
          for (const [path, methods] of Object.entries(spec.paths)) {
            for (const [method, details] of Object.entries(methods as Record<string, any>)) {
              endpoints.push({
                apiId: api.id,
                method: method.toUpperCase(),
                path,
                description: (details as any).summary || (details as any).description || `${method.toUpperCase()} ${path}`,
                parameters: ((details as any).parameters || []).map((p: any) => ({
                  name: p.name,
                  type: p.schema?.type || 'string',
                  required: p.required || false,
                  description: p.description || '',
                })),
                responseExample: (details as any).responses?.['200']?.content?.['application/json']?.example || {},
              });
            }
          }
          if (endpoints.length > 0) {
            await prisma.endpoint.createMany({ data: endpoints });
          }
        }
      } catch {
        // OpenAPI parsing failed, skip endpoint creation
      }
    }

    return NextResponse.json({
      success: true,
      api: { id: api.id, slug: api.slug, name: api.name },
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('API creation error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
