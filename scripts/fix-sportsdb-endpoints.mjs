import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function ensureSportsDbEndpoints() {
  const api = await prisma.api.findUnique({ where: { slug: 'thesportsdb' }, include: { endpoints: true } });
  if (!api) return console.log('thesportsdb not found');

  if (api.endpoints.length > 0) {
    console.log('thesportsdb already has endpoints:', api.endpoints.length);
    return;
  }

  await prisma.endpoint.createMany({
    data: [
      {
        apiId: api.id,
        method: 'GET',
        path: '/all_sports.php',
        description: 'List all available sports',
        parameters: [],
        responseExample: { sports: [{ idSport: '102', strSport: 'Soccer' }] },
      },
      {
        apiId: api.id,
        method: 'GET',
        path: '/searchteams.php',
        description: 'Search teams by name',
        parameters: [
          { name: 't', type: 'string', required: true, description: 'Team name, e.g. Arsenal' },
        ],
        responseExample: { teams: [{ idTeam: '133604', strTeam: 'Arsenal' }] },
      },
      {
        apiId: api.id,
        method: 'GET',
        path: '/eventsnext.php',
        description: 'Get next events for a team',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Team ID, e.g. 133604' },
        ],
        responseExample: { events: [{ idEvent: '12345', strEvent: 'Arsenal vs Chelsea' }] },
      },
    ],
  });

  console.log('added 3 endpoints to thesportsdb');
}

await ensureSportsDbEndpoints();

const api = await prisma.api.findUnique({ where: { slug: 'thesportsdb' }, include: { _count: { select: { endpoints: true } } } });
console.log('thesportsdb endpoints:', api?._count.endpoints ?? 0);

await prisma.$disconnect();
