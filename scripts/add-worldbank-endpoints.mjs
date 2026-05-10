import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const api = await prisma.api.findUnique({ where: { slug: 'worldbank' } });
  if (!api) {
    console.log('worldbank not found — ensure the API exists in the catalog');
    return;
  }

  const endpoints = [
    {
      method: 'GET',
      path: '/country/all',
      description: 'Get all countries and metadata',
      parameters: [
        { name: 'format', type: 'string', required: false, description: 'json or xml' },
      ],
      responseExample: [],
    },
    {
      method: 'GET',
      path: '/country/:code',
      description: 'Get country information by ISO code',
      parameters: [
        { name: 'code', type: 'string', required: true, description: 'ISO country code' },
        { name: 'format', type: 'string', required: false, description: 'json or xml' },
      ],
      responseExample: [],
    },
    {
      method: 'GET',
      path: '/indicator/:indicator',
      description: 'List indicator data by country and year',
      parameters: [
        { name: 'indicator', type: 'string', required: true, description: 'World Bank indicator code' },
        { name: 'format', type: 'string', required: false, description: 'json or xml' },
        { name: 'per_page', type: 'integer', required: false, description: 'Page size' },
      ],
      responseExample: [],
    },
  ];

  let created = 0;
  for (const endpoint of endpoints) {
    const existing = await prisma.endpoint.findFirst({
      where: {
        apiId: api.id,
        method: endpoint.method,
        path: endpoint.path,
      },
    });

    if (existing) {
      console.log(`skip ${endpoint.method} ${endpoint.path}`);
      continue;
    }

    await prisma.endpoint.create({
      data: {
        apiId: api.id,
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description,
        parameters: endpoint.parameters,
        responseExample: endpoint.responseExample,
      },
    });

    console.log(`add ${endpoint.method} ${endpoint.path}`);
    created++;
  }

  console.log(`Created ${created} worldbank endpoints`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
