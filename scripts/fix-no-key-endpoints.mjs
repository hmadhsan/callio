import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CATALOG = {
  'jikan-anime': {
    path: '/anime',
    description: 'List top anime with paging',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Page number' },
      { name: 'limit', type: 'integer', required: false, description: 'Items per page (max 25)' },
    ],
    example: { data: [{ mal_id: 1, title: 'Cowboy Bebop' }] },
  },
  'open-trivia-db': {
    path: '/api.php',
    description: 'Fetch trivia questions',
    params: [
      { name: 'amount', type: 'integer', required: true, description: 'Number of questions, e.g. 5' },
      { name: 'type', type: 'string', required: false, description: 'multiple or boolean' },
    ],
    example: { response_code: 0, results: [{ question: 'Sample?' }] },
  },
  'openfda': {
    path: '/drug/label.json',
    description: 'Search drug labels and metadata',
    params: [
      { name: 'search', type: 'string', required: false, description: 'Search query, e.g. openfda.brand_name:aspirin' },
      { name: 'limit', type: 'integer', required: false, description: 'Max results' },
    ],
    example: { results: [{ id: 'abc123' }] },
  },
  'osm-nominatim': {
    path: '/search',
    description: 'Forward geocoding search',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query, e.g. Lahore' },
      { name: 'format', type: 'string', required: false, description: 'json (recommended)' },
    ],
    example: [{ lat: '31.5497', lon: '74.3436' }],
  },
  'pokeapi': {
    path: '/pokemon/{name}',
    description: 'Get Pokemon by name or id',
    params: [
      { name: 'name', type: 'string', required: true, description: 'pokemon name/id, e.g. pikachu' },
    ],
    example: { id: 25, name: 'pikachu' },
  },
  'randomuser': {
    path: '/api',
    description: 'Generate random user profiles',
    params: [
      { name: 'results', type: 'integer', required: false, description: 'Number of users to return' },
    ],
    example: { results: [{ gender: 'female' }] },
  },
  'reddit-public': {
    path: '/r/{subreddit}/hot.json',
    description: 'Get hot posts from a subreddit',
    params: [
      { name: 'subreddit', type: 'string', required: true, description: 'Subreddit name, e.g. programming' },
      { name: 'limit', type: 'integer', required: false, description: 'Max posts' },
    ],
    example: { data: { children: [{ data: { title: 'Post' } }] } },
  },
  'remoteok': {
    path: '/api',
    description: 'Fetch remote jobs feed',
    params: [],
    example: [{ id: 1, position: 'Backend Engineer' }],
  },
  'themealdb': {
    path: '/search.php',
    description: 'Search meals by name',
    params: [
      { name: 's', type: 'string', required: true, description: 'Meal name, e.g. chicken' },
    ],
    example: { meals: [{ idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole' }] },
  },
  'usgs-earthquake': {
    path: '/query',
    description: 'Query earthquake events',
    params: [
      { name: 'format', type: 'string', required: true, description: 'geojson' },
      { name: 'limit', type: 'integer', required: false, description: 'Max events' },
    ],
    example: { features: [{ id: 'us123' }] },
  },
  'wikipedia': {
    path: '/page/summary/{title}',
    description: 'Get a page summary by title',
    params: [
      { name: 'title', type: 'string', required: true, description: 'Page title, e.g. Pakistan' },
    ],
    example: { title: 'Pakistan', extract: '...' },
  },
  'worldbank': {
    path: '/country/{country}/indicator/{indicator}',
    description: 'Get indicator values by country',
    params: [
      { name: 'country', type: 'string', required: true, description: 'Country code, e.g. PK' },
      { name: 'indicator', type: 'string', required: true, description: 'Indicator code, e.g. NY.GDP.MKTP.CD' },
      { name: 'format', type: 'string', required: false, description: 'json' },
    ],
    example: [{ page: 1 }, [{ country: { id: 'PK' }, value: 300000000000 }]],
  },
  'x402search': {
    path: '/search',
    description: 'Search web results',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Query string' },
    ],
    example: { results: [{ title: 'Example' }] },
  },
};

let added = 0;
for (const [slug, def] of Object.entries(CATALOG)) {
  const api = await prisma.api.findUnique({ where: { slug }, include: { endpoints: true } });
  if (!api) continue;
  if (api.endpoints.length > 0) continue;
  await prisma.endpoint.create({
    data: {
      apiId: api.id,
      method: 'GET',
      path: def.path,
      description: def.description,
      parameters: def.params,
      responseExample: def.example,
    },
  });
  added++;
  console.log('added endpoint for', slug, '->', def.path);
}

const noKey = await prisma.api.findMany({ where: { allowUnauthenticated: true }, include: { _count: { select: { endpoints: true } } } });
const missing = noKey.filter(a => a._count.endpoints === 0).map(a => a.slug);
console.log('\nNo-key APIs missing endpoints:', missing.length);
if (missing.length) console.log(missing.join(', '));

await prisma.$disconnect();
console.log('\nAdded endpoints:', added);
