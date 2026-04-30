/**
 * Drop duplicate API stubs that pre-date the consolidation.
 * For every pair the short slug is the rich record (multiple endpoints,
 * baseUrl set) and the long slug is a 1-endpoint stub — verified via
 * scripts/inspect-dupes.mjs.
 *
 * Cascades: Endpoint, FavoriteApi, ApiKey, ApiCredential all have
 * onDelete: Cascade on apiId, so a single delete is safe.
 *
 * Idempotent. Safe to re-run.
 *
 * Usage:
 *   node --env-file=.env.local scripts/dedupe-apis.mjs --dry-run
 *   node --env-file=.env.local scripts/dedupe-apis.mjs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry-run');

// [keeperSlug, loserSlug]
const PAIRS = [
  ['anthropic',  'anthropic-claude'],
  ['cohere',     'cohere-ai'],
  ['groq',       'groq-llm'],
  ['notion',     'notion-api'],
  ['resend',     'resend-email'],
  ['stability',  'stability-ai'],
  ['linear',     'linear-issues'],
  ['twilio',     'twilio-sms'],
  ['perplexity', 'perplexity-ai'],
];

async function main() {
  console.log(DRY ? '🟡 DRY RUN — no DB writes' : '🟢 Deleting duplicates…');
  console.log('');

  let deleted = 0; let missing = 0;
  for (const [keeper, loser] of PAIRS) {
    const keep = await prisma.api.findUnique({ where: { slug: keeper } });
    const drop = await prisma.api.findUnique({
      where: { slug: loser },
      include: { _count: { select: { endpoints: true, apiKeys: true, credentials: true, favoritedBy: true } } },
    });

    if (!keep) {
      console.log(`  ⚠️  keeper '${keeper}' missing — skipping pair`);
      continue;
    }
    if (!drop) {
      console.log(`  [✓] ${loser.padEnd(22)} already gone`);
      missing++;
      continue;
    }

    const c = drop._count;
    const refs = c.endpoints + c.apiKeys + c.credentials + c.favoritedBy;
    console.log(`  [-] ${loser.padEnd(22)} → cascading ${refs} refs (ep=${c.endpoints} keys=${c.apiKeys} creds=${c.credentials} favs=${c.favoritedBy})`);

    if (!DRY) {
      await prisma.api.delete({ where: { id: drop.id } });
    }
    deleted++;
  }

  console.log(`\n  Deleted ${deleted} dupes, ${missing} already gone`);

  // Final state
  const total = await prisma.api.count();
  const cats = await prisma.api.groupBy({ by: ['category'], _count: { _all: true } });
  console.log(`\n  Final: ${total} APIs across ${cats.length} categories`);
  for (const row of cats.sort((a, b) => b._count._all - a._count._all)) {
    console.log(`    ${String(row._count._all).padStart(3)}  ${row.category}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
