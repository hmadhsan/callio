import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, ExternalLink, Code2, Zap, Lock, Globe } from 'lucide-react';
import { getApiBySlug, getAllApis } from '@/lib/apiService';
import AddToAgentButton from '@/components/AddToAgentButton';
import ProviderKeyForm from '@/components/ProviderKeyForm';
import CodeExamples from '@/components/CodeExamples';
import ClientDetailPage from '@/components/ClientDetailPage';

export async function generateStaticParams() {
  try {
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const apis = await getAllApis();
    return apis.map((api) => ({
      provider: 'callio',
      slug: api.slug,
    }));
  } catch {
    return [];
  }
}

type SkillParams = { provider: string; slug: string };

export default async function SkillDetailPage({ params }: { params: SkillParams | Promise<SkillParams> }) {
  const resolvedParams = await Promise.resolve(params);

  if (resolvedParams.provider !== 'callio') {
    notFound();
  }

  const api = await getApiBySlug(resolvedParams.slug);

  if (!api) {
    notFound();
  }

  // Transform endpoints for the client component
  const endpoints = (api.endpoints || []).map((ep: any) => ({
    id: ep.id,
    method: ep.method,
    path: ep.path,
    description: ep.description,
    parameters: ep.parameters || [],
  }));

  return (
    <ClientDetailPage 
      api={api}
      endpoints={endpoints}
    />
  );
}

