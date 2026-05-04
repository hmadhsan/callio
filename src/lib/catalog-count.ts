import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

const countApis = unstable_cache(
  async () => prisma.api.count(),
  ['marketing-api-catalog-count'],
  { revalidate: 300 }
);

/** Live API row count for marketing copy (5-minute cache). */
export async function getCatalogApiCount(): Promise<number> {
  return countApis();
}
