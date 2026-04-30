/**
 * Normalize Callio catalog: collapse 47 categories -> 17 canonical buckets,
 * then add popular missing APIs (News, Sports, Travel, Entertainment,
 * Health, Jobs, eCommerce, Music, Public Data, etc.).
 *
 * Idempotent. Safe to re-run.
 *
 * Usage:
 *   node --env-file=.env.local scripts/normalize-and-seed.mjs
 *   node --env-file=.env.local scripts/normalize-and-seed.mjs --dry-run
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry-run');

// ──────────────────────────────────────────────────────────────────────
// Canonical category buckets (17). Keep the names short and scannable.
// ──────────────────────────────────────────────────────────────────────
const CAT = {
  AI:           'AI & LLMs',
  SEARCH:       'Search',
  COMMS:        'Communications',
  DATA:         'Data & Scraping',
  DEV:          'Developer Tools',
  PROD:         'Productivity',
  CRM:          'Sales & CRM',
  FINANCE:      'Finance & Payments',
  MAPS:         'Maps & Weather',
  STORAGE:      'Storage & Media',
  IDENTITY:     'Identity & Auth',
  DB:           'Database',
  NEWS:         'News & Media',
  TRAVEL:       'Travel & Lifestyle',
  ECOMMERCE:    'eCommerce',
  PUBLIC:       'Public Data',
  FUN:          'Fun & Games',
};

// Map every old category value to a canonical bucket.
// Anything not listed stays as-is.
const CATEGORY_MAP = {
  'AI':                     CAT.AI,
  'AI & Machine Learning':  CAT.AI,
  'LLM':                    CAT.AI,
  'Image':                  CAT.AI,
  'Translation':            CAT.AI,

  'AI Search':              CAT.SEARCH,
  'Web Search':             CAT.SEARCH,
  'Search':                 CAT.SEARCH,

  'Communications':         CAT.COMMS,
  'Email':                  CAT.COMMS,
  'Messaging':              CAT.COMMS,

  'Brand Data':             CAT.DATA,
  'Browser Automation':     CAT.DATA,
  'Company Search':         CAT.DATA,
  'Data Collection':        CAT.DATA,
  'Dataset':                CAT.DATA,
  'Email Finder':           CAT.DATA,
  'People Search':          CAT.DATA,
  'Scrape':                 CAT.DATA,

  'Coding':                 CAT.DEV,
  'Developer Tools':        CAT.DEV,
  'Development':            CAT.DEV,

  'CRM':                    CAT.CRM,
  'Sales':                  CAT.CRM,

  'Cloud Storage':          CAT.STORAGE,
  'Storage':                CAT.STORAGE,
  'Media':                  CAT.STORAGE,
  'Video':                  CAT.STORAGE,

  'Identity Verification':  CAT.IDENTITY,

  'Maps':                   CAT.MAPS,
  'Maps & Location':        CAT.MAPS,
  'Weather':                CAT.MAPS,

  'Finance':                CAT.FINANCE,
  'Prediction Markets':     CAT.FINANCE,

  'Productivity':           CAT.PROD,
  'Data & Storage':         CAT.PROD, // Airtable lives here
  'Analytics':              CAT.PROD, // Plausible

  'Database':               CAT.DB,

  'Data & Reference':       CAT.PUBLIC,

  'Fun & Testing':          CAT.FUN,
  'Testing':                CAT.FUN,
};

// ──────────────────────────────────────────────────────────────────────
// New APIs to add. Idempotent upsert by slug. Prefer free / no-key APIs
// where possible so they actually work end-to-end out of the box.
// ──────────────────────────────────────────────────────────────────────
const NEW_APIS = [
  // ── News & Media ────────────────────────────────────────────────
  {
    slug: 'newsapi',
    name: 'NewsAPI',
    category: CAT.NEWS,
    icon: '📰',
    shortDescription: 'Live and historical news headlines from 80,000+ sources worldwide.',
    fullDescription: 'NewsAPI provides JSON access to news articles and live headlines from major outlets. Search by keyword, source, language, country, or date.',
    useCases: ['News dashboards', 'Sentiment analysis', 'Topic monitoring', 'Trend research'],
    documentation: 'https://newsapi.org/docs',
    baseUrl: 'https://newsapi.org/v2',
    providerAuthHeader: 'X-Api-Key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (X-Api-Key header)',
    rateLimit: '100/day on free tier',
    pricing: 'Free + paid tiers',
  },
  {
    slug: 'nyt-articles',
    name: 'New York Times',
    category: CAT.NEWS,
    icon: '🗞️',
    shortDescription: 'Search NYT articles, top stories, and book reviews going back to 1851.',
    fullDescription: 'The New York Times API gives access to articles, top stories, books, movie reviews, and archived content via REST.',
    useCases: ['News search', 'Bibliography', 'Editorial archives'],
    documentation: 'https://developer.nytimes.com/apis',
    baseUrl: 'https://api.nytimes.com/svc',
    providerAuthHeader: 'api-key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (api-key query/header)',
    rateLimit: '500/day, 5/minute',
    pricing: 'Free with key',
  },
  {
    slug: 'reddit-public',
    name: 'Reddit',
    category: CAT.NEWS,
    icon: '🤖',
    shortDescription: 'Public Reddit JSON for subreddit posts, comments, and search.',
    fullDescription: 'Reddit exposes public listings as JSON without authentication. Useful for community sentiment, trending posts, and topic discovery.',
    useCases: ['Trend tracking', 'Community sentiment', 'Content discovery'],
    documentation: 'https://www.reddit.com/dev/api/',
    baseUrl: 'https://www.reddit.com',
    allowUnauthenticated: true,
    authentication: 'None for public listings',
    rateLimit: '60/minute (unauth)',
    pricing: 'Free',
  },
  {
    slug: 'tmdb',
    name: 'TMDB',
    category: CAT.NEWS,
    icon: '🎬',
    shortDescription: 'Movies, TV shows, cast, and ratings from The Movie Database.',
    fullDescription: 'TMDB is a community-built movies and TV database with full metadata, posters, cast, and recommendations.',
    useCases: ['Movie apps', 'Recommendation engines', 'Watchlists', 'Trivia bots'],
    documentation: 'https://developer.themoviedb.org/docs',
    baseUrl: 'https://api.themoviedb.org/3',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer token (v4 read access token)',
    rateLimit: 'No hard limit',
    pricing: 'Free',
  },

  // ── Music ──────────────────────────────────────────────────────
  {
    slug: 'spotify',
    name: 'Spotify',
    category: CAT.NEWS,
    icon: '🎧',
    shortDescription: 'Tracks, artists, albums, playlists, and audio features from Spotify.',
    fullDescription: 'Spotify Web API exposes catalog, search, audio analysis, and user library data. Most read endpoints work with a client-credentials token.',
    useCases: ['Music apps', 'Playlist generators', 'Audio feature analysis'],
    documentation: 'https://developer.spotify.com/documentation/web-api',
    baseUrl: 'https://api.spotify.com/v1',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer (OAuth client credentials)',
    rateLimit: 'Per-app rolling window',
    pricing: 'Free',
  },
  {
    slug: 'lastfm',
    name: 'Last.fm',
    category: CAT.NEWS,
    icon: '📻',
    shortDescription: 'Music metadata, tags, similar artists, and scrobble history.',
    fullDescription: 'Last.fm offers music discovery data: artist info, top tracks, similar artists, and tags. Read endpoints take an API key as query param.',
    useCases: ['Music discovery', 'Recommendation seeds', 'Genre tagging'],
    documentation: 'https://www.last.fm/api',
    baseUrl: 'https://ws.audioscrobbler.com/2.0',
    providerAuthHeader: 'api_key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (api_key query param)',
    rateLimit: '5/second',
    pricing: 'Free',
  },

  // ── Sports ─────────────────────────────────────────────────────
  {
    slug: 'thesportsdb',
    name: 'TheSportsDB',
    category: CAT.NEWS,
    icon: '⚽',
    shortDescription: 'Free database of teams, players, leagues, fixtures, and live scores.',
    fullDescription: 'TheSportsDB is a community sports database with REST endpoints for football, NBA, NFL, MLB, and more. Most lookups work without a key.',
    useCases: ['Score widgets', 'Team pages', 'Fantasy apps'],
    documentation: 'https://www.thesportsdb.com/api.php',
    baseUrl: 'https://www.thesportsdb.com/api/v1/json/3',
    allowUnauthenticated: true,
    authentication: 'None for free key (3)',
    rateLimit: '1/second on free key',
    pricing: 'Free',
  },

  // ── Travel & Lifestyle ─────────────────────────────────────────
  {
    slug: 'amadeus-travel',
    name: 'Amadeus',
    category: CAT.TRAVEL,
    icon: '✈️',
    shortDescription: 'Flight offers, hotel search, airport info, and travel inspiration.',
    fullDescription: 'Amadeus for Developers offers flight, hotel, and airport APIs used by major travel apps. Self-service tier is free.',
    useCases: ['Travel search', 'Itinerary builders', 'Price tracking'],
    documentation: 'https://developers.amadeus.com',
    baseUrl: 'https://test.api.amadeus.com',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer token (OAuth)',
    rateLimit: 'Per-tier',
    pricing: 'Free self-service tier',
  },
  {
    slug: 'themealdb',
    name: 'TheMealDB',
    category: CAT.TRAVEL,
    icon: '🍳',
    shortDescription: 'Free recipes, ingredients, and meal data with photos and instructions.',
    fullDescription: 'TheMealDB is an open recipe database. Search by name, ingredient, category, or area. No key required for the v1 free key.',
    useCases: ['Recipe apps', 'Meal planners', 'Cooking bots'],
    documentation: 'https://www.themealdb.com/api.php',
    baseUrl: 'https://www.themealdb.com/api/json/v1/1',
    allowUnauthenticated: true,
    authentication: 'None on free key',
    rateLimit: 'Polite use',
    pricing: 'Free',
  },
  {
    slug: 'spoonacular',
    name: 'Spoonacular',
    category: CAT.TRAVEL,
    icon: '🥗',
    shortDescription: 'Recipes, ingredients, nutrition, and meal planning.',
    fullDescription: 'Spoonacular is a food and nutrition API with recipe search, meal plans, ingredient analysis, and pricing data.',
    useCases: ['Diet apps', 'Meal planners', 'Grocery tools'],
    documentation: 'https://spoonacular.com/food-api',
    baseUrl: 'https://api.spoonacular.com',
    providerAuthHeader: 'x-api-key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (x-api-key)',
    rateLimit: '150/day free',
    pricing: 'Free + paid',
  },

  // ── Health ─────────────────────────────────────────────────────
  {
    slug: 'openfda',
    name: 'OpenFDA',
    category: CAT.PUBLIC,
    icon: '💊',
    shortDescription: 'FDA-released data on drugs, devices, recalls, and adverse events.',
    fullDescription: 'OpenFDA gives free access to FDA datasets: drug labels, recalls, adverse events, food enforcement, and medical device records.',
    useCases: ['Healthcare apps', 'Drug lookups', 'Compliance research'],
    documentation: 'https://open.fda.gov/apis/',
    baseUrl: 'https://api.fda.gov',
    allowUnauthenticated: true,
    authentication: 'Optional API key for higher limits',
    rateLimit: '40/min unauth',
    pricing: 'Free',
  },
  {
    slug: 'usda-fooddata',
    name: 'USDA FoodData Central',
    category: CAT.PUBLIC,
    icon: '🥦',
    shortDescription: 'Nutrient data for thousands of foods from the USDA.',
    fullDescription: 'USDA FoodData Central provides standard reference nutrient data for foods, useful for diet, fitness, and health apps.',
    useCases: ['Nutrition trackers', 'Diet apps', 'Health research'],
    documentation: 'https://fdc.nal.usda.gov/api-guide.html',
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    providerAuthHeader: 'api_key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (api_key query)',
    rateLimit: '1,000/hour',
    pricing: 'Free',
  },

  // ── Jobs ───────────────────────────────────────────────────────
  {
    slug: 'remoteok',
    name: 'RemoteOK',
    category: CAT.NEWS,
    icon: '🧑‍💻',
    shortDescription: 'Public feed of remote tech jobs from RemoteOK.',
    fullDescription: 'RemoteOK exposes a public JSON feed of remote job postings, no auth required. Great for job boards and aggregators.',
    useCases: ['Job boards', 'Aggregators', 'Hiring dashboards'],
    documentation: 'https://remoteok.com/api',
    baseUrl: 'https://remoteok.com',
    allowUnauthenticated: true,
    authentication: 'None',
    rateLimit: 'Polite use',
    pricing: 'Free',
  },
  {
    slug: 'jooble',
    name: 'Jooble',
    category: CAT.NEWS,
    icon: '💼',
    shortDescription: 'Jobs aggregator across 70+ countries via a single API.',
    fullDescription: 'Jooble is a jobs aggregator with a JSON API to search global postings by keyword, location, salary, and more.',
    useCases: ['Job boards', 'Niche search', 'HR tools'],
    documentation: 'https://jooble.org/api/about',
    baseUrl: 'https://jooble.org/api',
    allowUnauthenticated: false,
    authentication: 'API Key (path segment)',
    rateLimit: 'Per-account',
    pricing: 'Free with key',
  },

  // ── eCommerce / Payments ───────────────────────────────────────
  {
    slug: 'stripe',
    name: 'Stripe',
    category: CAT.ECOMMERCE,
    icon: '💳',
    shortDescription: 'Payments, subscriptions, invoices, and connected accounts.',
    fullDescription: 'Stripe is the standard payments API for online businesses: charges, customers, subscriptions, invoices, payouts, and connect.',
    useCases: ['Checkout', 'Subscriptions', 'Marketplaces', 'Invoicing'],
    documentation: 'https://stripe.com/docs/api',
    baseUrl: 'https://api.stripe.com/v1',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer (sk_live_ / sk_test_ secret key)',
    rateLimit: '100/sec live, 25/sec test',
    pricing: 'Per-transaction',
    webhook: true,
  },
  {
    slug: 'paypal',
    name: 'PayPal',
    category: CAT.ECOMMERCE,
    icon: '🅿️',
    shortDescription: 'Payments, payouts, orders, and subscriptions on PayPal.',
    fullDescription: 'PayPal REST APIs cover orders, payments, payouts, billing plans, and subscriptions for global commerce.',
    useCases: ['Checkout', 'Payouts', 'Recurring billing'],
    documentation: 'https://developer.paypal.com/api/rest/',
    baseUrl: 'https://api-m.paypal.com',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer (OAuth2)',
    rateLimit: 'Per-app',
    pricing: 'Per-transaction',
  },
  {
    slug: 'shopify-admin',
    name: 'Shopify',
    category: CAT.ECOMMERCE,
    icon: '🛍️',
    shortDescription: 'Read and write Shopify products, orders, inventory, and customers.',
    fullDescription: 'Shopify Admin REST API for products, orders, customers, fulfillment, and discounts on a connected store.',
    useCases: ['eCommerce sync', 'Order automation', 'Inventory tools'],
    documentation: 'https://shopify.dev/docs/api/admin-rest',
    baseUrl: 'https://your-store.myshopify.com/admin/api/2024-10',
    providerAuthHeader: 'X-Shopify-Access-Token',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'X-Shopify-Access-Token header (per-shop)',
    rateLimit: 'Leaky bucket per store',
    pricing: 'Free with Shopify plan',
  },

  // ── Stock photos ───────────────────────────────────────────────
  {
    slug: 'unsplash',
    name: 'Unsplash',
    category: CAT.STORAGE,
    icon: '📷',
    shortDescription: 'Free high-quality photos and search with Unsplash.',
    fullDescription: 'Unsplash API serves free, high-resolution photos with rich search and collection endpoints.',
    useCases: ['Stock imagery', 'Hero images', 'Image search'],
    documentation: 'https://unsplash.com/documentation',
    baseUrl: 'https://api.unsplash.com',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Client-ID',
    allowUnauthenticated: false,
    authentication: 'Client-ID header',
    rateLimit: '50/hour demo',
    pricing: 'Free',
  },
  {
    slug: 'pexels',
    name: 'Pexels',
    category: CAT.STORAGE,
    icon: '🖼️',
    shortDescription: 'Free stock photos and videos from Pexels with simple search.',
    fullDescription: 'Pexels API offers free curated photos and videos with search, popular, and curated endpoints.',
    useCases: ['Stock media', 'Video B-roll', 'Visual content'],
    documentation: 'https://www.pexels.com/api/documentation/',
    baseUrl: 'https://api.pexels.com',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key in Authorization header',
    rateLimit: '200/hour, 20k/month',
    pricing: 'Free',
  },
  {
    slug: 'pixabay',
    name: 'Pixabay',
    category: CAT.STORAGE,
    icon: '🌅',
    shortDescription: 'Free images, illustrations, vectors, and videos.',
    fullDescription: 'Pixabay serves free media (images, illustrations, vectors, videos) with a single search endpoint.',
    useCases: ['Stock imagery', 'Vector assets', 'Illustration search'],
    documentation: 'https://pixabay.com/api/docs/',
    baseUrl: 'https://pixabay.com/api',
    providerAuthHeader: 'key',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (key query param)',
    rateLimit: '100/min',
    pricing: 'Free',
  },

  // ── Public Data & Reference ────────────────────────────────────
  {
    slug: 'wikipedia',
    name: 'Wikipedia',
    category: CAT.PUBLIC,
    icon: '📚',
    shortDescription: 'Free MediaWiki API for Wikipedia summaries, search, and content.',
    fullDescription: 'Wikipedia exposes a public REST API for page summaries, search, and full content. No key needed.',
    useCases: ['Encyclopedic lookups', 'Reference', 'Trivia'],
    documentation: 'https://en.wikipedia.org/api/rest_v1/',
    baseUrl: 'https://en.wikipedia.org/api/rest_v1',
    allowUnauthenticated: true,
    authentication: 'None',
    rateLimit: '200/sec',
    pricing: 'Free',
  },
  {
    slug: 'openlibrary',
    name: 'Open Library',
    category: CAT.PUBLIC,
    icon: '📖',
    shortDescription: 'Books, authors, and editions from the Internet Archive.',
    fullDescription: 'Open Library is a free books database with search, work, edition, and author endpoints.',
    useCases: ['Book apps', 'Reading lists', 'Bibliographies'],
    documentation: 'https://openlibrary.org/developers/api',
    baseUrl: 'https://openlibrary.org',
    allowUnauthenticated: true,
    authentication: 'None',
    rateLimit: 'Polite use',
    pricing: 'Free',
  },
  {
    slug: 'osm-nominatim',
    name: 'OpenStreetMap (Nominatim)',
    category: CAT.MAPS,
    icon: '🧭',
    shortDescription: 'Free geocoding and reverse geocoding from OpenStreetMap.',
    fullDescription: 'Nominatim provides forward and reverse geocoding using OpenStreetMap data. Free, requires a User-Agent.',
    useCases: ['Geocoding', 'Address lookups', 'Location-aware apps'],
    documentation: 'https://nominatim.org/release-docs/latest/api/Overview/',
    baseUrl: 'https://nominatim.openstreetmap.org',
    allowUnauthenticated: true,
    authentication: 'None (User-Agent required)',
    rateLimit: '1/sec',
    pricing: 'Free',
  },

  // ── Gaming ─────────────────────────────────────────────────────
  {
    slug: 'twitch',
    name: 'Twitch',
    category: CAT.NEWS,
    icon: '🎮',
    shortDescription: 'Streams, channels, games, and live data on Twitch.',
    fullDescription: 'Twitch Helix API for live streams, channels, search, games, and clips. OAuth required for most calls.',
    useCases: ['Streamer tools', 'Live status', 'Discovery'],
    documentation: 'https://dev.twitch.tv/docs/api',
    baseUrl: 'https://api.twitch.tv/helix',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer + Client-Id header (OAuth)',
    rateLimit: '800/min per app',
    pricing: 'Free',
  },
  {
    slug: 'igdb',
    name: 'IGDB',
    category: CAT.NEWS,
    icon: '🕹️',
    shortDescription: 'Video game database: titles, platforms, genres, and ratings.',
    fullDescription: 'IGDB (by Twitch) is a comprehensive video games database with search, lookup, and rich metadata.',
    useCases: ['Gaming apps', 'Reviews', 'Discovery'],
    documentation: 'https://api-docs.igdb.com/',
    baseUrl: 'https://api.igdb.com/v4',
    providerAuthHeader: 'Authorization',
    providerAuthScheme: 'Bearer',
    allowUnauthenticated: false,
    authentication: 'Bearer + Client-ID (Twitch OAuth)',
    rateLimit: '4/sec',
    pricing: 'Free',
  },

  // ── Finance extras ─────────────────────────────────────────────
  {
    slug: 'coinmarketcap',
    name: 'CoinMarketCap',
    category: CAT.FINANCE,
    icon: '🪙',
    shortDescription: 'Crypto prices, market caps, exchange data, and metadata.',
    fullDescription: 'CoinMarketCap API provides real-time and historical cryptocurrency data, market metrics, and exchange listings.',
    useCases: ['Crypto trackers', 'Portfolio apps', 'Market dashboards'],
    documentation: 'https://coinmarketcap.com/api/documentation/v1/',
    baseUrl: 'https://pro-api.coinmarketcap.com',
    providerAuthHeader: 'X-CMC_PRO_API_KEY',
    providerAuthScheme: '',
    allowUnauthenticated: false,
    authentication: 'API Key (X-CMC_PRO_API_KEY)',
    rateLimit: '10k/month free',
    pricing: 'Free + paid',
  },
];

// ──────────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY ? '🟡 DRY RUN — no DB writes' : '🟢 Applying changes…');
  console.log('');

  // Step 1: Normalize existing categories
  const apis = await prisma.api.findMany({ select: { id: true, slug: true, category: true } });
  let normalized = 0;
  for (const a of apis) {
    const target = CATEGORY_MAP[a.category];
    if (target && target !== a.category) {
      console.log(`  [norm] ${a.slug.padEnd(28)} ${a.category}  →  ${target}`);
      if (!DRY) {
        await prisma.api.update({ where: { id: a.id }, data: { category: target } });
      }
      normalized++;
    }
  }
  console.log(`\n  Normalized ${normalized} APIs`);

  // Step 2: Upsert new APIs
  console.log('\n  Adding missing APIs…');
  let added = 0; let skipped = 0;
  for (const api of NEW_APIS) {
    const existing = await prisma.api.findUnique({ where: { slug: api.slug } });
    if (existing) {
      console.log(`  [skip] ${api.slug.padEnd(28)} already exists`);
      skipped++;
      continue;
    }
    console.log(`  [+]    ${api.slug.padEnd(28)} ${api.name}  (${api.category})`);
    if (!DRY) {
      await prisma.api.create({
        data: {
          slug: api.slug,
          name: api.name,
          category: api.category,
          icon: api.icon,
          shortDescription: api.shortDescription,
          fullDescription: api.fullDescription,
          useCases: api.useCases,
          documentation: api.documentation || null,
          baseUrl: api.baseUrl || null,
          providerAuthHeader: api.providerAuthHeader || null,
          providerAuthScheme: api.providerAuthScheme || null,
          allowUnauthenticated: !!api.allowUnauthenticated,
          authentication: api.authentication,
          rateLimit: api.rateLimit,
          pricing: api.pricing,
          webhook: !!api.webhook,
        },
      });
    }
    added++;
  }
  console.log(`\n  Added ${added} APIs, skipped ${skipped} already-present`);

  // Step 3: Print resulting category breakdown
  const after = await prisma.api.findMany({ select: { category: true } });
  const counts = {};
  for (const r of after) counts[r.category] = (counts[r.category] || 0) + 1;
  console.log('\n  Final category breakdown:');
  for (const [cat, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(3)}  ${cat}`);
  }
  console.log(`\n  Total: ${after.length} APIs across ${Object.keys(counts).length} categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
