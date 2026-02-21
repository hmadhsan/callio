const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Real endpoints based on actual API documentation
const ENDPOINTS = {
  // ── OpenAI ──
  openai: [
    { method: 'POST', path: '/v1/chat/completions', description: 'Create a chat completion with GPT models', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'Model ID (gpt-4, gpt-3.5-turbo, etc.)'},{name:'messages',type:'array',required:true,description:'Array of message objects with role and content'},{name:'temperature',type:'number',required:false,description:'Sampling temperature 0-2'},{name:'max_tokens',type:'integer',required:false,description:'Max tokens to generate'},{name:'stream',type:'boolean',required:false,description:'Stream partial responses'}]) },
    { method: 'POST', path: '/v1/completions', description: 'Create a text completion (legacy)', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'prompt',type:'string',required:true},{name:'max_tokens',type:'integer',required:false},{name:'temperature',type:'number',required:false}]) },
    { method: 'POST', path: '/v1/embeddings', description: 'Create text embeddings for semantic search', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'text-embedding-ada-002 or text-embedding-3-small'},{name:'input',type:'string',required:true,description:'Text to embed'}]) },
    { method: 'POST', path: '/v1/images/generations', description: 'Generate images with DALL-E', parameters: JSON.stringify([{name:'model',type:'string',required:false,description:'dall-e-2 or dall-e-3'},{name:'prompt',type:'string',required:true},{name:'n',type:'integer',required:false,description:'Number of images 1-10'},{name:'size',type:'string',required:false,description:'256x256, 512x512, or 1024x1024'}]) },
    { method: 'POST', path: '/v1/images/edits', description: 'Edit an image given a prompt', parameters: JSON.stringify([{name:'image',type:'file',required:true},{name:'prompt',type:'string',required:true},{name:'mask',type:'file',required:false},{name:'n',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/audio/transcriptions', description: 'Transcribe audio to text with Whisper', parameters: JSON.stringify([{name:'file',type:'file',required:true,description:'Audio file (mp3, wav, etc.)'},{name:'model',type:'string',required:true,description:'whisper-1'},{name:'language',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/audio/translations', description: 'Translate audio to English text', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'model',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/audio/speech', description: 'Generate speech from text (TTS)', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'tts-1 or tts-1-hd'},{name:'input',type:'string',required:true},{name:'voice',type:'string',required:true,description:'alloy, echo, fable, onyx, nova, shimmer'}]) },
    { method: 'POST', path: '/v1/moderations', description: 'Check if content violates usage policies', parameters: JSON.stringify([{name:'input',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/models', description: 'List all available models', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v1/models/:model', description: 'Retrieve details about a specific model', parameters: JSON.stringify([{name:'model',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/fine_tuning/jobs', description: 'Create a fine-tuning job', parameters: JSON.stringify([{name:'training_file',type:'string',required:true},{name:'model',type:'string',required:true},{name:'hyperparameters',type:'object',required:false}]) },
    { method: 'GET', path: '/v1/fine_tuning/jobs', description: 'List fine-tuning jobs', parameters: JSON.stringify([{name:'limit',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/files', description: 'Upload a file for fine-tuning or assistants', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'purpose',type:'string',required:true,description:'fine-tune, assistants, etc.'}]) },
    { method: 'GET', path: '/v1/files', description: 'List uploaded files', parameters: JSON.stringify([]) },
  ],

  // ── Stripe ──
  stripe: [
    { method: 'POST', path: '/v1/charges', description: 'Create a new charge', parameters: JSON.stringify([{name:'amount',type:'integer',required:true,description:'Amount in cents'},{name:'currency',type:'string',required:true},{name:'source',type:'string',required:false},{name:'customer',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/charges', description: 'List all charges', parameters: JSON.stringify([{name:'limit',type:'integer',required:false},{name:'customer',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/charges/:id', description: 'Retrieve a charge by ID', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/customers', description: 'Create a new customer', parameters: JSON.stringify([{name:'email',type:'string',required:false},{name:'name',type:'string',required:false},{name:'payment_method',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/customers', description: 'List all customers', parameters: JSON.stringify([{name:'limit',type:'integer',required:false},{name:'email',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/customers/:id', description: 'Retrieve a customer', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/customers/:id', description: 'Update a customer', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'email',type:'string',required:false},{name:'name',type:'string',required:false}]) },
    { method: 'DELETE', path: '/v1/customers/:id', description: 'Delete a customer', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/payment_intents', description: 'Create a payment intent', parameters: JSON.stringify([{name:'amount',type:'integer',required:true},{name:'currency',type:'string',required:true},{name:'payment_method_types',type:'array',required:false}]) },
    { method: 'GET', path: '/v1/payment_intents/:id', description: 'Retrieve a payment intent', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/payment_intents/:id/confirm', description: 'Confirm a payment intent', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'payment_method',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/subscriptions', description: 'Create a subscription', parameters: JSON.stringify([{name:'customer',type:'string',required:true},{name:'items',type:'array',required:true,description:'Array of {price: price_id}'}]) },
    { method: 'GET', path: '/v1/subscriptions', description: 'List subscriptions', parameters: JSON.stringify([{name:'customer',type:'string',required:false},{name:'status',type:'string',required:false}]) },
    { method: 'DELETE', path: '/v1/subscriptions/:id', description: 'Cancel a subscription', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/invoices', description: 'Create an invoice', parameters: JSON.stringify([{name:'customer',type:'string',required:true},{name:'auto_advance',type:'boolean',required:false}]) },
    { method: 'GET', path: '/v1/invoices', description: 'List invoices', parameters: JSON.stringify([{name:'customer',type:'string',required:false},{name:'limit',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/refunds', description: 'Create a refund', parameters: JSON.stringify([{name:'charge',type:'string',required:false},{name:'payment_intent',type:'string',required:false},{name:'amount',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/products', description: 'Create a product', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'description',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/prices', description: 'Create a price', parameters: JSON.stringify([{name:'unit_amount',type:'integer',required:true},{name:'currency',type:'string',required:true},{name:'product',type:'string',required:true},{name:'recurring',type:'object',required:false}]) },
    { method: 'GET', path: '/v1/balance', description: 'Retrieve current account balance', parameters: JSON.stringify([]) },
  ],

  // ── GitHub ──
  github: [
    { method: 'GET', path: '/user', description: 'Get the authenticated user', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/users/:username', description: 'Get a user by username', parameters: JSON.stringify([{name:'username',type:'string',required:true}]) },
    { method: 'GET', path: '/user/repos', description: 'List repositories for authenticated user', parameters: JSON.stringify([{name:'sort',type:'string',required:false,description:'created, updated, pushed, full_name'},{name:'per_page',type:'integer',required:false}]) },
    { method: 'GET', path: '/repos/:owner/:repo', description: 'Get a repository', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true}]) },
    { method: 'POST', path: '/user/repos', description: 'Create a repository', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'description',type:'string',required:false},{name:'private',type:'boolean',required:false}]) },
    { method: 'GET', path: '/repos/:owner/:repo/issues', description: 'List repository issues', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'state',type:'string',required:false,description:'open, closed, all'},{name:'labels',type:'string',required:false}]) },
    { method: 'POST', path: '/repos/:owner/:repo/issues', description: 'Create an issue', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'title',type:'string',required:true},{name:'body',type:'string',required:false}]) },
    { method: 'GET', path: '/repos/:owner/:repo/pulls', description: 'List pull requests', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'state',type:'string',required:false}]) },
    { method: 'POST', path: '/repos/:owner/:repo/pulls', description: 'Create a pull request', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'title',type:'string',required:true},{name:'head',type:'string',required:true},{name:'base',type:'string',required:true}]) },
    { method: 'GET', path: '/repos/:owner/:repo/commits', description: 'List commits', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'sha',type:'string',required:false}]) },
    { method: 'GET', path: '/repos/:owner/:repo/contents/:path', description: 'Get file or directory contents', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true},{name:'path',type:'string',required:true}]) },
    { method: 'GET', path: '/repos/:owner/:repo/branches', description: 'List branches', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true}]) },
    { method: 'GET', path: '/repos/:owner/:repo/releases', description: 'List releases', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true}]) },
    { method: 'GET', path: '/search/repositories', description: 'Search repositories', parameters: JSON.stringify([{name:'q',type:'string',required:true,description:'Search query'},{name:'sort',type:'string',required:false},{name:'per_page',type:'integer',required:false}]) },
    { method: 'GET', path: '/repos/:owner/:repo/actions/runs', description: 'List workflow runs', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'repo',type:'string',required:true}]) },
  ],

  // ── SendGrid ──
  sendgrid: [
    { method: 'POST', path: '/v3/mail/send', description: 'Send an email', parameters: JSON.stringify([{name:'personalizations',type:'array',required:true,description:'Array of recipient objects'},{name:'from',type:'object',required:true,description:'{email, name}'},{name:'subject',type:'string',required:true},{name:'content',type:'array',required:true}]) },
    { method: 'GET', path: '/v3/templates', description: 'List email templates', parameters: JSON.stringify([{name:'generations',type:'string',required:false,description:'legacy or dynamic'}]) },
    { method: 'POST', path: '/v3/templates', description: 'Create an email template', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'generation',type:'string',required:true}]) },
    { method: 'GET', path: '/v3/stats', description: 'Get global email stats', parameters: JSON.stringify([{name:'start_date',type:'string',required:true},{name:'end_date',type:'string',required:false}]) },
    { method: 'GET', path: '/v3/suppression/bounces', description: 'List bounced emails', parameters: JSON.stringify([{name:'start_time',type:'integer',required:false},{name:'end_time',type:'integer',required:false}]) },
    { method: 'GET', path: '/v3/suppression/unsubscribes', description: 'List global unsubscribes', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v3/contactdb/recipients', description: 'Add contacts to marketing list', parameters: JSON.stringify([{name:'contacts',type:'array',required:true}]) },
    { method: 'GET', path: '/v3/contactdb/lists', description: 'List all contact lists', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v3/mail/batch', description: 'Send batch emails', parameters: JSON.stringify([{name:'messages',type:'array',required:true}]) },
    { method: 'GET', path: '/v3/messages', description: 'Search recent email activity', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'limit',type:'integer',required:false}]) },
  ],

  // ── Slack ──
  slack: [
    { method: 'POST', path: '/chat.postMessage', description: 'Send a message to a channel', parameters: JSON.stringify([{name:'channel',type:'string',required:true},{name:'text',type:'string',required:true},{name:'blocks',type:'array',required:false}]) },
    { method: 'POST', path: '/chat.update', description: 'Update an existing message', parameters: JSON.stringify([{name:'channel',type:'string',required:true},{name:'ts',type:'string',required:true},{name:'text',type:'string',required:true}]) },
    { method: 'POST', path: '/chat.delete', description: 'Delete a message', parameters: JSON.stringify([{name:'channel',type:'string',required:true},{name:'ts',type:'string',required:true}]) },
    { method: 'GET', path: '/conversations.list', description: 'List all channels', parameters: JSON.stringify([{name:'types',type:'string',required:false,description:'public_channel, private_channel'},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/conversations.history', description: 'Get message history for a channel', parameters: JSON.stringify([{name:'channel',type:'string',required:true},{name:'limit',type:'integer',required:false},{name:'oldest',type:'string',required:false}]) },
    { method: 'GET', path: '/conversations.info', description: 'Get info about a channel', parameters: JSON.stringify([{name:'channel',type:'string',required:true}]) },
    { method: 'POST', path: '/conversations.create', description: 'Create a new channel', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'is_private',type:'boolean',required:false}]) },
    { method: 'GET', path: '/users.list', description: 'List all workspace users', parameters: JSON.stringify([{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/users.info', description: 'Get info about a user', parameters: JSON.stringify([{name:'user',type:'string',required:true}]) },
    { method: 'POST', path: '/files.upload', description: 'Upload a file', parameters: JSON.stringify([{name:'channels',type:'string',required:false},{name:'content',type:'string',required:false},{name:'filename',type:'string',required:false}]) },
    { method: 'POST', path: '/reactions.add', description: 'Add a reaction to a message', parameters: JSON.stringify([{name:'channel',type:'string',required:true},{name:'name',type:'string',required:true,description:'Emoji name'},{name:'timestamp',type:'string',required:true}]) },
    { method: 'GET', path: '/search.messages', description: 'Search messages in workspace', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'sort',type:'string',required:false}]) },
  ],

  // ── Airtable ──
  airtable: [
    { method: 'GET', path: '/v0/:baseId/:tableIdOrName', description: 'List records in a table', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'maxRecords',type:'integer',required:false},{name:'view',type:'string',required:false},{name:'filterByFormula',type:'string',required:false}]) },
    { method: 'GET', path: '/v0/:baseId/:tableIdOrName/:recordId', description: 'Retrieve a specific record', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'recordId',type:'string',required:true}]) },
    { method: 'POST', path: '/v0/:baseId/:tableIdOrName', description: 'Create records', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'records',type:'array',required:true,description:'Array of {fields: {...}}'}]) },
    { method: 'PATCH', path: '/v0/:baseId/:tableIdOrName', description: 'Update records (partial update)', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'records',type:'array',required:true}]) },
    { method: 'PUT', path: '/v0/:baseId/:tableIdOrName', description: 'Replace records (full update)', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'records',type:'array',required:true}]) },
    { method: 'DELETE', path: '/v0/:baseId/:tableIdOrName', description: 'Delete records', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'tableIdOrName',type:'string',required:true},{name:'records',type:'array',required:true,description:'Array of record IDs'}]) },
    { method: 'GET', path: '/v0/meta/bases', description: 'List all bases', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v0/meta/bases/:baseId/tables', description: 'List tables in a base', parameters: JSON.stringify([{name:'baseId',type:'string',required:true}]) },
    { method: 'POST', path: '/v0/meta/bases/:baseId/tables', description: 'Create a table', parameters: JSON.stringify([{name:'baseId',type:'string',required:true},{name:'name',type:'string',required:true},{name:'fields',type:'array',required:true}]) },
    { method: 'POST', path: '/v0/meta/bases', description: 'Create a new base', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'workspaceId',type:'string',required:true},{name:'tables',type:'array',required:true}]) },
  ],

  // ── REST Countries ──
  restcountries: [
    { method: 'GET', path: '/v3.1/all', description: 'Get all countries', parameters: JSON.stringify([{name:'fields',type:'string',required:false,description:'Comma-separated fields'}]) },
    { method: 'GET', path: '/v3.1/name/:name', description: 'Search countries by name', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'fullText',type:'boolean',required:false}]) },
    { method: 'GET', path: '/v3.1/alpha/:code', description: 'Get country by code (ISO 3166)', parameters: JSON.stringify([{name:'code',type:'string',required:true}]) },
    { method: 'GET', path: '/v3.1/currency/:currency', description: 'Get countries by currency', parameters: JSON.stringify([{name:'currency',type:'string',required:true}]) },
    { method: 'GET', path: '/v3.1/lang/:language', description: 'Get countries by language', parameters: JSON.stringify([{name:'language',type:'string',required:true}]) },
    { method: 'GET', path: '/v3.1/capital/:capital', description: 'Get countries by capital city', parameters: JSON.stringify([{name:'capital',type:'string',required:true}]) },
    { method: 'GET', path: '/v3.1/region/:region', description: 'Get countries by region', parameters: JSON.stringify([{name:'region',type:'string',required:true,description:'Africa, Americas, Asia, Europe, Oceania'}]) },
    { method: 'GET', path: '/v3.1/subregion/:subregion', description: 'Get countries by subregion', parameters: JSON.stringify([{name:'subregion',type:'string',required:true}]) },
  ],

  // ── Cat Facts ──
  catfacts: [
    { method: 'GET', path: '/fact', description: 'Get a random cat fact', parameters: JSON.stringify([{name:'max_length',type:'integer',required:false}]) },
    { method: 'GET', path: '/facts', description: 'Get multiple random cat facts', parameters: JSON.stringify([{name:'max_length',type:'integer',required:false},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/breeds', description: 'List cat breeds', parameters: JSON.stringify([{name:'limit',type:'integer',required:false}]) },
  ],

  // ── Weather API ──
  weather: [
    { method: 'GET', path: '/v1/current.json', description: 'Get current weather', parameters: JSON.stringify([{name:'q',type:'string',required:true,description:'City name, ZIP, or lat,lon'},{name:'aqi',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/forecast.json', description: 'Get weather forecast', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'days',type:'integer',required:false,description:'1-10'},{name:'hour',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/search.json', description: 'Search locations', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/history.json', description: 'Get historical weather', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'dt',type:'string',required:true,description:'Date in yyyy-MM-dd format'}]) },
    { method: 'GET', path: '/v1/astronomy.json', description: 'Get astronomy data (sunrise, sunset)', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'dt',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/timezone.json', description: 'Get timezone info for a location', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/alerts.json', description: 'Get weather alerts for a location', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
  ],

  // ── Browserbase ──
  browserbase: [
    { method: 'POST', path: '/v1/sessions', description: 'Create a new browser session', parameters: JSON.stringify([{name:'projectId',type:'string',required:true},{name:'browserSettings',type:'object',required:false}]) },
    { method: 'GET', path: '/v1/sessions', description: 'List all sessions', parameters: JSON.stringify([{name:'status',type:'string',required:false}]) },
    { method: 'GET', path: '/v1/sessions/:id', description: 'Get session details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/sessions/:id/navigate', description: 'Navigate to a URL', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'url',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/sessions/:id/screenshot', description: 'Take a screenshot', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'fullPage',type:'boolean',required:false}]) },
    { method: 'DELETE', path: '/v1/sessions/:id', description: 'Close a session', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/sessions/:id/downloads', description: 'List session downloads', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/sessions/:id/recording', description: 'Get session recording', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
  ],

  // ── Firecrawl ──
  firecrawl: [
    { method: 'POST', path: '/v1/scrape', description: 'Scrape a single URL', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'formats',type:'array',required:false,description:'markdown, html, rawHtml, links'},{name:'onlyMainContent',type:'boolean',required:false}]) },
    { method: 'POST', path: '/v1/crawl', description: 'Crawl a website', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'limit',type:'integer',required:false},{name:'maxDepth',type:'integer',required:false},{name:'includePaths',type:'array',required:false}]) },
    { method: 'GET', path: '/v1/crawl/:id', description: 'Get crawl job status', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/map', description: 'Map all URLs of a website', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'search',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/extract', description: 'Extract structured data from a page', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'schema',type:'object',required:true,description:'JSON schema for extraction'}]) },
    { method: 'DELETE', path: '/v1/crawl/:id', description: 'Cancel a crawl job', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/batch/scrape', description: 'Scrape multiple URLs', parameters: JSON.stringify([{name:'urls',type:'array',required:true},{name:'formats',type:'array',required:false}]) },
  ],

  // ── Proxycurl ──
  proxycurl: [
    { method: 'GET', path: '/api/v2/linkedin', description: 'Get LinkedIn profile data', parameters: JSON.stringify([{name:'url',type:'string',required:true,description:'LinkedIn profile URL'},{name:'skills',type:'string',required:false},{name:'use_cache',type:'string',required:false}]) },
    { method: 'GET', path: '/api/v2/linkedin/company', description: 'Get LinkedIn company data', parameters: JSON.stringify([{name:'url',type:'string',required:true,description:'LinkedIn company URL'}]) },
    { method: 'GET', path: '/api/v2/linkedin/company/employees', description: 'Get company employees', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'role_search',type:'string',required:false},{name:'page_size',type:'integer',required:false}]) },
    { method: 'GET', path: '/api/v2/linkedin/company/job', description: 'Get company job listings', parameters: JSON.stringify([{name:'url',type:'string',required:true}]) },
    { method: 'GET', path: '/api/contact-api/personal-email', description: 'Find personal email', parameters: JSON.stringify([{name:'linkedin_profile_url',type:'string',required:true}]) },
    { method: 'GET', path: '/api/linkedin/profile/resolve', description: 'Resolve profile from name', parameters: JSON.stringify([{name:'first_name',type:'string',required:true},{name:'last_name',type:'string',required:true},{name:'company_domain',type:'string',required:false}]) },
    { method: 'POST', path: '/api/search/person', description: 'Search for people', parameters: JSON.stringify([{name:'country',type:'string',required:true},{name:'current_company_name',type:'string',required:false},{name:'current_role_title',type:'string',required:false}]) },
    { method: 'GET', path: '/api/v2/linkedin/company/resolve', description: 'Resolve company from domain', parameters: JSON.stringify([{name:'company_domain',type:'string',required:true}]) },
  ],

  // ── People Data Labs ──
  peopledatalabs: [
    { method: 'GET', path: '/v5/person/enrich', description: 'Enrich a person profile', parameters: JSON.stringify([{name:'email',type:'string',required:false},{name:'phone',type:'string',required:false},{name:'name',type:'string',required:false},{name:'company',type:'string',required:false},{name:'min_likelihood',type:'integer',required:false}]) },
    { method: 'GET', path: '/v5/company/enrich', description: 'Enrich a company profile', parameters: JSON.stringify([{name:'name',type:'string',required:false},{name:'website',type:'string',required:false},{name:'ticker',type:'string',required:false}]) },
    { method: 'POST', path: '/v5/person/search', description: 'Search for people (SQL or Elasticsearch)', parameters: JSON.stringify([{name:'sql',type:'string',required:false},{name:'query',type:'object',required:false},{name:'size',type:'integer',required:false}]) },
    { method: 'POST', path: '/v5/company/search', description: 'Search for companies', parameters: JSON.stringify([{name:'sql',type:'string',required:false},{name:'query',type:'object',required:false},{name:'size',type:'integer',required:false}]) },
    { method: 'POST', path: '/v5/person/identify', description: 'Identify a person from partial data', parameters: JSON.stringify([{name:'email',type:'string',required:false},{name:'company',type:'string',required:false},{name:'name',type:'string',required:false}]) },
    { method: 'POST', path: '/v5/person/bulk', description: 'Bulk enrich people', parameters: JSON.stringify([{name:'requests',type:'array',required:true}]) },
    { method: 'GET', path: '/v5/autocomplete', description: 'Autocomplete for fields', parameters: JSON.stringify([{name:'field',type:'string',required:true,description:'company, school, title, etc.'},{name:'text',type:'string',required:true}]) },
    { method: 'GET', path: '/v5/person/retrieve/:id', description: 'Retrieve person by PDL ID', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
  ],

  // ── Clearbit ──
  clearbit: [
    { method: 'GET', path: '/v2/people/find', description: 'Find a person by email', parameters: JSON.stringify([{name:'email',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/companies/find', description: 'Find a company by domain', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/people/:id/flag', description: 'Flag an incorrect person record', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/combined/find', description: 'Combined person + company lookup', parameters: JSON.stringify([{name:'email',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/domains/find', description: 'Find domain from company name', parameters: JSON.stringify([{name:'name',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/people/search', description: 'Search for people', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'page',type:'integer',required:false}]) },
    { method: 'GET', path: '/v2/companies/find', description: 'Reveal company from IP address', parameters: JSON.stringify([{name:'ip',type:'string',required:true}]) },
    { method: 'GET', path: '/logo/:domain', description: 'Get company logo', parameters: JSON.stringify([{name:'domain',type:'string',required:true},{name:'size',type:'integer',required:false}]) },
  ],

  // ── Crunchbase ──
  crunchbase: [
    { method: 'GET', path: '/api/v4/entities/organizations/:id', description: 'Get organization details', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'field_ids',type:'string',required:false}]) },
    { method: 'GET', path: '/api/v4/entities/people/:id', description: 'Get person details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/api/v4/searches/organizations', description: 'Search organizations', parameters: JSON.stringify([{name:'field_ids',type:'array',required:true},{name:'query',type:'array',required:false},{name:'limit',type:'integer',required:false}]) },
    { method: 'POST', path: '/api/v4/searches/people', description: 'Search people', parameters: JSON.stringify([{name:'field_ids',type:'array',required:true},{name:'query',type:'array',required:false}]) },
    { method: 'POST', path: '/api/v4/searches/funding_rounds', description: 'Search funding rounds', parameters: JSON.stringify([{name:'field_ids',type:'array',required:true},{name:'query',type:'array',required:false}]) },
    { method: 'GET', path: '/api/v4/autocompletes', description: 'Autocomplete entities', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'collection_ids',type:'string',required:false}]) },
    { method: 'POST', path: '/api/v4/searches/acquisitions', description: 'Search acquisitions', parameters: JSON.stringify([{name:'field_ids',type:'array',required:true},{name:'query',type:'array',required:false}]) },
  ],

  // ── Hunter.io ──
  hunter: [
    { method: 'GET', path: '/v2/domain-search', description: 'Find emails from a domain', parameters: JSON.stringify([{name:'domain',type:'string',required:true},{name:'limit',type:'integer',required:false},{name:'type',type:'string',required:false,description:'personal or generic'}]) },
    { method: 'GET', path: '/v2/email-finder', description: 'Find email of a specific person', parameters: JSON.stringify([{name:'domain',type:'string',required:true},{name:'first_name',type:'string',required:true},{name:'last_name',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/email-verifier', description: 'Verify an email address', parameters: JSON.stringify([{name:'email',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/email-count', description: 'Get email count for a domain', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/account', description: 'Get account information', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v2/leads', description: 'Create a lead', parameters: JSON.stringify([{name:'email',type:'string',required:true},{name:'first_name',type:'string',required:false},{name:'last_name',type:'string',required:false},{name:'company',type:'string',required:false}]) },
    { method: 'GET', path: '/v2/leads', description: 'List leads', parameters: JSON.stringify([{name:'limit',type:'integer',required:false},{name:'offset',type:'integer',required:false}]) },
    { method: 'GET', path: '/v2/leads_lists', description: 'List lead lists', parameters: JSON.stringify([]) },
  ],

  // ── Snov.io ──
  snov: [
    { method: 'POST', path: '/v1/get-domain-emails-with-info', description: 'Find emails by domain', parameters: JSON.stringify([{name:'domain',type:'string',required:true},{name:'type',type:'string',required:false,description:'all, personal, generic'},{name:'limit',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/get-emails-from-names', description: 'Find email by name and domain', parameters: JSON.stringify([{name:'firstName',type:'string',required:true},{name:'lastName',type:'string',required:true},{name:'domain',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/get-emails-verification', description: 'Verify an email address', parameters: JSON.stringify([{name:'emails',type:'array',required:true}]) },
    { method: 'POST', path: '/v1/add-emails-to-send-list', description: 'Add emails to a drip campaign', parameters: JSON.stringify([{name:'listId',type:'integer',required:true},{name:'emails',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/get-user-lists', description: 'Get all prospect lists', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v1/get-prospect-by-email', description: 'Get prospect by email', parameters: JSON.stringify([{name:'email',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/get-profile-by-email', description: 'Get social profile by email', parameters: JSON.stringify([{name:'email',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/get-balance', description: 'Get account credit balance', parameters: JSON.stringify([]) },
  ],

  // ── Perplexity ──
  perplexity: [
    { method: 'POST', path: '/chat/completions', description: 'Create a chat completion with web search', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'sonar-small-chat, sonar-medium-chat, sonar-small-online, sonar-medium-online'},{name:'messages',type:'array',required:true},{name:'temperature',type:'number',required:false},{name:'max_tokens',type:'integer',required:false},{name:'search_recency_filter',type:'string',required:false,description:'month, week, day, hour'}]) },
    { method: 'GET', path: '/models', description: 'List available models', parameters: JSON.stringify([]) },
  ],

  // ── Tavily ──
  tavily: [
    { method: 'POST', path: '/search', description: 'AI-powered web search', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'search_depth',type:'string',required:false,description:'basic or advanced'},{name:'max_results',type:'integer',required:false},{name:'include_domains',type:'array',required:false},{name:'exclude_domains',type:'array',required:false}]) },
    { method: 'POST', path: '/extract', description: 'Extract content from URLs', parameters: JSON.stringify([{name:'urls',type:'array',required:true}]) },
    { method: 'POST', path: '/search/context', description: 'Get search context for RAG', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'search_depth',type:'string',required:false},{name:'max_tokens',type:'integer',required:false}]) },
    { method: 'POST', path: '/search/qna', description: 'Get direct answer to a question', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'search_depth',type:'string',required:false}]) },
  ],

  // ── Exa ──
  exa: [
    { method: 'POST', path: '/search', description: 'Semantic search the web', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'numResults',type:'integer',required:false},{name:'includeDomains',type:'array',required:false},{name:'startPublishedDate',type:'string',required:false}]) },
    { method: 'POST', path: '/findSimilar', description: 'Find pages similar to a URL', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'numResults',type:'integer',required:false}]) },
    { method: 'POST', path: '/contents', description: 'Get page contents by IDs', parameters: JSON.stringify([{name:'ids',type:'array',required:true},{name:'text',type:'boolean',required:false},{name:'highlights',type:'boolean',required:false}]) },
    { method: 'POST', path: '/search/auto', description: 'Auto-detect best search mode', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'numResults',type:'integer',required:false}]) },
    { method: 'POST', path: '/answer', description: 'Get an AI-generated answer with citations', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'text',type:'boolean',required:false}]) },
  ],

  // ── Serper ──
  serper: [
    { method: 'POST', path: '/search', description: 'Google search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false},{name:'gl',type:'string',required:false,description:'Country code'},{name:'hl',type:'string',required:false}]) },
    { method: 'POST', path: '/images', description: 'Google image search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false}]) },
    { method: 'POST', path: '/news', description: 'Google news search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false}]) },
    { method: 'POST', path: '/videos', description: 'Google video search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false}]) },
    { method: 'POST', path: '/shopping', description: 'Google shopping results', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false}]) },
    { method: 'POST', path: '/maps', description: 'Google maps search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'ll',type:'string',required:false,description:'Latitude,longitude'}]) },
    { method: 'POST', path: '/scholar', description: 'Google Scholar search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'num',type:'integer',required:false}]) },
    { method: 'POST', path: '/autocomplete', description: 'Google autocomplete suggestions', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
  ],

  // ── SerpAPI ──
  serpapi: [
    { method: 'GET', path: '/search', description: 'Search Google', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'engine',type:'string',required:false,description:'google, bing, yahoo, etc.'},{name:'location',type:'string',required:false},{name:'num',type:'integer',required:false}]) },
    { method: 'GET', path: '/search?engine=google_images', description: 'Google Images search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'tbm',type:'string',required:false}]) },
    { method: 'GET', path: '/search?engine=google_news', description: 'Google News search', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
    { method: 'GET', path: '/search?engine=google_maps', description: 'Google Maps search', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'ll',type:'string',required:false}]) },
    { method: 'GET', path: '/search?engine=google_jobs', description: 'Google Jobs search', parameters: JSON.stringify([{name:'q',type:'string',required:true}]) },
    { method: 'GET', path: '/search?engine=youtube', description: 'YouTube search', parameters: JSON.stringify([{name:'search_query',type:'string',required:true}]) },
    { method: 'GET', path: '/locations.json', description: 'List supported locations', parameters: JSON.stringify([{name:'q',type:'string',required:false}]) },
    { method: 'GET', path: '/account', description: 'Get account info and usage', parameters: JSON.stringify([]) },
  ],

  // ── Veriff ──
  veriff: [
    { method: 'POST', path: '/v1/sessions', description: 'Create a verification session', parameters: JSON.stringify([{name:'verification',type:'object',required:true,description:'Person info and callback URL'}]) },
    { method: 'GET', path: '/v1/sessions/:id', description: 'Get session status', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/sessions/:id/decision', description: 'Get verification decision', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/sessions/:id/media', description: 'Get session media (photos/video)', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'DELETE', path: '/v1/sessions/:id', description: 'Delete session data (GDPR)', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'PATCH', path: '/v1/sessions/:id', description: 'Update session configuration', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'verification',type:'object',required:true}]) },
  ],

  // ── Brandfetch ──
  brandfetch: [
    { method: 'GET', path: '/v2/brands/:domain', description: 'Get brand info by domain', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/brands/:domain/logos', description: 'Get brand logos', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/brands/:domain/colors', description: 'Get brand colors', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/brands/:domain/fonts', description: 'Get brand fonts', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/brands/:domain/images', description: 'Get brand images and banners', parameters: JSON.stringify([{name:'domain',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/search/:query', description: 'Search for brands', parameters: JSON.stringify([{name:'query',type:'string',required:true}]) },
  ],

  // ── OpenWeatherMap ──
  openweathermap: [
    { method: 'GET', path: '/data/2.5/weather', description: 'Current weather by city', parameters: JSON.stringify([{name:'q',type:'string',required:false,description:'City name'},{name:'lat',type:'number',required:false},{name:'lon',type:'number',required:false},{name:'units',type:'string',required:false,description:'standard, metric, imperial'}]) },
    { method: 'GET', path: '/data/2.5/forecast', description: '5-day 3-hour forecast', parameters: JSON.stringify([{name:'q',type:'string',required:false},{name:'lat',type:'number',required:false},{name:'lon',type:'number',required:false},{name:'units',type:'string',required:false}]) },
    { method: 'GET', path: '/data/3.0/onecall', description: 'One Call API (current, hourly, daily)', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true},{name:'exclude',type:'string',required:false,description:'current,minutely,hourly,daily,alerts'}]) },
    { method: 'GET', path: '/geo/1.0/direct', description: 'Geocode city name to coordinates', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/geo/1.0/reverse', description: 'Reverse geocode coordinates to city', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true}]) },
    { method: 'GET', path: '/data/2.5/air_pollution', description: 'Air quality data', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true}]) },
    { method: 'GET', path: '/data/2.5/air_pollution/forecast', description: 'Air quality forecast', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true}]) },
  ],

  // ── YouTube Data ──
  'youtube-data': [
    { method: 'GET', path: '/youtube/v3/search', description: 'Search for videos, channels, playlists', parameters: JSON.stringify([{name:'q',type:'string',required:true},{name:'part',type:'string',required:true,description:'snippet'},{name:'type',type:'string',required:false,description:'video, channel, playlist'},{name:'maxResults',type:'integer',required:false}]) },
    { method: 'GET', path: '/youtube/v3/videos', description: 'Get video details', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'part',type:'string',required:true,description:'snippet,statistics,contentDetails'}]) },
    { method: 'GET', path: '/youtube/v3/channels', description: 'Get channel details', parameters: JSON.stringify([{name:'id',type:'string',required:false},{name:'forUsername',type:'string',required:false},{name:'part',type:'string',required:true}]) },
    { method: 'GET', path: '/youtube/v3/playlists', description: 'Get playlists', parameters: JSON.stringify([{name:'channelId',type:'string',required:false},{name:'id',type:'string',required:false},{name:'part',type:'string',required:true}]) },
    { method: 'GET', path: '/youtube/v3/playlistItems', description: 'Get playlist items', parameters: JSON.stringify([{name:'playlistId',type:'string',required:true},{name:'part',type:'string',required:true},{name:'maxResults',type:'integer',required:false}]) },
    { method: 'GET', path: '/youtube/v3/commentThreads', description: 'Get video comments', parameters: JSON.stringify([{name:'videoId',type:'string',required:true},{name:'part',type:'string',required:true},{name:'maxResults',type:'integer',required:false}]) },
    { method: 'GET', path: '/youtube/v3/captions', description: 'List video captions/subtitles', parameters: JSON.stringify([{name:'videoId',type:'string',required:true},{name:'part',type:'string',required:true}]) },
    { method: 'GET', path: '/youtube/v3/videoCategories', description: 'List video categories', parameters: JSON.stringify([{name:'regionCode',type:'string',required:false},{name:'part',type:'string',required:true}]) },
  ],

  // ── ScrapeGraph AI ──
  scrapegraphai: [
    { method: 'POST', path: '/v1/smartscraper', description: 'AI-powered smart scraping', parameters: JSON.stringify([{name:'website_url',type:'string',required:true},{name:'user_prompt',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/localscraper', description: 'Scrape from local HTML', parameters: JSON.stringify([{name:'website_html',type:'string',required:true},{name:'user_prompt',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/markdownify', description: 'Convert URL to markdown', parameters: JSON.stringify([{name:'website_url',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/smartscraper/:requestId', description: 'Get scrape job status', parameters: JSON.stringify([{name:'requestId',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/credits', description: 'Get remaining credits', parameters: JSON.stringify([]) },
  ],

  // ── Olostep ──
  olostep: [
    { method: 'POST', path: '/v1/scrape', description: 'Scrape a web page', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'formats',type:'array',required:false},{name:'waitFor',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/screenshot', description: 'Take a screenshot of a URL', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'fullPage',type:'boolean',required:false}]) },
    { method: 'POST', path: '/v1/extract', description: 'Extract structured data', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'schema',type:'object',required:true}]) },
    { method: 'POST', path: '/v1/batch', description: 'Batch scrape multiple URLs', parameters: JSON.stringify([{name:'urls',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/usage', description: 'Get API usage stats', parameters: JSON.stringify([]) },
  ],

  // ── Shofo ──
  shofo: [
    { method: 'POST', path: '/v1/search', description: 'Search for products', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/product/:id', description: 'Get product details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/categories', description: 'List product categories', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v1/compare', description: 'Compare multiple products', parameters: JSON.stringify([{name:'product_ids',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/trending', description: 'Get trending products', parameters: JSON.stringify([{name:'category',type:'string',required:false}]) },
  ],

  // ── Anthropic ──
  anthropic: [
    { method: 'POST', path: '/v1/messages', description: 'Create a message with Claude', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'claude-3-opus, claude-3-sonnet, claude-3-haiku'},{name:'messages',type:'array',required:true},{name:'max_tokens',type:'integer',required:true},{name:'temperature',type:'number',required:false},{name:'system',type:'string',required:false},{name:'stream',type:'boolean',required:false}]) },
    { method: 'POST', path: '/v1/messages/count_tokens', description: 'Count tokens in a message', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'messages',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/models', description: 'List available models', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v1/models/:model_id', description: 'Get model details', parameters: JSON.stringify([{name:'model_id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/messages/batches', description: 'Create a message batch', parameters: JSON.stringify([{name:'requests',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/messages/batches/:batch_id', description: 'Get batch status', parameters: JSON.stringify([{name:'batch_id',type:'string',required:true}]) },
  ],

  // ── Groq ──
  groq: [
    { method: 'POST', path: '/openai/v1/chat/completions', description: 'Create a fast chat completion', parameters: JSON.stringify([{name:'model',type:'string',required:true,description:'llama3-8b-8192, mixtral-8x7b-32768, etc.'},{name:'messages',type:'array',required:true},{name:'temperature',type:'number',required:false},{name:'max_tokens',type:'integer',required:false},{name:'stream',type:'boolean',required:false}]) },
    { method: 'POST', path: '/openai/v1/audio/transcriptions', description: 'Transcribe audio with Whisper', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'model',type:'string',required:true,description:'whisper-large-v3'}]) },
    { method: 'POST', path: '/openai/v1/audio/translations', description: 'Translate audio to English', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'model',type:'string',required:true}]) },
    { method: 'GET', path: '/openai/v1/models', description: 'List available models', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/openai/v1/embeddings', description: 'Create text embeddings', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'input',type:'string',required:true}]) },
  ],

  // ── Together AI ──
  together: [
    { method: 'POST', path: '/v1/chat/completions', description: 'Chat completion with open-source models', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'messages',type:'array',required:true},{name:'max_tokens',type:'integer',required:false},{name:'temperature',type:'number',required:false},{name:'stream',type:'boolean',required:false}]) },
    { method: 'POST', path: '/v1/completions', description: 'Text completion', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'prompt',type:'string',required:true},{name:'max_tokens',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/embeddings', description: 'Create embeddings', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'input',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/images/generations', description: 'Generate images', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'prompt',type:'string',required:true},{name:'n',type:'integer',required:false},{name:'width',type:'integer',required:false},{name:'height',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/models', description: 'List available models', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v1/fine-tunes', description: 'Create a fine-tuning job', parameters: JSON.stringify([{name:'training_file',type:'string',required:true},{name:'model',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/fine-tunes', description: 'List fine-tuning jobs', parameters: JSON.stringify([]) },
  ],

  // ── Polymarket ──
  polymarket: [
    { method: 'GET', path: '/markets', description: 'List prediction markets', parameters: JSON.stringify([{name:'limit',type:'integer',required:false},{name:'offset',type:'integer',required:false}]) },
    { method: 'GET', path: '/markets/:id', description: 'Get market details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/markets/:id/trades', description: 'Get market trade history', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/markets/:id/orderbook', description: 'Get market order book', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/events', description: 'List events with markets', parameters: JSON.stringify([{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/markets/:id/prices', description: 'Get price history', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'interval',type:'string',required:false}]) },
  ],

  // ── Stability AI ──
  stability: [
    { method: 'POST', path: '/v2beta/stable-image/generate/sd3', description: 'Generate image with Stable Diffusion 3', parameters: JSON.stringify([{name:'prompt',type:'string',required:true},{name:'negative_prompt',type:'string',required:false},{name:'aspect_ratio',type:'string',required:false},{name:'output_format',type:'string',required:false}]) },
    { method: 'POST', path: '/v2beta/stable-image/generate/ultra', description: 'Generate high-res image', parameters: JSON.stringify([{name:'prompt',type:'string',required:true},{name:'aspect_ratio',type:'string',required:false}]) },
    { method: 'POST', path: '/v2beta/stable-image/generate/core', description: 'Generate image (fast, affordable)', parameters: JSON.stringify([{name:'prompt',type:'string',required:true},{name:'aspect_ratio',type:'string',required:false}]) },
    { method: 'POST', path: '/v2beta/stable-image/upscale', description: 'Upscale an image', parameters: JSON.stringify([{name:'image',type:'file',required:true},{name:'prompt',type:'string',required:false}]) },
    { method: 'POST', path: '/v2beta/stable-image/edit/inpaint', description: 'Inpaint/edit parts of an image', parameters: JSON.stringify([{name:'image',type:'file',required:true},{name:'mask',type:'file',required:true},{name:'prompt',type:'string',required:true}]) },
    { method: 'POST', path: '/v2beta/stable-image/edit/outpaint', description: 'Extend an image outward', parameters: JSON.stringify([{name:'image',type:'file',required:true},{name:'prompt',type:'string',required:false},{name:'left',type:'integer',required:false},{name:'right',type:'integer',required:false}]) },
    { method: 'POST', path: '/v2beta/stable-image/edit/remove-background', description: 'Remove image background', parameters: JSON.stringify([{name:'image',type:'file',required:true}]) },
  ],

  // ── Replicate ──
  replicate: [
    { method: 'POST', path: '/v1/predictions', description: 'Run a model prediction', parameters: JSON.stringify([{name:'version',type:'string',required:true,description:'Model version hash'},{name:'input',type:'object',required:true}]) },
    { method: 'GET', path: '/v1/predictions/:id', description: 'Get prediction status', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/predictions/:id/cancel', description: 'Cancel a prediction', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/predictions', description: 'List recent predictions', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v1/models', description: 'List public models', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v1/models/:owner/:name', description: 'Get model details', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'name',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/models/:owner/:name/versions', description: 'List model versions', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'name',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/deployments/:owner/:name/predictions', description: 'Run on a deployment', parameters: JSON.stringify([{name:'owner',type:'string',required:true},{name:'name',type:'string',required:true},{name:'input',type:'object',required:true}]) },
  ],

  // ── Twilio ──
  twilio: [
    { method: 'POST', path: '/2010-04-01/Accounts/:AccountSid/Messages.json', description: 'Send an SMS or MMS', parameters: JSON.stringify([{name:'To',type:'string',required:true},{name:'From',type:'string',required:true},{name:'Body',type:'string',required:true},{name:'MediaUrl',type:'string',required:false}]) },
    { method: 'GET', path: '/2010-04-01/Accounts/:AccountSid/Messages.json', description: 'List sent messages', parameters: JSON.stringify([{name:'To',type:'string',required:false},{name:'From',type:'string',required:false},{name:'PageSize',type:'integer',required:false}]) },
    { method: 'GET', path: '/2010-04-01/Accounts/:AccountSid/Messages/:Sid.json', description: 'Get message details', parameters: JSON.stringify([{name:'Sid',type:'string',required:true}]) },
    { method: 'POST', path: '/2010-04-01/Accounts/:AccountSid/Calls.json', description: 'Make a phone call', parameters: JSON.stringify([{name:'To',type:'string',required:true},{name:'From',type:'string',required:true},{name:'Url',type:'string',required:true,description:'TwiML instructions URL'}]) },
    { method: 'GET', path: '/2010-04-01/Accounts/:AccountSid/Calls.json', description: 'List calls', parameters: JSON.stringify([{name:'Status',type:'string',required:false},{name:'PageSize',type:'integer',required:false}]) },
    { method: 'POST', path: '/v2/Services/:ServiceSid/Verifications', description: 'Send a verification code', parameters: JSON.stringify([{name:'To',type:'string',required:true},{name:'Channel',type:'string',required:true,description:'sms, call, email'}]) },
    { method: 'POST', path: '/v2/Services/:ServiceSid/VerificationCheck', description: 'Check a verification code', parameters: JSON.stringify([{name:'To',type:'string',required:true},{name:'Code',type:'string',required:true}]) },
    { method: 'GET', path: '/2010-04-01/Accounts/:AccountSid/Usage/Records.json', description: 'Get usage records', parameters: JSON.stringify([{name:'Category',type:'string',required:false}]) },
  ],

  // ── UploadThing ──
  uploadthing: [
    { method: 'POST', path: '/api/uploadthing', description: 'Upload a file', parameters: JSON.stringify([{name:'files',type:'array',required:true},{name:'acl',type:'string',required:false}]) },
    { method: 'GET', path: '/api/listFiles', description: 'List uploaded files', parameters: JSON.stringify([{name:'limit',type:'integer',required:false},{name:'offset',type:'integer',required:false}]) },
    { method: 'POST', path: '/api/deleteFile', description: 'Delete a file', parameters: JSON.stringify([{name:'fileKey',type:'string',required:true}]) },
    { method: 'GET', path: '/api/getFileUrl', description: 'Get file URL', parameters: JSON.stringify([{name:'fileKey',type:'string',required:true}]) },
    { method: 'POST', path: '/api/renameFile', description: 'Rename a file', parameters: JSON.stringify([{name:'fileKey',type:'string',required:true},{name:'newName',type:'string',required:true}]) },
    { method: 'GET', path: '/api/getUsageInfo', description: 'Get storage usage info', parameters: JSON.stringify([]) },
  ],

  // ── CoinGecko ──
  coingecko: [
    { method: 'GET', path: '/api/v3/coins/markets', description: 'List coins with market data', parameters: JSON.stringify([{name:'vs_currency',type:'string',required:true,description:'usd, eur, etc.'},{name:'order',type:'string',required:false},{name:'per_page',type:'integer',required:false},{name:'page',type:'integer',required:false}]) },
    { method: 'GET', path: '/api/v3/coins/:id', description: 'Get coin details', parameters: JSON.stringify([{name:'id',type:'string',required:true,description:'bitcoin, ethereum, etc.'}]) },
    { method: 'GET', path: '/api/v3/coins/:id/market_chart', description: 'Get historical market chart', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'vs_currency',type:'string',required:true},{name:'days',type:'string',required:true}]) },
    { method: 'GET', path: '/api/v3/simple/price', description: 'Get simple price', parameters: JSON.stringify([{name:'ids',type:'string',required:true,description:'Comma-separated coin IDs'},{name:'vs_currencies',type:'string',required:true}]) },
    { method: 'GET', path: '/api/v3/search/trending', description: 'Get trending coins', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/api/v3/search', description: 'Search coins, exchanges, NFTs', parameters: JSON.stringify([{name:'query',type:'string',required:true}]) },
    { method: 'GET', path: '/api/v3/coins/:id/ohlc', description: 'Get OHLC candlestick data', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'vs_currency',type:'string',required:true},{name:'days',type:'string',required:true}]) },
    { method: 'GET', path: '/api/v3/global', description: 'Get global crypto stats', parameters: JSON.stringify([]) },
  ],

  // ── DeepL ──
  deepl: [
    { method: 'POST', path: '/v2/translate', description: 'Translate text', parameters: JSON.stringify([{name:'text',type:'array',required:true},{name:'target_lang',type:'string',required:true},{name:'source_lang',type:'string',required:false},{name:'formality',type:'string',required:false}]) },
    { method: 'POST', path: '/v2/document', description: 'Translate a document', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'target_lang',type:'string',required:true},{name:'source_lang',type:'string',required:false}]) },
    { method: 'GET', path: '/v2/document/:document_id', description: 'Check document translation status', parameters: JSON.stringify([{name:'document_id',type:'string',required:true},{name:'document_key',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/languages', description: 'List supported languages', parameters: JSON.stringify([{name:'type',type:'string',required:false,description:'source or target'}]) },
    { method: 'GET', path: '/v2/usage', description: 'Get translation usage stats', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v2/glossaries', description: 'Create a glossary', parameters: JSON.stringify([{name:'name',type:'string',required:true},{name:'source_lang',type:'string',required:true},{name:'target_lang',type:'string',required:true},{name:'entries',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/glossaries', description: 'List glossaries', parameters: JSON.stringify([]) },
  ],

  // ── Mapbox ──
  mapbox: [
    { method: 'GET', path: '/geocoding/v5/mapbox.places/:query.json', description: 'Forward geocode (address to coordinates)', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'limit',type:'integer',required:false},{name:'country',type:'string',required:false}]) },
    { method: 'GET', path: '/geocoding/v5/mapbox.places/:lon,:lat.json', description: 'Reverse geocode (coordinates to address)', parameters: JSON.stringify([{name:'lon',type:'number',required:true},{name:'lat',type:'number',required:true}]) },
    { method: 'GET', path: '/directions/v5/mapbox/driving/:coordinates', description: 'Get driving directions', parameters: JSON.stringify([{name:'coordinates',type:'string',required:true,description:'lon1,lat1;lon2,lat2'},{name:'alternatives',type:'boolean',required:false},{name:'steps',type:'boolean',required:false}]) },
    { method: 'GET', path: '/directions/v5/mapbox/walking/:coordinates', description: 'Get walking directions', parameters: JSON.stringify([{name:'coordinates',type:'string',required:true}]) },
    { method: 'GET', path: '/directions/v5/mapbox/cycling/:coordinates', description: 'Get cycling directions', parameters: JSON.stringify([{name:'coordinates',type:'string',required:true}]) },
    { method: 'GET', path: '/isochrone/v1/mapbox/driving/:lon,:lat', description: 'Get isochrone (reachability area)', parameters: JSON.stringify([{name:'lon',type:'number',required:true},{name:'lat',type:'number',required:true},{name:'contours_minutes',type:'string',required:true}]) },
    { method: 'GET', path: '/optimized-trips/v1/mapbox/driving/:coordinates', description: 'Optimize a multi-stop trip', parameters: JSON.stringify([{name:'coordinates',type:'string',required:true}]) },
    { method: 'GET', path: '/styles/v1/:owner', description: 'List map styles', parameters: JSON.stringify([{name:'owner',type:'string',required:true}]) },
  ],

  // ── Apollo ──
  apollo: [
    { method: 'POST', path: '/v1/people/match', description: 'Find a person by name and company', parameters: JSON.stringify([{name:'first_name',type:'string',required:true},{name:'last_name',type:'string',required:true},{name:'organization_name',type:'string',required:false},{name:'domain',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/people/search', description: 'Search for people', parameters: JSON.stringify([{name:'person_titles',type:'array',required:false},{name:'person_locations',type:'array',required:false},{name:'organization_domains',type:'array',required:false},{name:'per_page',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/organizations/search', description: 'Search for companies', parameters: JSON.stringify([{name:'organization_domains',type:'array',required:false},{name:'organization_locations',type:'array',required:false},{name:'per_page',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/people/:id', description: 'Get person details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/organizations/:id', description: 'Get organization details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/people/bulk_match', description: 'Bulk match people', parameters: JSON.stringify([{name:'details',type:'array',required:true}]) },
    { method: 'POST', path: '/v1/mixed_people/search', description: 'Search contacts and leads', parameters: JSON.stringify([{name:'q_keywords',type:'string',required:false},{name:'person_titles',type:'array',required:false}]) },
    { method: 'GET', path: '/v1/emailer_campaigns', description: 'List email sequences', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v1/emailer_campaigns/:id/add_contact_ids', description: 'Add contacts to a sequence', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'contact_ids',type:'array',required:true}]) },
    { method: 'GET', path: '/v1/email_accounts', description: 'List email accounts', parameters: JSON.stringify([]) },
  ],

  // ── Apify ──
  apify: [
    { method: 'POST', path: '/v2/acts/:actorId/runs', description: 'Run an actor', parameters: JSON.stringify([{name:'actorId',type:'string',required:true},{name:'input',type:'object',required:false}]) },
    { method: 'GET', path: '/v2/acts/:actorId/runs/:runId', description: 'Get actor run details', parameters: JSON.stringify([{name:'actorId',type:'string',required:true},{name:'runId',type:'string',required:true}]) },
    { method: 'GET', path: '/v2/acts/:actorId/runs/:runId/dataset/items', description: 'Get run results', parameters: JSON.stringify([{name:'actorId',type:'string',required:true},{name:'runId',type:'string',required:true},{name:'format',type:'string',required:false}]) },
    { method: 'GET', path: '/v2/acts', description: 'List your actors', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/v2/store', description: 'Browse Apify Store actors', parameters: JSON.stringify([{name:'search',type:'string',required:false},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/v2/datasets/:datasetId/items', description: 'Get dataset items', parameters: JSON.stringify([{name:'datasetId',type:'string',required:true},{name:'format',type:'string',required:false}]) },
    { method: 'POST', path: '/v2/acts/:actorId/run-sync', description: 'Run actor and wait for results', parameters: JSON.stringify([{name:'actorId',type:'string',required:true},{name:'input',type:'object',required:false}]) },
    { method: 'GET', path: '/v2/key-value-stores/:storeId/records/:key', description: 'Get key-value store record', parameters: JSON.stringify([{name:'storeId',type:'string',required:true},{name:'key',type:'string',required:true}]) },
  ],

  // ── Cohere ──
  cohere: [
    { method: 'POST', path: '/v2/chat', description: 'Chat with Command models', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'messages',type:'array',required:true},{name:'temperature',type:'number',required:false},{name:'max_tokens',type:'integer',required:false}]) },
    { method: 'POST', path: '/v2/embed', description: 'Generate text embeddings', parameters: JSON.stringify([{name:'texts',type:'array',required:true},{name:'model',type:'string',required:true},{name:'input_type',type:'string',required:true,description:'search_document, search_query, classification, clustering'}]) },
    { method: 'POST', path: '/v2/rerank', description: 'Rerank search results', parameters: JSON.stringify([{name:'model',type:'string',required:true},{name:'query',type:'string',required:true},{name:'documents',type:'array',required:true},{name:'top_n',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/classify', description: 'Classify text', parameters: JSON.stringify([{name:'inputs',type:'array',required:true},{name:'examples',type:'array',required:true}]) },
    { method: 'POST', path: '/v1/summarize', description: 'Summarize text', parameters: JSON.stringify([{name:'text',type:'string',required:true},{name:'length',type:'string',required:false},{name:'format',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/tokenize', description: 'Tokenize text', parameters: JSON.stringify([{name:'text',type:'string',required:true},{name:'model',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/models', description: 'List available models', parameters: JSON.stringify([]) },
  ],

  // ── Resend ──
  resend: [
    { method: 'POST', path: '/emails', description: 'Send an email', parameters: JSON.stringify([{name:'from',type:'string',required:true},{name:'to',type:'array',required:true},{name:'subject',type:'string',required:true},{name:'html',type:'string',required:false},{name:'text',type:'string',required:false},{name:'cc',type:'array',required:false},{name:'bcc',type:'array',required:false}]) },
    { method: 'GET', path: '/emails/:id', description: 'Get email details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/emails/batch', description: 'Send batch emails', parameters: JSON.stringify([{name:'emails',type:'array',required:true}]) },
    { method: 'POST', path: '/domains', description: 'Add a sending domain', parameters: JSON.stringify([{name:'name',type:'string',required:true}]) },
    { method: 'GET', path: '/domains', description: 'List domains', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/domains/:id', description: 'Get domain details', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/audiences', description: 'Create an audience', parameters: JSON.stringify([{name:'name',type:'string',required:true}]) },
    { method: 'POST', path: '/audiences/:id/contacts', description: 'Add a contact to audience', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'email',type:'string',required:true},{name:'first_name',type:'string',required:false}]) },
    { method: 'GET', path: '/api-keys', description: 'List API keys', parameters: JSON.stringify([]) },
  ],

  // ── Notion ──
  notion: [
    { method: 'POST', path: '/v1/pages', description: 'Create a page', parameters: JSON.stringify([{name:'parent',type:'object',required:true,description:'{database_id: ...} or {page_id: ...}'},{name:'properties',type:'object',required:true},{name:'children',type:'array',required:false}]) },
    { method: 'GET', path: '/v1/pages/:id', description: 'Retrieve a page', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'PATCH', path: '/v1/pages/:id', description: 'Update page properties', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'properties',type:'object',required:true}]) },
    { method: 'POST', path: '/v1/databases/:id/query', description: 'Query a database', parameters: JSON.stringify([{name:'id',type:'string',required:true},{name:'filter',type:'object',required:false},{name:'sorts',type:'array',required:false},{name:'page_size',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/databases', description: 'Create a database', parameters: JSON.stringify([{name:'parent',type:'object',required:true},{name:'title',type:'array',required:true},{name:'properties',type:'object',required:true}]) },
    { method: 'GET', path: '/v1/databases/:id', description: 'Retrieve a database', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/blocks/:id/children', description: 'Get block children', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'PATCH', path: '/v1/blocks/:id', description: 'Update a block', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/search', description: 'Search across all pages and databases', parameters: JSON.stringify([{name:'query',type:'string',required:false},{name:'filter',type:'object',required:false},{name:'sort',type:'object',required:false}]) },
    { method: 'GET', path: '/v1/users', description: 'List users in workspace', parameters: JSON.stringify([]) },
  ],

  // ── Linear ──
  linear: [
    { method: 'POST', path: '/graphql', description: 'Create an issue', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'mutation { issueCreate(input: {...}) { ... } }'},{name:'variables',type:'object',required:false}]) },
    { method: 'POST', path: '/graphql', description: 'List issues', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'query { issues { nodes { id title state { name } } } }'}]) },
    { method: 'POST', path: '/graphql', description: 'Update an issue', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'mutation { issueUpdate(id: "...", input: {...}) { ... } }'}]) },
    { method: 'POST', path: '/graphql', description: 'List projects', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'query { projects { nodes { id name } } }'}]) },
    { method: 'POST', path: '/graphql', description: 'Create a comment', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'mutation { commentCreate(input: {...}) { ... } }'}]) },
    { method: 'POST', path: '/graphql', description: 'List teams', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'query { teams { nodes { id name } } }'}]) },
    { method: 'POST', path: '/graphql', description: 'Search issues', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'query { issueSearch(query: "...") { nodes { ... } } }'}]) },
    { method: 'POST', path: '/graphql', description: 'Get current user', parameters: JSON.stringify([{name:'query',type:'string',required:true,description:'query { viewer { id name email } }'}]) },
  ],

  // ── Linkup ──
  linkup: [
    { method: 'POST', path: '/v1/search', description: 'Search the web with AI', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'depth',type:'string',required:false},{name:'max_results',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/extract', description: 'Extract content from a URL', parameters: JSON.stringify([{name:'url',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/summarize', description: 'Summarize web content', parameters: JSON.stringify([{name:'url',type:'string',required:true},{name:'max_length',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/usage', description: 'Get API usage stats', parameters: JSON.stringify([]) },
  ],

  // ── Riveter ──
  riveter: [
    { method: 'POST', path: '/v1/extract', description: 'Extract data from documents', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'schema',type:'object',required:false}]) },
    { method: 'POST', path: '/v1/parse', description: 'Parse document to structured data', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'format',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/classify', description: 'Classify a document', parameters: JSON.stringify([{name:'file',type:'file',required:true},{name:'categories',type:'array',required:false}]) },
    { method: 'GET', path: '/v1/jobs/:id', description: 'Get extraction job status', parameters: JSON.stringify([{name:'id',type:'string',required:true}]) },
    { method: 'GET', path: '/v1/usage', description: 'Get usage stats', parameters: JSON.stringify([]) },
  ],

  // ── Sixtyfour ──
  sixtyfour: [
    { method: 'POST', path: '/v1/encode', description: 'Encode data to base64', parameters: JSON.stringify([{name:'data',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/decode', description: 'Decode base64 data', parameters: JSON.stringify([{name:'data',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/transform', description: 'Transform data between formats', parameters: JSON.stringify([{name:'data',type:'string',required:true},{name:'from',type:'string',required:true},{name:'to',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/hash', description: 'Hash data with various algorithms', parameters: JSON.stringify([{name:'data',type:'string',required:true},{name:'algorithm',type:'string',required:false,description:'md5, sha256, sha512'}]) },
    { method: 'POST', path: '/v1/encrypt', description: 'Encrypt data', parameters: JSON.stringify([{name:'data',type:'string',required:true},{name:'key',type:'string',required:true}]) },
  ],

  // ── Fiber AI ──
  fiberai: [
    { method: 'POST', path: '/v1/enrich/person', description: 'Enrich a person profile', parameters: JSON.stringify([{name:'email',type:'string',required:false},{name:'name',type:'string',required:false},{name:'company',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/enrich/company', description: 'Enrich a company profile', parameters: JSON.stringify([{name:'domain',type:'string',required:false},{name:'name',type:'string',required:false}]) },
    { method: 'POST', path: '/v1/search/people', description: 'Search for people', parameters: JSON.stringify([{name:'query',type:'object',required:true},{name:'limit',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/search/companies', description: 'Search for companies', parameters: JSON.stringify([{name:'query',type:'object',required:true},{name:'limit',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/usage', description: 'Get API usage', parameters: JSON.stringify([]) },
    { method: 'POST', path: '/v1/enrich/bulk', description: 'Bulk enrich profiles', parameters: JSON.stringify([{name:'records',type:'array',required:true}]) },
  ],

  // ── Precip AI ──
  precipai: [
    { method: 'POST', path: '/v1/predict', description: 'Get weather prediction', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true},{name:'hours',type:'integer',required:false}]) },
    { method: 'GET', path: '/v1/current/:lat/:lon', description: 'Get current precipitation data', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true}]) },
    { method: 'POST', path: '/v1/alerts', description: 'Set up weather alert', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true},{name:'threshold',type:'number',required:false}]) },
    { method: 'GET', path: '/v1/history', description: 'Get historical precipitation data', parameters: JSON.stringify([{name:'lat',type:'number',required:true},{name:'lon',type:'number',required:true},{name:'date',type:'string',required:true}]) },
  ],

  // ── Andi Search ──
  andi: [
    { method: 'POST', path: '/v1/search', description: 'AI-powered search', parameters: JSON.stringify([{name:'query',type:'string',required:true},{name:'max_results',type:'integer',required:false}]) },
    { method: 'POST', path: '/v1/answer', description: 'Get a direct AI answer', parameters: JSON.stringify([{name:'query',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/summarize', description: 'Summarize a URL', parameters: JSON.stringify([{name:'url',type:'string',required:true}]) },
    { method: 'POST', path: '/v1/factcheck', description: 'Fact-check a claim', parameters: JSON.stringify([{name:'claim',type:'string',required:true}]) },
  ],

  // ── JSONPlaceholder ──
  jsonplaceholder: [
    { method: 'GET', path: '/posts', description: 'List all posts', parameters: JSON.stringify([{name:'_limit',type:'integer',required:false},{name:'userId',type:'integer',required:false}]) },
    { method: 'GET', path: '/posts/:id', description: 'Get a post by ID', parameters: JSON.stringify([{name:'id',type:'integer',required:true}]) },
    { method: 'POST', path: '/posts', description: 'Create a post', parameters: JSON.stringify([{name:'title',type:'string',required:true},{name:'body',type:'string',required:true},{name:'userId',type:'integer',required:true}]) },
    { method: 'PUT', path: '/posts/:id', description: 'Update a post', parameters: JSON.stringify([{name:'id',type:'integer',required:true},{name:'title',type:'string',required:true},{name:'body',type:'string',required:true}]) },
    { method: 'DELETE', path: '/posts/:id', description: 'Delete a post', parameters: JSON.stringify([{name:'id',type:'integer',required:true}]) },
    { method: 'GET', path: '/posts/:id/comments', description: 'Get comments on a post', parameters: JSON.stringify([{name:'id',type:'integer',required:true}]) },
    { method: 'GET', path: '/comments', description: 'List all comments', parameters: JSON.stringify([{name:'postId',type:'integer',required:false}]) },
    { method: 'GET', path: '/users', description: 'List all users', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/users/:id', description: 'Get a user by ID', parameters: JSON.stringify([{name:'id',type:'integer',required:true}]) },
    { method: 'GET', path: '/todos', description: 'List all todos', parameters: JSON.stringify([{name:'userId',type:'integer',required:false},{name:'completed',type:'boolean',required:false}]) },
    { method: 'GET', path: '/albums', description: 'List all albums', parameters: JSON.stringify([]) },
    { method: 'GET', path: '/photos', description: 'List all photos', parameters: JSON.stringify([{name:'albumId',type:'integer',required:false}]) },
  ],
};

async function seed() {
  console.log('Starting endpoint seed...');
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const [slug, endpoints] of Object.entries(ENDPOINTS)) {
    // Find the API
    const api = await prisma.api.findUnique({ where: { slug } });
    if (!api) {
      console.log(`  SKIP: API "${slug}" not found in database`);
      totalSkipped++;
      continue;
    }

    // Delete existing endpoints for this API
    const deleted = await prisma.endpoint.deleteMany({ where: { apiId: api.id } });
    if (deleted.count > 0) {
      console.log(`  Cleared ${deleted.count} old endpoints for ${slug}`);
    }

    // Create new endpoints
    for (const ep of endpoints) {
      await prisma.endpoint.create({
        data: {
          apiId: api.id,
          method: ep.method,
          path: ep.path,
          description: ep.description,
          parameters: ep.parameters || '[]',
          responseExample: ep.responseExample || null,
        },
      });
    }

    console.log(`  ✓ ${slug}: ${endpoints.length} endpoints`);
    totalCreated += endpoints.length;
  }

  console.log(`\nDone! Created ${totalCreated} endpoints across ${Object.keys(ENDPOINTS).length} APIs. Skipped: ${totalSkipped}`);
}

seed()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
