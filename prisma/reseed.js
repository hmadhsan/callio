const { PrismaClient } = require('@prisma/client');
const { apis } = require('./seed-data');

const prisma = new PrismaClient();

async function main() {
  // Delete all existing APIs
  await prisma.endpoint.deleteMany({});
  await prisma.apiKey.deleteMany({});
  await prisma.apiCredential.deleteMany({});
  await prisma.api.deleteMany({});
  console.log('Deleted all existing APIs');

  // Re-seed with updated data
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
        baseUrl: api.baseUrl,
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

  console.log('Seed completed with baseUrl values!');
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
