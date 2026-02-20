import { notFound } from 'next/navigation';
import { getApiBySlug } from '@/lib/apiService';
import prisma from '@/lib/prisma';
import ClientDetailPage from '@/components/ClientDetailPage';

export const dynamic = 'force-dynamic';

export default async function ApiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await getApiBySlug(slug);

  if (!api) {
    notFound();
  }

  // Get extra fields from the raw DB record
  const rawApi = await prisma.api.findUnique({ where: { slug } });

  const apiInfo = {
    slug: api.slug,
    name: api.name,
    icon: api.icon,
    category: api.category,
    shortDescription: api.shortDescription,
    fullDescription: api.fullDescription,
    useCases: api.useCases,
    documentation: api.documentation || undefined,
    authentication: api.authentication,
    rateLimit: api.rateLimit,
    pricing: api.pricing,
    webhook: api.webhook,
    baseUrl: api.baseUrl || undefined,
    allowUnauthenticated: rawApi?.allowUnauthenticated || false,
    setupGuide: rawApi?.setupGuide || undefined,
    setupUrl: rawApi?.setupUrl || undefined,
  };

  const endpoints = api.endpoints.map((ep) => ({
    id: `${api.slug}-${ep.method}-${ep.path}`,
    method: ep.method,
    path: ep.path,
    description: ep.description,
    parameters: ep.parameters,
  }));

  return <ClientDetailPage api={apiInfo} endpoints={endpoints} />;
}
