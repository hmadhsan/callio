# Callio MCP - Code Flow & Implementation Details

## Complete Code Flow: From Agent to Upstream API

### File Structure

```
Callio Project
├── mcp-server/
│   ├── index.js                    ← MCP Server (runs on user's machine)
│   └── package.json
│
└── src/
    ├── app/api/
    │   ├── browse/
    │   │   ├── route.ts            ← GET /api/browse (list APIs)
    │   │   └── [slug]/route.ts     ← GET /api/browse/{slug} (API details)
    │   │
    │   └── proxy/
    │       └── [apiSlug]/[...path]/route.ts  ← Proxy handler (the magic!)
    │
    └── lib/
        └── proxy-executor.ts       ← Shared proxy logic
```

---

## 1. MCP Server (`mcp-server/index.js`)

### Startup

```javascript
#!/usr/bin/env node

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

// Load environment
const CALLIO_BASE = process.env.CALLIO_BASE_URL || "https://callio.dev";
const CALLIO_API_KEY = process.env.CALLIO_API_KEY || "";

// Create server
const server = new McpServer({
  name: "callio",
  version: "1.0.0",
});

// Connect to stdio (communicates with Cursor/Claude)
const transport = new StdioServerTransport();
await server.connect(transport);
```

**What this does:**
- Creates an MCP server instance
- Connects it to stdio (the communication pipe to Cursor/Claude)
- Registers the three tools
- Listens for tool calls from the AI agent

---

### Tool 1: `search_apis`

```javascript
server.tool(
  "search_apis",
  "Search and browse available APIs on Callio...",
  {
    query: z.string().optional().describe("Search query..."),
    category: z.string().optional().describe("Filter by category..."),
  },
  async ({ query, category }) => {
    try {
      // 1. Call Callio's browse endpoint
      const res = await callioFetch("/api/browse");
      if (!res.ok) {
        return error(`Error fetching APIs: ${res.status}`);
      }

      // 2. Parse response
      let apis = await res.json();
      
      // 3. Filter by category if provided
      if (category) {
        const catLower = category.toLowerCase();
        apis = apis.filter(a => 
          a.category.toLowerCase().includes(catLower)
        );
      }

      // 4. Filter by query if provided
      if (query) {
        const qLower = query.toLowerCase();
        apis = apis.filter(a =>
          a.name.toLowerCase().includes(qLower) ||
          a.shortDescription.toLowerCase().includes(qLower) ||
          a.category.toLowerCase().includes(qLower) ||
          a.slug.toLowerCase().includes(qLower)
        );
      }

      // 5. Format response for agent
      if (apis.length === 0) {
        return { content: [{ type: "text", text: "No APIs found" }] };
      }

      const lines = apis.map(a => 
        `• ${a.name} (slug: ${a.slug}) [${a.category}] — ` +
        `${a.shortDescription} (${a.endpointsCount} endpoints)`
      );

      return {
        content: [{
          type: "text",
          text: `Found ${apis.length} APIs:\n\n${lines.join("\n")}`
        }]
      };

    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  }
);
```

**Flow:**
```
Agent: "search_apis(query='weather')"
       ↓
MCP calls: callioFetch("/api/browse")
       ↓
HTTP GET https://callio.dev/api/browse
Authorization: Bearer callio_live_xxx
       ↓
Callio returns JSON array of all 143 APIs
       ↓
MCP filters: keep only APIs with 'weather' in name/description
       ↓
Format as readable list
       ↓
Return to agent
```

---

### Tool 2: `get_api_info`

```javascript
server.tool(
  "get_api_info",
  "Get detailed information about a specific API...",
  {
    slug: z.string().describe("The API slug (e.g., 'openai')"),
  },
  async ({ slug }) => {
    try {
      // 1. Call Callio's API detail endpoint
      const res = await callioFetch(`/api/browse/${slug}`);
      if (!res.ok) {
        return { 
          content: [{ 
            type: "text", 
            text: `API '${slug}' not found. Use search_apis...` 
          }] 
        };
      }

      // 2. Parse the API object
      const api = await res.json();

      // 3. Build markdown documentation
      let text = `# ${api.name}\n`;
      text += `Slug: ${api.slug}\n`;
      text += `Category: ${api.category}\n`;
      text += `Description: ${api.shortDescription}\n`;
      text += `Full Description: ${api.fullDescription}\n\n`;
      text += `Authentication: ${api.authentication}\n`;
      text += `Rate Limit: ${api.rateLimit}\n`;
      text += `Pricing: ${api.pricing}\n`;

      // 4. Add use cases if available
      if (api.useCases && api.useCases.length > 0) {
        text += `\nUse Cases: ${api.useCases.join(", ")}\n`;
      }

      // 5. Document all endpoints
      if (api.endpoints && api.endpoints.length > 0) {
        text += `\n## Endpoints (${api.endpoints.length})\n\n`;
        
        for (const ep of api.endpoints) {
          text += `### ${ep.method} ${ep.path}\n`;
          text += `${ep.description}\n`;
          
          // Document parameters
          if (ep.parameters && ep.parameters.length > 0) {
            text += `Parameters:\n`;
            for (const p of ep.parameters) {
              const required = p.required ? ", required" : "";
              text += `  - ${p.name} (${p.type}${required}) — ${p.description}\n`;
            }
          }
          text += `\n`;
        }
      }

      // 6. Add usage instructions
      text += `\n## How to Call\n`;
      text += `Use the call_api tool with:\n`;
      text += `  slug="${api.slug}"\n`;
      text += `  path="${api.endpoints?.[0]?.path || '/example'}"\n`;
      text += `  method="${api.endpoints?.[0]?.method || 'GET'}"\n`;

      return { content: [{ type: "text", text }] };

    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  }
);
```

**Flow:**
```
Agent: "get_api_info(slug='openai')"
       ↓
MCP calls: callioFetch("/api/browse/openai")
       ↓
HTTP GET https://callio.dev/api/browse/openai
Authorization: Bearer callio_live_xxx
       ↓
Callio returns:
  {
    name: "OpenAI",
    slug: "openai",
    endpoints: [
      { method: "POST", path: "/v1/chat/completions", ... },
      { method: "POST", path: "/v1/embeddings", ... },
      ...
    ],
    ...
  }
       ↓
MCP formats into markdown documentation
       ↓
Return full details to agent
```

---

### Tool 3: `call_api` (The Execution Tool)

```javascript
server.tool(
  "call_api",
  "Call any API through the Callio proxy...",
  {
    slug: z.string().describe("The API slug (e.g., 'openai')"),
    path: z.string().describe("The endpoint path (e.g., '/v1/chat/completions')"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("GET"),
    body: z.string().optional().describe("JSON request body..."),
    query: z.string().optional().describe("Query string parameters..."),
  },
  async ({ slug, path, method, body, query }) => {
    
    // 1. Validate API key is configured
    if (!CALLIO_API_KEY) {
      return {
        content: [{
          type: "text",
          text: "Error: No Callio API key configured.\n\n" +
                "1. Sign up at https://callio.dev/signup\n" +
                "2. Go to Dashboard → Generate API Key\n" +
                "3. Set CALLIO_API_KEY=callio_your_key_here in your MCP config"
        }],
        isError: true
      };
    }

    try {
      // 2. Normalize path (ensure starts with /)
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      
      // 3. Build proxy URL
      let url = `/api/proxy/${slug}/${cleanPath}`;
      if (query) {
        url += `?${query}`;
      }

      // 4. Prepare fetch options
      const fetchOptions = { method };

      // 5. Validate and add body if provided
      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        try {
          JSON.parse(body);  // Validate JSON
        } catch {
          return {
            content: [{
              type: "text",
              text: "Error: Invalid JSON in body. Please provide valid JSON."
            }],
            isError: true
          };
        }
        fetchOptions.body = body;
      }

      // 6. Call Callio proxy
      const res = await callioFetch(url, fetchOptions);
      const contentType = res.headers.get("content-type") || "";

      // 7. Parse response (JSON or text)
      let responseText;
      if (contentType.includes("application/json")) {
        const json = await res.json();
        responseText = JSON.stringify(json, null, 2);
      } else {
        responseText = await res.text();
      }

      // 8. Check for errors
      if (!res.ok) {
        return {
          content: [{
            type: "text",
            text: `API returned ${res.status} ${res.statusText}:\n\n${responseText}`
          }],
          isError: true
        };
      }

      // 9. Truncate very large responses
      if (responseText.length > 50000) {
        responseText = responseText.slice(0, 50000) + 
                      "\n\n... (response truncated at 50KB)";
      }

      // 10. Return formatted response
      return {
        content: [{
          type: "text",
          text: `${method} ${slug}/${cleanPath} → ${res.status}\n\n${responseText}`
        }]
      };

    } catch (err) {
      return {
        content: [{
          type: "text",
          text: `Error calling API: ${err.message}`
        }],
        isError: true
      };
    }
  }
);
```

**Flow:**
```
Agent: "call_api(slug='openai', path='/v1/chat/completions', 
                  method='POST', body='{...}')"
       ↓
MCP validates:
  ✓ CALLIO_API_KEY is set
  ✓ JSON body is valid
  ✓ HTTP method is valid
       ↓
MCP builds URL: /api/proxy/openai/v1/chat/completions
       ↓
MCP calls: callioFetch(url, { method: "POST", body: "..." })
       ↓
HTTP POST https://callio.dev/api/proxy/openai/v1/chat/completions
Authorization: Bearer callio_live_xxx
Content-Type: application/json
Body: { model: "gpt-4", messages: [...] }
       ↓
[Goes to Callio's proxy handler...]
```

---

## 2. Callio's Browse Endpoints

### `src/app/api/browse/route.ts` - List All APIs

```typescript
export async function GET(req: Request) {
  try {
    // 1. Query all APIs from database
    const apis = await prisma.api.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        authentication: true,
        rateLimit: true,
        pricing: true,
        allowUnauthenticated: true,
        useCases: true,
        _count: {
          select: { endpoints: true }  // Count endpoints
        }
      },
      orderBy: { name: "asc" }
    });

    // 2. Map to response format
    const response = apis.map(api => ({
      id: api.id,
      name: api.name,
      slug: api.slug,
      category: api.category,
      shortDescription: api.shortDescription,
      fullDescription: api.fullDescription,
      authentication: api.authentication,
      rateLimit: api.rateLimit,
      pricing: api.pricing,
      allowUnauthenticated: api.allowUnauthenticated,
      useCases: api.useCases,
      endpointsCount: api._count.endpoints
    }));

    // 3. Return as JSON
    return Response.json(response);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
```

**Database Query:**
```sql
SELECT 
  id, name, slug, category, shortDescription, 
  fullDescription, authentication, rateLimit, pricing,
  allowUnauthenticated, useCases,
  (SELECT COUNT(*) FROM Endpoint WHERE apiId = Api.id) as endpointsCount
FROM Api
ORDER BY name ASC
```

---

### `src/app/api/browse/[slug]/route.ts` - Get API Details

```typescript
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // 1. Query API and its endpoints from database
    const api = await prisma.api.findUnique({
      where: { slug },
      include: {
        endpoints: {
          select: {
            method: true,
            path: true,
            description: true,
            parameters: true,
            exampleResponse: true
          },
          orderBy: { path: "asc" }
        }
      }
    });

    // 2. Handle not found
    if (!api) {
      return Response.json(
        { error: `API '${slug}' not found` },
        { status: 404 }
      );
    }

    // 3. Return full API with endpoints
    return Response.json({
      id: api.id,
      name: api.name,
      slug: api.slug,
      category: api.category,
      shortDescription: api.shortDescription,
      fullDescription: api.fullDescription,
      authentication: api.authentication,
      rateLimit: api.rateLimit,
      pricing: api.pricing,
      website: api.website,
      documentation: api.documentation,
      useCases: api.useCases,
      endpoints: api.endpoints  // Full endpoint details
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
```

**Database Query:**
```sql
SELECT 
  Api.*,
  Endpoint.method, Endpoint.path, Endpoint.description,
  Endpoint.parameters, Endpoint.exampleResponse
FROM Api
LEFT JOIN Endpoint ON Endpoint.apiId = Api.id
WHERE Api.slug = $1
ORDER BY Endpoint.path ASC
```

---

## 3. Callio's Proxy Handler (The Core)

### `src/app/api/proxy/[apiSlug]/[...path]/route.ts`

This is where the magic happens. Every API call flows through here.

```typescript
export async function POST(req: Request, { params }: RouteParams) {
  const { apiSlug } = params;
  const path = params.path.join("/");

  try {
    // ═══════════════════════════════════════════════════════════
    // STEP 1: AUTHENTICATE THE REQUEST
    // ═══════════════════════════════════════════════════════════
    
    // Extract Bearer token or session cookie
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lookup API key
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: token },
      include: { workspace: true, user: true }
    });

    if (!apiKey) {
      return Response.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const workspace = apiKey.workspace;

    // ═══════════════════════════════════════════════════════════
    // STEP 2: CHECK RATE LIMITS
    // ═══════════════════════════════════════════════════════════

    const PLANS = {
      free: 500,
      builder: 10000,
      pro: 50000,
      enterprise: 250000
    };

    const monthlyLimit = PLANS[workspace.tier];
    
    if (workspace.requestsThisMonth >= monthlyLimit) {
      return Response.json(
        { 
          error: `Rate limit exceeded. You've used ${workspace.requestsThisMonth} ` +
                 `requests this month (limit: ${monthlyLimit})`,
          retryAfter: daysUntilNextMonth()
        },
        { status: 429 }
      );
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 3: GET API DEFINITION FROM DATABASE
    // ═══════════════════════════════════════════════════════════

    const api = await prisma.api.findUnique({
      where: { slug: apiSlug }
    });

    if (!api) {
      return Response.json(
        { error: `API '${apiSlug}' not found` },
        { status: 404 }
      );
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 4: GET PROVIDER CREDENTIALS (if needed)
    // ═══════════════════════════════════════════════════════════

    let providerKey = null;

    // Some APIs need provider-supplied keys (OpenAI, Stripe, etc.)
    if (api.requiresProviderKey) {
      const credential = await prisma.providerCredential.findUnique({
        where: {
          workspaceId_apiId: {
            workspaceId: workspace.id,
            apiId: api.id
          }
        }
      });

      if (!credential) {
        return Response.json(
          { 
            error: `You haven't configured your ${api.name} API key yet. ` +
                   `Visit https://callio.dev/dashboard/${api.slug} to add it.`
          },
          { status: 403 }
        );
      }

      // Decrypt the key from database (it's stored encrypted)
      providerKey = decrypt(
        credential.encryptedKey,
        process.env.ENCRYPTION_KEY
      );
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 5: BUILD UPSTREAM REQUEST
    // ═══════════════════════════════════════════════════════════

    // Get request body if provided
    const requestBody = req.method !== "GET" ? await req.json() : null;

    // Build upstream URL
    const upstreamUrl = new URL(
      `${api.upstreamBaseUrl}/${path}`,
      api.upstreamBaseUrl
    );

    // Add query string parameters if provided
    const { searchParams } = new URL(req.url);
    for (const [key, value] of searchParams) {
      upstreamUrl.searchParams.set(key, value);
    }

    // Build headers for upstream request
    const upstreamHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add provider authentication if needed
    if (providerKey) {
      // Different APIs use different auth methods
      switch (api.authMethod) {
        case "bearer":
          upstreamHeaders["Authorization"] = `Bearer ${providerKey}`;
          break;
        case "api-key":
          upstreamHeaders["X-API-Key"] = providerKey;
          break;
        case "query-param":
          upstreamUrl.searchParams.set("api_key", providerKey);
          break;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 6: EXECUTE UPSTREAM REQUEST
    // ═══════════════════════════════════════════════════════════

    const startTime = Date.now();

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers: upstreamHeaders,
      body: requestBody ? JSON.stringify(requestBody) : undefined
    });

    const executionTimeMs = Date.now() - startTime;

    // ═══════════════════════════════════════════════════════════
    // STEP 7: LOG THE USAGE
    // ═══════════════════════════════════════════════════════════

    await prisma.apiCallLog.create({
      data: {
        workspaceId: workspace.id,
        userId: apiKey.userId,
        apiId: api.id,
        path: `/${apiSlug}/${path}`,
        method: req.method,
        statusCode: upstreamResponse.status,
        executionTimeMs,
        requestBodySize: requestBody ? JSON.stringify(requestBody).length : 0,
        responseBodySize: 0,  // Will be updated after we read response
        timestamp: new Date()
      }
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 8: INCREMENT REQUEST COUNTER
    // ═══════════════════════════════════════════════════════════

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        requestsThisMonth: {
          increment: 1
        }
      }
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 9: RETURN RESPONSE TO CLIENT
    // ═══════════════════════════════════════════════════════════

    // Get response body
    const responseText = await upstreamResponse.text();

    // Return with Callio headers for debugging
    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: {
        ...Object.fromEntries(upstreamResponse.headers),
        "X-Callio-Proxy": "true",
        "X-Callio-API": apiSlug,
        "X-Callio-Execution-Time": `${executionTimeMs}ms`,
        "X-Callio-Upstream-Status": `${upstreamResponse.status}`
      }
    });

  } catch (err) {
    // Log unexpected errors
    console.error("Proxy error:", err);

    return Response.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
```

---

## Data Model

```prisma
model Api {
  id                 String   @id @default(cuid())
  slug               String   @unique
  name               String
  category           String
  shortDescription   String
  fullDescription    String
  authentication     String
  rateLimit          String
  pricing            String
  website            String?
  documentation      String?
  useCases           String[]
  allowUnauthenticated Boolean @default(false)
  requiresProviderKey Boolean @default(false)
  authMethod         String   // "bearer", "api-key", "query-param"
  upstreamBaseUrl    String
  
  endpoints          Endpoint[]
  providerCredentials ProviderCredential[]
  callLogs           ApiCallLog[]
}

model Endpoint {
  id          String  @id @default(cuid())
  apiId       String
  method      String  // GET, POST, etc.
  path        String
  description String
  parameters  Json    // Array of {name, type, required, description}
  exampleResponse Json?
  
  api         Api     @relation(fields: [apiId], references: [id])
}

model ProviderCredential {
  id           String @id @default(cuid())
  workspaceId  String
  apiId        String
  encryptedKey String // AES-256-GCM encrypted
  
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  api          Api       @relation(fields: [apiId], references: [id])
  
  @@unique([workspaceId, apiId])
}

model ApiCallLog {
  id               String   @id @default(cuid())
  workspaceId      String
  userId           String
  apiId            String
  path             String
  method           String
  statusCode       Int
  executionTimeMs  Int
  requestBodySize  Int
  responseBodySize Int
  timestamp        DateTime @default(now())
  
  workspace        Workspace @relation(fields: [workspaceId], references: [id])
  user             User      @relation(fields: [userId], references: [id])
  api              Api       @relation(fields: [apiId], references: [id])
}

model Workspace {
  id                  String   @id @default(cuid())
  tier                String   @default("free") // free, builder, pro, enterprise
  requestsThisMonth   Int      @default(0)
  
  providerCredentials ProviderCredential[]
  callLogs            ApiCallLog[]
}
```

---

## Summary: The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User in Cursor: "Search for weather APIs"                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Cursor sends tool call via stdio to MCP Server               │
│    search_apis(query="weather")                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. MCP Server (on user's machine) calls:                        │
│    GET https://callio.dev/api/browse                            │
│    Authorization: Bearer callio_live_xxx                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Callio Server (Vercel) handles:                              │
│    - GET /api/browse route                                      │
│    - Query PostgreSQL: SELECT * FROM Api                        │
│    - Return 143 APIs as JSON                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. MCP filters response: keep only "weather" APIs               │
│    - Open-Meteo                                                 │
│    - OpenWeatherMap                                             │
│    - WeatherAPI                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. MCP sends formatted response back to Cursor via stdio        │
│    "Found 3 weather APIs:"                                      │
│    "• Open-Meteo (slug: open-meteo) [Weather] ..."             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Claude/Agent in Cursor chooses one and asks:                 │
│    "Get the full details for Open-Meteo"                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Cursor sends:                                                 │
│    get_api_info(slug="open-meteo")                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. MCP calls:                                                    │
│    GET https://callio.dev/api/browse/open-meteo                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. Callio queries:                                             │
│     SELECT * FROM Api WHERE slug='open-meteo'                   │
│     SELECT * FROM Endpoint WHERE apiId=...                      │
│     Returns full API object with all endpoints                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. MCP formats as markdown documentation and returns            │
│     Full API spec with all endpoint details                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. Agent sees documentation and asks:                          │
│     "Get weather forecast for NYC"                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. Cursor sends:                                                │
│     call_api(slug="open-meteo", path="/v1/forecast",           │
│              query="latitude=40.7128&longitude=-74.0060")       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 14. MCP builds and sends:                                        │
│     GET /api/proxy/open-meteo/v1/forecast?latitude=...          │
│     Authorization: Bearer callio_live_xxx                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 15. Callio Proxy Handler (THE CORE):                            │
│     a) Authenticate request → lookup workspace                  │
│     b) Check rate limits → 3/50000 requests used ✓              │
│     c) Get API definition → Open-Meteo                          │
│     d) No provider key needed (it's free!) ✓                    │
│     e) Build upstream URL → https://api.open-meteo.com/...     │
│     f) Execute → fetch to Open-Meteo API                        │
│     g) Log usage → INSERT into ApiCallLog                       │
│     h) Increment counter → workspace.requestsThisMonth = 4      │
│     i) Return response with Callio headers                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 16. Open-Meteo API responds with weather data                   │
│     {                                                            │
│       "latitude": 40.7128,                                       │
│       "hourly": { "time": [...], "temperature_2m": [...] }     │
│     }                                                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 17. Callio returns response to MCP Server                        │
│     Status 200 with JSON weather data                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 18. MCP formats and sends back to Cursor                         │
│     GET open-meteo/v1/forecast → 200                           │
│     { "latitude": 40.7128, ... }                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 19. Agent processes weather data and responds:                  │
│     "The forecast for NYC shows sunny skies tomorrow..."        │
└─────────────────────────────────────────────────────────────────┘
```

That's the complete flow from a user's question to a real API response, all orchestrated by the MCP integration!
