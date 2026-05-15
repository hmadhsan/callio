# Callio MCP Architecture & How It Works

## Overview

Callio's MCP (Model Context Protocol) integration gives AI agents (Claude, Cursor, Antigravity) access to 143+ APIs through three simple tools:
1. **`search_apis`** — Discover available APIs
2. **`get_api_info`** — Get endpoint details for a specific API
3. **`call_api`** — Execute requests through the Callio proxy

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AI Agent (Claude/Cursor)                      │
│                    Invokes MCP tools via stdio                        │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│           Callio MCP Server (Node.js subprocess)                    │
│                   @modelcontextprotocol/sdk                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Tool: search_apis(query?, category?)                        │   │
│  │ → Calls: GET https://callio.dev/api/browse                 │   │
│  │ ← Returns: List of APIs matching query/category             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Tool: get_api_info(slug)                                    │   │
│  │ → Calls: GET https://callio.dev/api/browse/{slug}          │   │
│  │ ← Returns: Full API spec, endpoints, auth requirements      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Tool: call_api(slug, path, method, body?, query?)           │   │
│  │ → Calls: https://callio.dev/api/proxy/{slug}/{path}         │   │
│  │ ← Returns: Response from upstream API                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Server maintains:                                                   │
│  - CALLIO_API_KEY (env var)                                          │
│  - CALLIO_BASE_URL (default: https://callio.dev)                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
           ┌──────────┐  ┌──────────────┐  ┌───────────┐
           │  Browse  │  │ API Details  │  │   Proxy   │
           │ Endpoint │  │  Endpoint    │  │ Endpoint  │
           └──────────┘  └──────────────┘  └───────────┘
                 │               │               │
                 ▼               ▼               ▼
         ┌──────────────────────────────────────────────┐
         │      Callio Next.js API Server               │
         │                                              │
         │  /api/browse          → Returns all APIs     │
         │  /api/browse/{slug}   → Returns API details  │
         │  /api/proxy/...       → Routes to upstream   │
         └──────────────────────────────────────────────┘
                 │
                 ▼
         ┌──────────────────────┐
         │   PostgreSQL DB      │
         │  (API catalog)       │
         └──────────────────────┘
                 │
         ┌───────┴───────┬───────────┬──────────────┐
         ▼               ▼           ▼              ▼
    OpenAI API    Stripe API   GitHub API    World Bank API
       (90+ more)
```

---

## How It Works: Step-by-Step

### **Scenario: Agent wants to search for a payment API**

```
Agent (in Cursor): "Search for payment APIs"
         │
         ▼
MCP Server receives: search_apis(query="payment")
         │
         ▼
1. MCP Server calls: GET https://callio.dev/api/browse
   Headers: { Authorization: Bearer callio_xxx }
         │
         ▼
2. Callio API Server queries PostgreSQL:
   SELECT * FROM Api WHERE 
   name ILIKE '%payment%' OR 
   category ILIKE '%payment%'
         │
         ▼
3. Returns: [
     {
       name: "Stripe",
       slug: "stripe",
       category: "Payments",
       shortDescription: "Process payments and manage billing",
       endpointsCount: 15,
       ...
     },
     {
       name: "PayPal",
       slug: "paypal",
       category: "Payments",
       ...
     }
   ]
         │
         ▼
4. MCP formats response:
   "Found 2 APIs:
    • Stripe (slug: stripe) [Payments] — Process payments... (15 endpoints)
    • PayPal (slug: paypal) [Payments] — PayPal payment... (8 endpoints)"
         │
         ▼
Agent receives results and can now ask for details
```

---

### **Scenario: Agent wants API details to understand what it can do**

```
Agent: "Show me the Stripe API endpoints"
         │
         ▼
MCP Server receives: get_api_info(slug="stripe")
         │
         ▼
1. MCP Server calls: GET https://callio.dev/api/browse/stripe
   Headers: { Authorization: Bearer callio_xxx }
         │
         ▼
2. Callio API Server queries PostgreSQL:
   SELECT * FROM Api WHERE slug='stripe'
   JOIN Endpoints e ON e.apiId = Api.id
         │
         ▼
3. Returns full API object with:
   {
     name: "Stripe",
     slug: "stripe",
     category: "Payments",
     fullDescription: "Stripe is a payment processing platform...",
     authentication: "API Key in header",
     rateLimit: "100 requests/second",
     endpoints: [
       {
         method: "POST",
         path: "/v1/charges",
         description: "Create a charge",
         parameters: [
           { name: "amount", type: "number", required: true },
           { name: "currency", type: "string", required: true }
         ]
       },
       ...
     ]
   }
         │
         ▼
4. MCP formats into readable markdown:
   "# Stripe
    Category: Payments
    Authentication: API Key in header
    Rate Limit: 100 requests/second
    
    ## Endpoints (15 total)
    
    ### POST /v1/charges
    Create a charge
    Parameters:
      - amount (number, required) — Amount in cents
      - currency (string, required) — 3-letter currency code
    ..."
         │
         ▼
Agent now knows exactly what Stripe can do
```

---

### **Scenario: Agent wants to actually call an API**

```
Agent: "Create a test charge of $10 in USD"
         │
         ▼
MCP Server receives: call_api(
  slug="stripe",
  path="/v1/charges",
  method="POST",
  body=JSON.stringify({
    amount: 1000,
    currency: "usd"
  })
)
         │
         ▼
1. MCP Server validates:
   - CALLIO_API_KEY is set ✓
   - JSON in body is valid ✓
         │
         ▼
2. MCP builds proxy URL:
   https://callio.dev/api/proxy/stripe/v1/charges
         │
         ▼
3. MCP makes request to Callio:
   POST https://callio.dev/api/proxy/stripe/v1/charges
   Headers: { 
     Authorization: Bearer callio_xxx,
     Content-Type: application/json 
   }
   Body: { amount: 1000, currency: "usd" }
         │
         ▼
4. Callio Proxy Route (/api/proxy/[slug]/[...path]) processes:
   
   a) Authenticate request:
      - Extract API key from Bearer token
      - Look up workspace & user
      - Check rate limits
   
   b) Get API definition (stripe):
      - Query: SELECT * FROM Api WHERE slug='stripe'
      - Get provider credentials from database (AES-256-GCM decrypted)
   
   c) Build upstream request:
      - Method: POST
      - URL: https://api.stripe.com/v1/charges
      - Headers: Add Stripe API key from provider creds
      - Body: { amount: 1000, currency: "usd" }
   
   d) Execute upstream call
         │
         ▼
5. Stripe API responds:
   {
     id: "ch_1234567890",
     object: "charge",
     amount: 1000,
     currency: "usd",
     status: "succeeded",
     ...
   }
         │
         ▼
6. Callio logs usage:
   - Insert into ApiCallLog:
     { 
       workspaceId, 
       userId, 
       apiId, 
       statusCode: 200, 
       timestamp 
     }
   - Increment workspace.requestsThisMonth
   - Check against plan limits
         │
         ▼
7. MCP receives response:
   HTTP 200 with JSON
         │
         ▼
8. MCP formats response:
   "POST stripe/v1/charges → 200
    
    {
      "id": "ch_1234567890",
      "amount": 1000,
      "currency": "usd",
      "status": "succeeded"
    }"
         │
         ▼
Agent sees the charge was created successfully
```

---

## Key Design Decisions

### **Why Three Tools?**
- **One tool per provider** would require hundreds of MCP tools and constant updates
- **Three generic tools** (discover → describe → execute) scales to any number of APIs
- Agent discovers what's available, understands each API, then calls it
- Works with any language model and MCP client

### **Why Proxy Through Callio?**
- **Unified Authentication**: One Callio key instead of managing 143+ API keys in Cursor/Claude
- **Usage Tracking**: Callio logs all calls for billing, analytics, abuse detection
- **Rate Limiting**: Per-workspace limits based on plan (free 500/mo, pro 50k/mo)
- **Provider Key Injection**: User saves OpenAI/Stripe key once on Callio; proxy injects it automatically
- **Security**: Provider keys never leave Callio system; agent can't see them
- **Observability**: See which APIs agents are calling, error patterns, latency

### **How Provider Keys Work**
```
Scenario: Agent wants to call OpenAI (requires API key)

1. User saves OpenAI key on https://callio.dev/dashboard → APIs → OpenAI
   - Key is AES-256-GCM encrypted at rest
   - Stored in database per-workspace

2. Agent calls: call_api(slug="openai", path="/v1/chat/completions", ...)

3. Callio proxy:
   a) Retrieves stored OpenAI key (decrypt from DB)
   b) Attaches it to upstream request header
   c) Sends to https://api.openai.com/v1/chat/completions
   d) Returns response to agent

Result: Agent never sees the key, but OpenAI request authenticates correctly
```

---

## MCP Server Code Structure

```javascript
// mcp-server/index.js

const CALLIO_API_KEY = process.env.CALLIO_API_KEY;
const CALLIO_BASE = process.env.CALLIO_BASE_URL || "https://callio.dev";

// Helper to call Callio backend
async function callioFetch(path, options = {}) {
  const url = `${CALLIO_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CALLIO_API_KEY}`,
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}

// Tool 1: Search APIs
server.tool("search_apis", ..., async ({ query, category }) => {
  const res = await callioFetch("/api/browse");
  let apis = await res.json();
  
  // Filter by query/category
  if (query) apis = apis.filter(a => a.name.includes(query));
  if (category) apis = apis.filter(a => a.category.includes(category));
  
  return formatted list of APIs
});

// Tool 2: Get API Info
server.tool("get_api_info", ..., async ({ slug }) => {
  const res = await callioFetch(`/api/browse/${slug}`);
  const api = await res.json();
  
  return formatted markdown with endpoints, auth, rate limits
});

// Tool 3: Call API
server.tool("call_api", ..., async ({ slug, path, method, body, query }) => {
  const url = `/api/proxy/${slug}/${path}${query ? `?${query}` : ""}`;
  const res = await callioFetch(url, { method, body });
  
  return response formatted with status code and body
});
```

---

## Deployment & Usage

### **Install MCP Server in Cursor/Claude:**

1. Create config (e.g., `~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "callio": {
      "command": "npx",
      "args": ["-y", "github:hmadhsan/callio-mcp"],
      "env": {
        "CALLIO_API_KEY": "callio_your_key_here"
      }
    }
  }
}
```

2. Restart Cursor/Claude

3. In Cursor Settings → MCP, confirm Callio shows green ✓

4. Start using:
   - "Search for weather APIs"
   - "Get details about OpenWeatherMap"
   - "Call the OpenWeatherMap API to get NYC weather"

### **Get API Key:**
1. Sign up at https://callio.dev/signup
2. Dashboard → Generate API Key
3. Copy and paste into MCP config

---

## Testing Results (May 12, 2026)

All three MCP tools verified working:

✅ **search_apis**: Returns 143 APIs from catalog
✅ **get_api_info**: Returns full endpoint specs (tested with JSONPlaceholder: 5 endpoints)
✅ **call_api**: Executes proxy calls (tested: GET /posts/1 returned valid JSON via proxy)
✅ **MCP SDK**: Installed and ready (@modelcontextprotocol/sdk@1.26.0)

---

## Why This Matters for Interviews

**This architecture demonstrates:**

1. **API Integration at Scale** — How to connect 143+ external services without managing 143 separate integrations
2. **Security** — Encrypting provider keys, never exposing them to client code
3. **Multi-tenancy** — Workspaces, rate limiting, usage tracking per customer
4. **Product Design** — Clean abstraction (search → describe → call) that scales
5. **MCP Understanding** — How standard protocols enable AI agents to use any capability
6. **Real-world Constraints** — Handling errors, truncating huge responses, validating JSON

This is exactly what Kombo, Dust, and similar platforms solve—making external integrations seamless for AI agents.

---

## Current Limitations & Future Improvements

- **Streaming responses**: Currently truncated at 50KB (could implement streaming)
- **Endpoint seeding**: Still done via multiple scripts (should be single DB table in admin UI)
- **Error messages**: Could be more helpful with specific troubleshooting steps
- **Auth discovery**: Could auto-detect and guide user through provider key setup
- **Rate limit headers**: Could pass upstream rate limit info back to agent
