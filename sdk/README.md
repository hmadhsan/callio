# Callio SDK

The official Node.js SDK for Callio — the API Gateway for AI Agents.

## Installation

```bash
npm install callio-sdk
```

## Quick Start

```typescript
import CallioClient from 'callio-sdk';

const client = new CallioClient(process.env.CALLIO_API_KEY);

// Make a GET request through the Callio proxy
const response = await client.get('cat-facts', '/random');
const data = await response.json();
console.log(data.fact);
```

## Configuration

### Initialize with custom base URL

```typescript
const client = new CallioClient(
  process.env.CALLIO_API_KEY,
  'https://api.callio.dev/proxy'  // Custom base URL
);
```

The SDK automatically:
- Strips trailing slashes from base URLs
- Normalizes path slashes
- Adds `Authorization: Bearer {apiKey}` header
- Sets `Content-Type: application/json` for POST/PUT/PATCH requests

## API Methods

### `get(apiSlug, path, options?)`

Make a GET request to an API through Callio.

```typescript
const response = await client.get('jsonplaceholder', '/posts/1');
const post = await response.json();
```

### `post(apiSlug, path, body?, options?)`

Make a POST request with a JSON body.

```typescript
const response = await client.post('jsonplaceholder', '/posts', {
  title: 'New Post',
  body: 'Post content',
  userId: 1
});
const newPost = await response.json();
```

### `put(apiSlug, path, body?, options?)`

Make a PUT request to update a resource.

```typescript
const response = await client.put('jsonplaceholder', '/posts/1', {
  title: 'Updated Title',
  body: 'Updated content',
  userId: 1
});
const updatedPost = await response.json();
```

### `delete(apiSlug, path, options?)`

Make a DELETE request.

```typescript
const response = await client.delete('jsonplaceholder', '/posts/1');
```

### `request(apiSlug, path, options?)`

Make a raw request with full control over options.

```typescript
const response = await client.request('jsonplaceholder', '/posts', {
  method: 'PATCH',
  headers: { 'X-Custom-Header': 'value' },
  body: JSON.stringify({ title: 'Patched' })
});
```

## Error Handling

All methods return a standard `Response` object. Check the status code to handle errors:

```typescript
try {
  const response = await client.get('cat-facts', '/random');

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data.fact);
} catch (error) {
  console.error('Request failed:', error);
}
```

## Common Error Codes

- `401` - Missing or invalid API key
- `403` - Forbidden (API key doesn't have access to this endpoint)
- `404` - API or endpoint not found
- `429` - Rate limit exceeded
- `5xx` - Callio proxy or upstream API error

## Examples

See `examples.ts` for comprehensive examples including:
- Fetching cat facts
- Creating and updating posts
- Batch operations with retries
- Custom headers

Run examples:

```bash
npm run build
node dist/examples.js
```

## Testing

Run the test suite:

```bash
npm test
```

Run specific tests:

```bash
npm test -- --testNamePattern="GET requests"
```

## Environment Variables

- `CALLIO_API_KEY` - Your Callio API key (required)
- `CALLIO_BASE_URL` - Override default base URL (optional, default: `https://callio.dev/api/proxy`)

## Response Format

All methods return a standard Fetch API `Response` object:

```typescript
const response = await client.get('api-slug', '/endpoint');

// Check status
console.log(response.status);      // 200
console.log(response.statusText);  // "OK"

// Parse response
const json = await response.json();
const text = await response.text();

// Access headers
console.log(response.headers.get('content-type'));
```

## How it Works

The SDK is a lightweight wrapper around the Callio proxy gateway. Each request:

1. Adds your API key as a Bearer token
2. Routes through `https://callio.dev/api/proxy/{apiSlug}/{path}`
3. Callio handles authentication, rate limiting, and error handling
4. Returns the upstream API's response

This means you get unified error handling, usage tracking, and credential management without managing individual API keys.

## License

MIT
