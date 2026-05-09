#!/usr/bin/env node
// Reseed the database with real, working APIs
// This replaces the demo/placeholder data with actual API integrations

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const vm = require('vm');
const prisma = new PrismaClient();
const batch1Apis = require('./new-apis-batch1').apis;
const batch2Apis = require('./new-apis-batch2').apis;
const seedDataApis = require('./seed-data').apis;
const seedDataRealApis = require('./seed-data-real').apis;
const seedDataProductionApis = require('./seed-data-production').apis;

const baseApis = [
  // ─── 1. JSONPlaceholder (Demo – actually works with no auth!) ─────
  {
    slug: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    category: 'Testing',
    icon: '🧪',
    featured: true,
    shortDescription: 'Free public REST API for testing and prototyping',
    fullDescription:
      'Perfect for testing the Callio playground without any credentials. JSONPlaceholder provides fake data that responds exactly like a real REST API — posts, comments, users, todos, and more.',
    useCases: [
      'Test the Callio playground',
      'Prototype API integrations',
      'Learn HTTP methods',
      'Demo Callio to your team',
      'CI/CD pipeline testing',
    ],
    documentation: 'https://jsonplaceholder.typicode.com/',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    authentication: 'None (Public API)',
    allowUnauthenticated: true,
    rateLimit: 'Unlimited',
    pricing: 'Free',
    webhook: false,
    setupGuide: 'No setup needed! This is a free public API. Click "Try It" and start testing right away.',
    setupUrl: null,
    endpoints: [
      {
        method: 'GET',
        path: '/posts',
        description: 'List all posts (100 items)',
        parameters: [
          { name: '_limit', type: 'number', required: false, description: 'Limit results (e.g. 5)' },
        ],
        responseExample: [{ id: 1, userId: 1, title: 'sunt aut facere repellat provident', body: 'quia et suscipit...' }],
      },
      {
        method: 'GET',
        path: '/posts/{id}',
        description: 'Get a single post by ID',
        parameters: [
          { name: 'id', type: 'number', required: true, description: 'Post ID (1-100)' },
        ],
        responseExample: { id: 1, userId: 1, title: 'sunt aut facere repellat provident', body: 'quia et suscipit...' },
      },
      {
        method: 'POST',
        path: '/posts',
        description: 'Create a new post',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'Post title' },
          { name: 'body', type: 'string', required: true, description: 'Post content' },
          { name: 'userId', type: 'number', required: true, description: 'Author user ID' },
        ],
        responseExample: { id: 101, title: 'My Post', body: 'Content', userId: 1 },
      },
      {
        method: 'GET',
        path: '/users',
        description: 'List all users',
        parameters: [],
        responseExample: [{ id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz', company: { name: 'Romaguera-Crona' } }],
      },
      {
        method: 'GET',
        path: '/comments',
        description: 'List all comments',
        parameters: [
          { name: 'postId', type: 'number', required: false, description: 'Filter by post ID' },
        ],
        responseExample: [{ postId: 1, id: 1, name: 'id labore ex et quam', email: 'Eliseo@gardner.biz', body: 'laudantium enim...' }],
      },
    ],
  },

  // ─── 2. OpenAI GPT ─────────────────────────────────────────
  {
    slug: 'openai',
    name: 'OpenAI',
    category: 'AI & Machine Learning',
    icon: '🤖',
    featured: true,
    shortDescription: 'GPT-4, DALL-E, Whisper — one key to all OpenAI models',
    fullDescription:
      'Integrate OpenAI models into your AI agents — generate text with GPT-4, create images with DALL-E, transcribe audio with Whisper, and build embeddings for semantic search.',
    useCases: [
      'Generate AI-powered text responses',
      'Create embeddings for semantic search',
      'Summarize documents and content',
      'Extract structured data from text',
      'Build conversational AI agents',
    ],
    documentation: 'https://platform.openai.com/docs/api-reference',
    baseUrl: 'https://api.openai.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: 'Varies by model (3,500 RPM for GPT-4)',
    pricing: 'Pay per token — $0.002–$0.06 per 1K tokens',
    webhook: false,
    setupGuide: `1. Go to https://platform.openai.com/api-keys\n2. Create a new API key\n3. Copy the key (starts with sk-...)\n4. Save it as your Provider Key below\n\nNote: You need credits in your OpenAI account.`,
    setupUrl: 'https://platform.openai.com/api-keys',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/chat/completions',
        description: 'Generate a chat completion (GPT-4, GPT-3.5)',
        parameters: [
          { name: 'model', type: 'string', required: true, description: 'Model ID (gpt-4, gpt-3.5-turbo)' },
          { name: 'messages', type: 'string', required: true, description: 'JSON array of messages [{role,content}]' },
          { name: 'max_tokens', type: 'number', required: false, description: 'Max tokens to generate' },
        ],
        responseExample: {
          id: 'chatcmpl-abc123',
          choices: [{ message: { role: 'assistant', content: 'Hello! How can I help?' } }],
          usage: { prompt_tokens: 10, completion_tokens: 15, total_tokens: 25 },
        },
      },
      {
        method: 'POST',
        path: '/v1/embeddings',
        description: 'Create text embeddings for semantic search',
        parameters: [
          { name: 'model', type: 'string', required: true, description: 'Model (text-embedding-ada-002)' },
          { name: 'input', type: 'string', required: true, description: 'Text to embed' },
        ],
        responseExample: {
          data: [{ embedding: [0.0023, -0.009, 0.015], index: 0 }],
          usage: { prompt_tokens: 8, total_tokens: 8 },
        },
      },
    ],
  },

  // ─── 3. Stripe Payments ─────────────────────────────────────
  {
    slug: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    icon: '💳',
    featured: true,
    shortDescription: 'Accept payments, manage subscriptions and customers',
    fullDescription:
      'Integrate Stripe payment processing into your AI agents. Accept one-time payments, manage subscription billing, handle refunds, and build complete payment workflows.',
    useCases: [
      'Process one-time payments',
      'Manage subscription billing',
      'Handle refunds and disputes',
      'Create and send invoices',
      'Multi-currency transactions',
    ],
    documentation: 'https://stripe.com/docs/api',
    baseUrl: 'https://api.stripe.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: '100 requests/second',
    pricing: '2.9% + $0.30 per transaction',
    webhook: true,
    setupGuide: `1. Go to https://dashboard.stripe.com/apikeys\n2. Copy your Secret Key (starts with sk_test_ for testing)\n3. Save it as your Provider Key below\n\nUse test mode keys (sk_test_...) for safe testing.`,
    setupUrl: 'https://dashboard.stripe.com/apikeys',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/payment_intents',
        description: 'Create a payment intent',
        parameters: [
          { name: 'amount', type: 'number', required: true, description: 'Amount in cents (1000 = $10.00)' },
          { name: 'currency', type: 'string', required: true, description: 'Currency code (usd, eur, gbp)' },
          { name: 'description', type: 'string', required: false, description: 'Payment description' },
        ],
        responseExample: { id: 'pi_1234', status: 'requires_payment_method', amount: 1000, currency: 'usd' },
      },
      {
        method: 'GET',
        path: '/v1/customers',
        description: 'List all customers',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Max results (1-100)' },
        ],
        responseExample: { object: 'list', data: [{ id: 'cus_abc', email: 'user@test.com', name: 'Test' }] },
      },
    ],
  },

  // ─── 4. GitHub ──────────────────────────────────────────────
  {
    slug: 'github',
    name: 'GitHub',
    category: 'Developer Tools',
    icon: '🐙',
    featured: true,
    shortDescription: 'Manage repos, issues, pull requests, and actions',
    fullDescription:
      'Integrate with GitHub to manage repositories, track issues, review pull requests, and trigger CI/CD workflows from your AI agents.',
    useCases: [
      'List and manage repositories',
      'Create and track issues',
      'Review pull requests',
      'Get commit and branch info',
      'Trigger GitHub Actions',
    ],
    documentation: 'https://docs.github.com/en/rest',
    baseUrl: 'https://api.github.com',
    authentication: 'Personal Access Token (Bearer)',
    allowUnauthenticated: false,
    rateLimit: '5,000 requests/hour',
    pricing: 'Free for public repos',
    webhook: true,
    setupGuide: `1. Go to https://github.com/settings/tokens\n2. Generate new token (classic)\n3. Select 'repo' scope\n4. Copy the token and save as Provider Key below`,
    setupUrl: 'https://github.com/settings/tokens',
    endpoints: [
      {
        method: 'GET',
        path: '/repos/{owner}/{repo}',
        description: 'Get repository details',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repo owner (e.g. facebook)' },
          { name: 'repo', type: 'string', required: true, description: 'Repo name (e.g. react)' },
        ],
        responseExample: { id: 10270250, name: 'react', full_name: 'facebook/react', stargazers_count: 220000, language: 'JavaScript' },
      },
      {
        method: 'GET',
        path: '/users/{username}',
        description: 'Get user profile',
        parameters: [
          { name: 'username', type: 'string', required: true, description: 'GitHub username' },
        ],
        responseExample: { login: 'octocat', id: 1, name: 'The Octocat', public_repos: 8, followers: 100 },
      },
      {
        method: 'POST',
        path: '/repos/{owner}/{repo}/issues',
        description: 'Create a new issue',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repo owner' },
          { name: 'repo', type: 'string', required: true, description: 'Repo name' },
          { name: 'title', type: 'string', required: true, description: 'Issue title' },
          { name: 'body', type: 'string', required: false, description: 'Issue body (Markdown)' },
        ],
        responseExample: { id: 1, number: 42, title: 'Bug report', state: 'open' },
      },
    ],
  },

  // ─── 5. SendGrid Email ─────────────────────────────────────
  {
    slug: 'sendgrid',
    name: 'SendGrid',
    category: 'Communications',
    icon: '📧',
    featured: true,
    shortDescription: 'Send transactional and marketing emails at scale',
    fullDescription:
      'Enable your AI agents to send emails reliably. Transactional emails, marketing campaigns, templates, delivery tracking, and engagement analytics.',
    useCases: [
      'Send verification & welcome emails',
      'Transaction notifications',
      'Marketing campaign delivery',
      'Email template management',
      'Delivery and open tracking',
    ],
    documentation: 'https://docs.sendgrid.com/api-reference/',
    baseUrl: 'https://api.sendgrid.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: '10,000 emails/day',
    pricing: 'Free: 100 emails/day · Pro: from $14.95/mo',
    webhook: true,
    setupGuide: `1. Go to https://app.sendgrid.com/settings/api_keys\n2. Create an API key with Mail Send permission\n3. Copy the key and save as Provider Key below`,
    setupUrl: 'https://app.sendgrid.com/settings/api_keys',
    endpoints: [
      {
        method: 'POST',
        path: '/v3/mail/send',
        description: 'Send an email',
        parameters: [
          { name: 'to', type: 'string', required: true, description: 'Recipient email' },
          { name: 'subject', type: 'string', required: true, description: 'Email subject' },
          { name: 'html', type: 'string', required: true, description: 'HTML email body' },
        ],
        responseExample: { status: 202, message: 'Email accepted for delivery' },
      },
    ],
  },

  // ─── 6. Slack ───────────────────────────────────────────────
  {
    slug: 'slack',
    name: 'Slack',
    category: 'Communications',
    icon: '💬',
    featured: false,
    shortDescription: 'Send messages, manage channels, and automate workflows',
    fullDescription:
      'Integrate with Slack to send messages, manage channels, upload files, and build automated notification workflows for your team.',
    useCases: [
      'Send notifications to channels',
      'Create automated alerts',
      'Post formatted messages',
      'Manage channel membership',
      'Build Slack bots',
    ],
    documentation: 'https://api.slack.com/docs',
    baseUrl: 'https://slack.com/api',
    authentication: 'Bot OAuth Token (xoxb-...)',
    allowUnauthenticated: false,
    rateLimit: '1 request/second per method',
    pricing: 'Free (limited) · Pro: $8.75/user/mo',
    webhook: true,
    setupGuide: `1. Go to https://api.slack.com/apps\n2. Create or select your app\n3. Install to workspace → copy Bot Token (xoxb-...)\n4. Save as Provider Key below`,
    setupUrl: 'https://api.slack.com/apps',
    endpoints: [
      {
        method: 'POST',
        path: '/chat.postMessage',
        description: 'Send a message to a channel',
        parameters: [
          { name: 'channel', type: 'string', required: true, description: 'Channel ID or #name' },
          { name: 'text', type: 'string', required: true, description: 'Message text' },
        ],
        responseExample: { ok: true, channel: 'C024BE91L', ts: '1503435956.000247' },
      },
      {
        method: 'GET',
        path: '/users.list',
        description: 'List workspace members',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Max results' },
        ],
        responseExample: { ok: true, members: [{ id: 'U123', name: 'john', real_name: 'John Doe' }] },
      },
    ],
  },

  // ─── 7. Airtable ────────────────────────────────────────────
  {
    slug: 'airtable',
    name: 'Airtable',
    category: 'Data & Storage',
    icon: '📋',
    featured: false,
    shortDescription: 'Store, query, and manage structured data in bases',
    fullDescription:
      'Use Airtable as a backend database for your AI agents. Create records, query data, update fields, and build data pipelines with a spreadsheet-like interface.',
    useCases: [
      'Store and retrieve records',
      'Collect form submissions',
      'Build data pipelines',
      'Sync data between services',
      'Generate reports from data',
    ],
    documentation: 'https://airtable.com/developers/web/api',
    baseUrl: 'https://api.airtable.com',
    authentication: 'Personal Access Token (Bearer)',
    allowUnauthenticated: false,
    rateLimit: '5 requests/second',
    pricing: 'Free (1,200 records) · Team: $20/seat/mo',
    webhook: true,
    setupGuide: `1. Go to https://airtable.com/create/tokens\n2. Create a token with read/write scopes\n3. Copy the token and save as Provider Key below\n4. Use your Base ID from the base URL`,
    setupUrl: 'https://airtable.com/create/tokens',
    endpoints: [
      {
        method: 'GET',
        path: '/v0/{baseId}/{tableId}',
        description: 'List records in a table',
        parameters: [
          { name: 'baseId', type: 'string', required: true, description: 'Airtable Base ID (appXXX)' },
          { name: 'tableId', type: 'string', required: true, description: 'Table name or ID' },
          { name: 'maxRecords', type: 'number', required: false, description: 'Max records to return' },
        ],
        responseExample: { records: [{ id: 'rec123', fields: { Name: 'Alice', Email: 'alice@test.com' } }] },
      },
    ],
  },

  // ─── 8. REST Countries (Free, no auth) ─────────────────────
  {
    slug: 'restcountries',
    name: 'REST Countries',
    category: 'Data & Reference',
    icon: '🌍',
    featured: false,
    shortDescription: 'Country data — population, currencies, languages & more',
    fullDescription:
      'Get detailed information about every country — population, area, currencies, languages, timezones, borders, and flags. Completely free, no API key needed.',
    useCases: [
      'Look up country details',
      'Get currency and language info',
      'Build location-aware features',
      'Validate country codes',
      'Display country flags',
    ],
    documentation: 'https://restcountries.com/',
    baseUrl: 'https://restcountries.com',
    authentication: 'None (Public API)',
    allowUnauthenticated: true,
    rateLimit: 'Unlimited',
    pricing: 'Free',
    webhook: false,
    setupGuide: 'No setup needed! This is a free public API.',
    setupUrl: null,
    endpoints: [
      {
        method: 'GET',
        path: '/v3.1/name/{name}',
        description: 'Search countries by name',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Country name (e.g. germany)' },
        ],
        responseExample: [{ name: { common: 'Germany', official: 'Federal Republic of Germany' }, population: 83240525, capital: ['Berlin'], currencies: { EUR: { name: 'Euro' } } }],
      },
      {
        method: 'GET',
        path: '/v3.1/all',
        description: 'Get all countries',
        parameters: [],
        responseExample: [{ name: { common: 'Germany' }, population: 83240525 }],
      },
    ],
  },

  // ─── 9. Cat Facts (Free, no auth) ──────────────────────────
  {
    slug: 'catfacts',
    name: 'Cat Facts',
    category: 'Fun & Testing',
    icon: '🐱',
    featured: false,
    shortDescription: 'Random cat facts — great for testing webhooks and agents',
    fullDescription:
      'A simple, fun API that returns random cat facts. Perfect for testing your Callio integration, webhooks, and agent workflows without needing any API key.',
    useCases: [
      'Test Callio integration',
      'Verify webhook delivery',
      'Demo agent workflows',
      'Fun Slack bot messages',
      'API response testing',
    ],
    documentation: 'https://catfact.ninja/',
    baseUrl: 'https://catfact.ninja',
    authentication: 'None (Public API)',
    allowUnauthenticated: true,
    rateLimit: 'Unlimited',
    pricing: 'Free',
    webhook: false,
    setupGuide: 'No setup needed! Click "Try It" to get a random cat fact.',
    setupUrl: null,
    endpoints: [
      {
        method: 'GET',
        path: '/fact',
        description: 'Get a random cat fact',
        parameters: [],
        responseExample: { fact: 'Cats sleep 70% of their lives.', length: 33 },
      },
      {
        method: 'GET',
        path: '/facts',
        description: 'Get a list of cat facts',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of facts (default 10)' },
        ],
        responseExample: { data: [{ fact: 'A cat can jump up to six times its length.', length: 43 }], total: 332 },
      },
    ],
  },

  // ─── 10. Open Meteo Weather (Free, no auth) ────────────────
  {
    slug: 'weather',
    name: 'Open-Meteo Weather',
    category: 'Data & Reference',
    icon: '🌤️',
    featured: false,
    shortDescription: 'Global weather forecasts and historical data — free, no key',
    fullDescription:
      'Get real-time weather forecasts, historical weather data, and climate information for any location worldwide. Completely free and open, no API key required.',
    useCases: [
      'Get current weather conditions',
      'Multi-day weather forecasts',
      'Historical weather data',
      'Location-based features',
      'Climate analysis',
    ],
    documentation: 'https://open-meteo.com/en/docs',
    baseUrl: 'https://api.open-meteo.com',
    authentication: 'None (Public API)',
    allowUnauthenticated: true,
    rateLimit: '10,000 requests/day',
    pricing: 'Free for non-commercial use',
    webhook: false,
    setupGuide: 'No setup needed! Just provide latitude and longitude coordinates.',
    setupUrl: null,
    endpoints: [
      {
        method: 'GET',
        path: '/v1/forecast',
        description: 'Get weather forecast for a location',
        parameters: [
          { name: 'latitude', type: 'number', required: true, description: 'Latitude (e.g. 52.52 for Berlin)' },
          { name: 'longitude', type: 'number', required: true, description: 'Longitude (e.g. 13.41 for Berlin)' },
          { name: 'current_weather', type: 'string', required: false, description: 'Set to "true" for current conditions' },
        ],
        responseExample: { 
          current_weather: { temperature: 15.3, windspeed: 12.5, weathercode: 3 },
          latitude: 52.52, longitude: 13.41
        },
      },
    ],
  },
];

const additionalApis = [...batch1Apis, ...batch2Apis];
const discoverSource = fs.readFileSync(require.resolve('./seed-discover'), 'utf8');
const discoverMatch = discoverSource.match(/const newApis = \[(.|\r|\n)*?^\];/m);
const discoverApis = discoverMatch
  ? vm.runInNewContext(discoverMatch[0].replace(/^const newApis = /, '').replace(/;$/, ''))
  : [];

const apis = [
  ...baseApis,
  ...additionalApis,
  ...seedDataApis,
  ...seedDataRealApis,
  ...seedDataProductionApis,
  ...discoverApis,
].filter((api, index, arr) => {
  return arr.findIndex((candidate) => candidate.slug === api.slug) === index;
});

async function main() {
  console.log('🔄 Reseeding database with real APIs...\n');

  // Clear old data
  console.log('Clearing existing data...');
  await prisma.apiCredential.deleteMany({});
  await prisma.apiKey.deleteMany({});
  await prisma.endpoint.deleteMany({});
  await prisma.api.deleteMany({});
  console.log('✓ Cleared\n');

  // Seed new APIs
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
        allowUnauthenticated: api.allowUnauthenticated || false,
        rateLimit: api.rateLimit,
        pricing: api.pricing,
        webhook: api.webhook,
        setupGuide: api.setupGuide || null,
        setupUrl: api.setupUrl || null,
      },
    });

    for (const ep of api.endpoints) {
      await prisma.endpoint.create({
        data: {
          apiId: created.id,
          method: ep.method,
          path: ep.path,
          description: ep.description,
          parameters: ep.parameters,
          responseExample: ep.responseExample,
        },
      });
    }

    const authBadge = api.allowUnauthenticated ? '🟢 Public' : '🔑 Requires key';
    console.log(`  ✓ ${api.name} (${api.slug}) — ${api.endpoints.length} endpoints — ${authBadge}`);
  }

  console.log(`\n✅ Seeded ${apis.length} APIs!`);
  console.log(`   ${apis.filter(a => a.allowUnauthenticated).length} public (work immediately)`);
  console.log(`   ${apis.filter(a => !a.allowUnauthenticated).length} require provider key (BYOK)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
