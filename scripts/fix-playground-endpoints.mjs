import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function replaceWeatherEndpoints() {
  const api = await prisma.api.findUnique({ where: { slug: 'weather' } });
  if (!api) return;

  await prisma.endpoint.deleteMany({ where: { apiId: api.id } });

  await prisma.endpoint.createMany({
    data: [
      {
        apiId: api.id,
        method: 'GET',
        path: '/v1/forecast',
        description: 'Get current weather for coordinates',
        parameters: [
          { name: 'latitude', type: 'number', required: true, description: 'Latitude (e.g. 31.5204)' },
          { name: 'longitude', type: 'number', required: true, description: 'Longitude (e.g. 74.3587)' },
          { name: 'current', type: 'string', required: false, description: 'Comma-separated current vars, e.g. temperature_2m,wind_speed_10m' },
          { name: 'timezone', type: 'string', required: false, description: 'Timezone, e.g. auto or Europe/Berlin' },
        ],
        responseExample: { current: { time: '2026-04-30T12:00', temperature_2m: 24.1, wind_speed_10m: 8.2 } },
      },
      {
        apiId: api.id,
        method: 'GET',
        path: '/v1/forecast',
        description: 'Get hourly forecast for coordinates',
        parameters: [
          { name: 'latitude', type: 'number', required: true, description: 'Latitude (e.g. 31.5204)' },
          { name: 'longitude', type: 'number', required: true, description: 'Longitude (e.g. 74.3587)' },
          { name: 'hourly', type: 'string', required: true, description: 'Comma-separated hourly vars, e.g. temperature_2m,precipitation' },
          { name: 'forecast_days', type: 'integer', required: false, description: 'Forecast horizon in days (1-16)' },
          { name: 'timezone', type: 'string', required: false, description: 'Timezone, e.g. auto' },
        ],
        responseExample: { hourly: { time: ['2026-04-30T13:00'], temperature_2m: [25.0], precipitation: [0.0] } },
      },
    ],
  });
}

async function ensureOpenLibraryEndpoints() {
  const api = await prisma.api.findUnique({ where: { slug: 'openlibrary' }, include: { endpoints: true } });
  if (!api) return;
  if (api.endpoints.length > 0) return;

  await prisma.endpoint.createMany({
    data: [
      {
        apiId: api.id,
        method: 'GET',
        path: '/search.json',
        description: 'Search books by title, author, or keyword',
        parameters: [
          { name: 'q', type: 'string', required: true, description: 'Search query, e.g. harry potter' },
          { name: 'limit', type: 'integer', required: false, description: 'Max results to return' },
          { name: 'page', type: 'integer', required: false, description: 'Result page number' },
        ],
        responseExample: { numFound: 1, docs: [{ title: 'Harry Potter and the Philosopher\'s Stone', key: '/works/OL82563W' }] },
      },
      {
        apiId: api.id,
        method: 'GET',
        path: '/works/{workId}.json',
        description: 'Get a work by ID',
        parameters: [
          { name: 'workId', type: 'string', required: true, description: 'Open Library work ID, e.g. OL82563W' },
        ],
        responseExample: { title: 'Harry Potter and the Philosopher\'s Stone', description: '...' },
      },
    ],
  });
}

await replaceWeatherEndpoints();
await ensureOpenLibraryEndpoints();

const rows = await prisma.api.findMany({
  where: { slug: { in: ['weather', 'openlibrary', 'restcountries'] } },
  include: { _count: { select: { endpoints: true } } },
});
for (const r of rows) {
  console.log(`${r.slug}: ${r._count.endpoints} endpoints`);
}

await prisma.$disconnect();
