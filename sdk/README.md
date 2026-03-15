# callio-sdk

The official Node.js SDK for Callio — the API Gateway for AI Agents.

Callio gives you a single API key to access 90+ APIs (Search, Payments, Data, Messaging, AI, etc.) without managing individual credentials, rate limits, or auth flows.

## Installation

```bash
npm install callio-sdk
# or
yarn add callio-sdk
# or
pnpm add callio-sdk
```

## Quick Start

```typescript
import { CallioClient } from 'callio-sdk';

// Initialize with your Callio API key (from your dashboard)
const callio = new CallioClient('callio_your_api_key_here');

async function main() {
  // Call ANY API through the Callio proxy
  // Example: Getting a dummy post from jsonplaceholder
  const res = await callio.get('jsonplaceholder', 'posts/1');
  const data = await res.json();
  console.log(data);
  
  // Example: Sending an email with SendGrid
  /*
  await callio.post('sendgrid', 'v3/mail/send', {
    personalizations: [{ to: [{ email: 'user@example.com' }] }],
    from: { email: 'hello@callio.dev' },
    subject: 'Hello from Callio',
    content: [{ type: 'text/plain', value: 'This was routed through Callio!' }]
  });
  */
}

main();
```

## How it works

The SDK is a lightweight wrapper around the `https://callio.dev/api/proxy/{apiSlug}` endpoint. It automatically attaches your `Authorization: Bearer callio_...` token and forwards the request methods and body to the correct API provider based on the `apiSlug`.

For a full list of available APIs and their slugs, visit [callio.dev/browse](https://callio.dev/browse).
