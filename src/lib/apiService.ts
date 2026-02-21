import prisma from './prisma';

export interface FeaturedApiCard {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface ApiListItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
  shortDescription: string;
  authentication: string;
  webhook: boolean;
  featured: boolean;
  pricing: string;
  allowUnauthenticated: boolean;
  endpointsCount: number;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters: Array<{ name: string; type: string; required: boolean; description: string }>;
  responseExample: unknown;
}

export interface ApiDetail {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  useCases: string[];
  endpoints: ApiEndpoint[];
  authentication: string;
  rateLimit: string;
  pricing: string;
  documentation: string | null;
  webhook: boolean;
  baseUrl: string | null;
}

export async function getFeaturedApis(): Promise<FeaturedApiCard[]> {
  const apis = await prisma.api.findMany({
    where: { featured: true },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      icon: true,
    },
    orderBy: { name: 'asc' },
  });

  return apis.map((api) => ({
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.shortDescription,
    icon: api.icon,
  }));
}

export async function getAllApis(): Promise<ApiListItem[]> {
  const apis = await prisma.api.findMany({
    include: {
      _count: { select: { endpoints: true } },
    },
    orderBy: { name: 'asc' },
  });

  return apis.map((api) => ({
    id: api.id,
    slug: api.slug,
    name: api.name,
    category: api.category,
    icon: api.icon,
    shortDescription: api.shortDescription,
    authentication: api.authentication,
    webhook: api.webhook,
    featured: api.featured,
    pricing: api.pricing,
    allowUnauthenticated: api.allowUnauthenticated,
    endpointsCount: api._count.endpoints,
  }));
}

export async function getApiBySlug(slug: string): Promise<ApiDetail | null> {
  const api = await prisma.api.findUnique({
    where: { slug },
    include: { endpoints: true },
  });

  if (!api) {
    return null;
  }

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    category: api.category,
    icon: api.icon,
    shortDescription: api.shortDescription,
    fullDescription: api.fullDescription,
    useCases: Array.isArray(api.useCases) ? (api.useCases as string[]) : [],
    endpoints: api.endpoints.map((endpoint) => ({
      method: endpoint.method,
      path: endpoint.path,
      description: endpoint.description,
      parameters: Array.isArray(endpoint.parameters)
        ? (endpoint.parameters as ApiEndpoint['parameters'])
        : typeof endpoint.parameters === 'string'
          ? JSON.parse(endpoint.parameters)
          : [],
      responseExample: endpoint.responseExample,
    })),
    authentication: api.authentication,
    rateLimit: api.rateLimit,
    pricing: api.pricing,
    documentation: api.documentation,
    webhook: api.webhook,
    baseUrl: api.baseUrl,
  };
}
