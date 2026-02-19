// Production-ready API definitions with proper authentication handling
// This data includes setup guides and clear auth requirements

const apis = [
  {
    slug: 'jsonplaceholder',
    name: 'JSONPlaceholder (Demo)',
    category: 'Data',
    icon: '📝',
    featured: true,
    shortDescription: 'Free fake online REST API for testing and prototyping',
    fullDescription:
      'Perfect for testing the API Playground without credentials. JSONPlaceholder provides fake data that responds like a real API.',
    useCases: [
      'Test the playground',
      'Learn how to use Callio',
      'Prototype integrations',
      'Demo to others',
      'No credentials needed',
    ],
    documentation: 'https://jsonplaceholder.typicode.com/',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    authentication: 'None (Public API)',
    allowUnauthenticated: true,
    rateLimit: 'Unlimited for testing',
    pricing: 'Free',
    webhook: false,
    setupGuide: 'No setup required! This is a public demo API. Just click "Try It" and start testing.',
    setupUrl: null,
    endpoints: [
      {
        method: 'GET',
        path: '/posts',
        description: 'List all posts',
        parameters: [
          { name: '_limit', type: 'number', required: false, description: 'Limit results (e.g., 5)' },
        ],
        responseExample: { 
          id: 1, 
          title: 'Test Post',
          body: 'This is a test post',
          userId: 1
        },
      },
      {
        method: 'GET',
        path: '/posts/{id}',
        description: 'Get a specific post',
        parameters: [
          { name: 'id', type: 'number', required: true, description: 'Post ID' },
        ],
        responseExample: { 
          id: 1, 
          title: 'Test Post',
          body: 'This is a test post',
          userId: 1
        },
      },
      {
        method: 'POST',
        path: '/posts',
        description: 'Create a new post',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'Post title' },
          { name: 'body', type: 'string', required: true, description: 'Post content' },
          { name: 'userId', type: 'number', required: true, description: 'User ID' },
        ],
        responseExample: { 
          id: 101,
          title: 'New Post',
          body: 'New content',
          userId: 1
        },
      },
    ],
  },
  {
    slug: 'stripe-payments',
    name: 'Stripe Payments',
    category: 'Payments',
    icon: '💳',
    featured: true,
    shortDescription: 'Accept payments and manage subscriptions',
    fullDescription:
      'Integrate Stripe payments into your AI agents. Process payments, manage subscriptions, handle refunds, and build payment workflows.',
    useCases: [
      'Process one-time payments',
      'Manage subscription billing',
      'Handle refunds and chargebacks',
      'Multi-currency transactions',
      'Invoice generation and tracking',
    ],
    documentation: 'https://stripe.com/docs/api',
    baseUrl: 'https://api.stripe.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: '100 requests/second',
    pricing: 'Pay-as-you-go: 2.9% + $0.30 per transaction',
    webhook: true,
    setupGuide: `To test Stripe in the playground:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your Secret Key (starts with sk_test_ for testing)
3. Paste it in the "API Key" field in the playground
4. Try the endpoints with test mode enabled`,
    setupUrl: 'https://dashboard.stripe.com/apikeys',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/payment_intents',
        description: 'Create a payment intent',
        parameters: [
          { name: 'amount', type: 'number', required: true, description: 'Amount in cents (e.g., 1000 = $10.00)' },
          { name: 'currency', type: 'string', required: true, description: 'ISO currency code (usd, eur, etc.)' },
          { name: 'description', type: 'string', required: false, description: 'Payment description' },
        ],
        responseExample: { id: 'pi_1234567890', status: 'requires_payment_method', amount: 1000, currency: 'usd' },
      },
      {
        method: 'GET',
        path: '/v1/customers',
        description: 'List all customers',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of results (max 100)' },
        ],
        responseExample: { object: 'list', data: [{ id: 'cus_1234', email: 'test@example.com', name: 'Test Customer' }] },
      },
    ],
  },
  {
    slug: 'sendgrid-email',
    name: 'SendGrid Email',
    category: 'Communications',
    icon: '📧',
    featured: true,
    shortDescription: 'Send transactional emails at scale',
    fullDescription:
      'Enable your AI agents to send reliable emails. Built-in templates, delivery tracking, and analytics to monitor engagement.',
    useCases: [
      'Send verification codes',
      'Transaction notifications',
      'Alert users to important events',
      'Schedule bulk campaigns',
      'Track delivery and engagement',
    ],
    documentation: 'https://sendgrid.com/docs/api-reference/',
    baseUrl: 'https://api.sendgrid.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: '10,000 emails/day',
    pricing: 'Free up to 100 emails/day, then $14.95-$119.95/month',
    webhook: true,
    setupGuide: `To test SendGrid in the playground:
1. Go to https://app.sendgrid.com/settings/api_keys
2. Create an API key
3. Copy the key and paste in the "API Key" field
4. Use the playground to send test emails`,
    setupUrl: 'https://app.sendgrid.com/settings/api_keys',
    endpoints: [
      {
        method: 'POST',
        path: '/v3/mail/send',
        description: 'Send an email',
        parameters: [
          { name: 'to', type: 'string', required: true, description: 'Recipient email address' },
          { name: 'subject', type: 'string', required: true, description: 'Email subject' },
          { name: 'html', type: 'string', required: true, description: 'HTML email body' },
        ],
        responseExample: { status: 202, message: 'Email accepted for processing' },
      },
      {
        method: 'GET',
        path: '/v3/mail/send/stats',
        description: 'Get email statistics',
        parameters: [
          { name: 'start_date', type: 'string', required: true, description: 'Start date (YYYY-MM-DD)' },
        ],
        responseExample: { stats: [{ opened: 42, clicked: 10, bounced: 1, delivered: 51 }] },
      },
    ],
  },
  {
    slug: 'openai-gpt',
    name: 'OpenAI GPT',
    category: 'AI',
    icon: '🤖',
    featured: true,
    shortDescription: 'Generate text, embeddings, and AI-powered content',
    fullDescription:
      'Integrate OpenAI GPT models to generate text, create embeddings, and build AI-powered features into your agents.',
    useCases: [
      'Generate AI-powered responses',
      'Create text embeddings',
      'Summarize content',
      'Extract information from text',
      'Build conversational interfaces',
    ],
    documentation: 'https://platform.openai.com/docs/api-reference',
    baseUrl: 'https://api.openai.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: 'Varies by plan (typically 3,500 req/min)',
    pricing: '$0.002-$0.02 per 1K tokens depending on model',
    webhook: false,
    setupGuide: `To test OpenAI in the playground:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with sk-...) and paste in the "API Key" field
4. Note: You need a paid account with credits to use the API`,
    setupUrl: 'https://platform.openai.com/api-keys',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/chat/completions',
        description: 'Generate text with GPT',
        parameters: [
          { name: 'model', type: 'string', required: true, description: 'Model (e.g., gpt-4, gpt-3.5-turbo)' },
          { name: 'messages', type: 'string', required: true, description: 'JSON array of messages' },
          { name: 'max_tokens', type: 'number', required: false, description: 'Max tokens in response' },
        ],
        responseExample: { 
          id: 'chatcmpl-123',
          choices: [{ 
            message: { 
              role: 'assistant', 
              content: 'This is a sample response from GPT.' 
            } 
          }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
        },
      },
    ],
  },
  {
    slug: 'github-api',
    name: 'GitHub API',
    category: 'Development',
    icon: '🐙',
    featured: true,
    shortDescription: 'Manage repositories, issues, and pull requests',
    fullDescription:
      'Integrate with GitHub to manage repositories, create issues, manage pull requests, and build development workflows.',
    useCases: [
      'Manage repositories',
      'Create and track issues',
      'Manage pull requests',
      'Get commit information',
      'Trigger automated workflows',
    ],
    documentation: 'https://docs.github.com/en/rest',
    baseUrl: 'https://api.github.com',
    authentication: 'API Key (Bearer token) - Token or Personal Access Token',
    allowUnauthenticated: false,
    rateLimit: '5,000 requests/hour (with auth token)',
    pricing: 'Free for public repos, $21/month for private',
    webhook: true,
    setupGuide: `To test GitHub API in the playground:
1. Go to https://github.com/settings/tokens
2. Create a new Personal Access Token (Classic recommended)
3. Select 'repo' scope and copy the token
4. Paste it in the "API Key" field in the playground`,
    setupUrl: 'https://github.com/settings/tokens',
    endpoints: [
      {
        method: 'GET',
        path: '/repos/{owner}/{repo}',
        description: 'Get repository information',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repository owner (e.g., facebook)' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name (e.g., react)' },
        ],
        responseExample: { 
          id: 1296269,
          name: 'Hello-World',
          full_name: 'octocat/Hello-World',
          owner: { login: 'octocat' },
          description: 'This your first repo!',
          stargazers_count: 80
        },
      },
      {
        method: 'POST',
        path: '/repos/{owner}/{repo}/issues',
        description: 'Create a new issue',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repository owner' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name' },
          { name: 'title', type: 'string', required: true, description: 'Issue title' },
          { name: 'body', type: 'string', required: false, description: 'Issue description' },
        ],
        responseExample: { 
          id: 1,
          number: 1347,
          title: 'Found a bug',
          body: 'Issue description',
          state: 'open'
        },
      },
    ],
  },
  {
    slug: 'airtable-database',
    name: 'Airtable Database',
    category: 'Data',
    icon: '📋',
    featured: true,
    shortDescription: 'Store and manage structured data',
    fullDescription:
      'Integrate with Airtable to create, read, update, and delete records from any base. Perfect for data pipelines and form collection.',
    useCases: [
      'Store and retrieve records',
      'Collect form data',
      'Build data pipelines',
      'Sync data between systems',
      'Generate reports from data',
    ],
    documentation: 'https://airtable.com/api',
    baseUrl: 'https://api.airtable.com',
    authentication: 'API Key (Bearer token)',
    allowUnauthenticated: false,
    rateLimit: '5 requests/second',
    pricing: 'Free (limited), $10+/month for pro',
    webhook: true,
    setupGuide: `To test Airtable in the playground:
1. Go to https://airtable.com/account/tokens
2. Create a new token with Base: read-write, Workspace: read-only scopes
3. Copy the token and paste in the "API Key" field
4. Use your Base ID and Table ID in the playground
5. Find these in your base URL: https://airtable.com/appXXXXXXX/tblXXXXXXX`,
    setupUrl: 'https://airtable.com/account/tokens',
    endpoints: [
      {
        method: 'GET',
        path: '/v0/{baseId}/{tableId}',
        description: 'List records',
        parameters: [
          { name: 'baseId', type: 'string', required: true, description: 'Your Airtable Base ID' },
          { name: 'tableId', type: 'string', required: true, description: 'Your Airtable Table ID' },
          { name: 'maxRecords', type: 'number', required: false, description: 'Max records to return' },
        ],
        responseExample: { 
          records: [
            { 
              id: 'rec1234',
              createdTime: '2024-01-01T00:00:00.000Z',
              fields: { Name: 'John', Email: 'john@example.com' }
            }
          ]
        },
      },
      {
        method: 'POST',
        path: '/v0/{baseId}/{tableId}',
        description: 'Create a new record',
        parameters: [
          { name: 'baseId', type: 'string', required: true, description: 'Your Airtable Base ID' },
          { name: 'tableId', type: 'string', required: true, description: 'Your Airtable Table ID' },
          { name: 'Name', type: 'string', required: true, description: 'Record name field' },
        ],
        responseExample: { 
          records: [
            { 
              id: 'rec5678',
              createdTime: '2024-01-01T00:00:00.000Z',
              fields: { Name: 'Jane' }
            }
          ]
        },
      },
    ],
  },
  {
    slug: 'slack-messaging',
    name: 'Slack Messaging',
    category: 'Communications',
    icon: '💬',
    featured: true,
    shortDescription: 'Send messages and manage Slack workspace',
    fullDescription:
      'Integrate with Slack to send messages to channels, manage users, create workflows, and automate team communications.',
    useCases: [
      'Send notifications to channels',
      'Create automated alerts',
      'Log events and updates',
      'Interact with users',
      'Build Slack bots and workflows',
    ],
    documentation: 'https://api.slack.com/docs',
    baseUrl: 'https://slack.com/api',
    authentication: 'OAuth Token (Bot Token or User Token)',
    allowUnauthenticated: false,
    rateLimit: '1 request/second typically',
    pricing: 'Free (limited), $8/user/month for pro',
    webhook: true,
    setupGuide: `To test Slack API in the playground:
1. Go to https://api.slack.com/apps
2. Create a new app or select existing
3. Go to OAuth Tokens & Scopes
4. Copy the Bot User OAuth Token (starts with xoxb-)
5. Paste it in the "API Key" field`,
    setupUrl: 'https://api.slack.com/apps',
    endpoints: [
      {
        method: 'POST',
        path: '/chat.postMessage',
        description: 'Send a message to a channel',
        parameters: [
          { name: 'channel', type: 'string', required: true, description: 'Channel ID or name (e.g., #general)' },
          { name: 'text', type: 'string', required: true, description: 'Message text' },
        ],
        responseExample: { 
          ok: true,
          channel: 'C024BE91L',
          ts: '1503435956.000247'
        },
      },
      {
        method: 'GET',
        path: '/users.list',
        description: 'List workspace users',
        parameters: [
          { name: 'limit', type: 'number', required: false, description: 'Number of results' },
        ],
        responseExample: { 
          ok: true,
          members: [
            { 
              id: 'U123456',
              name: 'john',
              real_name: 'John Doe',
              is_admin: false
            }
          ]
        },
      },
    ],
  },
];

module.exports = { apis };
