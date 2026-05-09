import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const api = await prisma.api.findUnique({ where: { slug: 'jokeapi' } });
  if (!api) {
    console.log('jokeapi not found — ensure the API exists in the catalog');
    return;
  }

  const existing = await prisma.endpoint.findFirst({ where: { apiId: api.id, path: '/joke/Any' } });
  if (existing) {
    console.log('Endpoint /joke/Any already exists for jokeapi');
    return;
  }

  await prisma.endpoint.create({
    data: {
      apiId: api.id,
      method: 'GET',
      path: '/joke/Any',
      description: 'Get a random joke (use query param `type=single|twopart` to filter)',
      parameters: [
        { name: 'type', type: 'string', required: false, description: 'single or twopart' },
      ],
      responseExample: {},
    },
  });

  console.log('Created endpoint /joke/Any for jokeapi');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
