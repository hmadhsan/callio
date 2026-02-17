const { PrismaClient } = require('@prisma/client');
const { apis } = require('./seed-data');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.api.count();
  if (existing > 0) {
    console.log('Seed skipped: API data already exists.');
    return;
  }

  for (const api of apis) {
    const created = await prisma.api.create({
      data: {
        slug: api.slug,
        name: api.name,
        category: api.category,
        icon: api.icon,
        featured: api.featured,
        shortDescription: api.shortDescription,
        fullDescription: api.fullDescription,
        useCases: api.useCases,
        documentation: api.documentation,
        authentication: api.authentication,
        rateLimit: api.rateLimit,
        pricing: api.pricing,
        webhook: api.webhook,
      },
    });

    if (api.endpoints && api.endpoints.length > 0) {
      await prisma.endpoint.createMany({
        data: api.endpoints.map((endpoint) => ({
          apiId: created.id,
          method: endpoint.method,
          path: endpoint.path,
          description: endpoint.description,
          parameters: endpoint.parameters,
          responseExample: endpoint.responseExample,
        })),
      });
    }
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
