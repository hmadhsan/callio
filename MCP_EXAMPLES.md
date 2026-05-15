# Callio MCP - Practical Examples

## Real-World Usage Examples

### Example 1: Agent Searching for APIs

**User in Cursor:** 
```
"Find me APIs for checking weather"
```

**What Happens:**

1. Cursor invokes MCP tool:
```javascript
search_apis({
  query: "weather"
})
```

2. MCP Server calls Callio backend:
```
GET https://callio.dev/api/browse?query=weather
Authorization: Bearer callio_live_xxx
```

3. Callio API Server:
```sql
SELECT * FROM Api 
WHERE name ILIKE '%weather%' 
   OR shortDescription ILIKE '%weather%'
   OR category ILIKE '%weather%'
LIMIT 50
```

4. Response (truncated):
```javascript
[
  {
    id: 42,
    name: "OpenWeatherMap",
    slug: "openweathermap",
    category: "Weather",
    shortDescription: "Real-time weather data and forecasts",
    endpointsCount: 3,
    authentication: "API Key in query param",
    rateLimit: "1000 calls/day (free tier)",
    fullDescription: "OpenWeatherMap provides current weather, forecasts...",
    allowUnauthenticated: false,
    useCases: ["Weather forecasts", "Air quality", "Severe weather alerts"]
  },
  {
    id: 43,
    name: "Open-Meteo",
    slug: "open-meteo",
    category: "Weather",
    shortDescription: "Free weather API without API key required",
    endpointsCount: 2,
    authentication: "None (public)",
    rateLimit: "10,000 calls/day",
    allowUnauthenticated: true,
    useCases: ["Weather forecasts", "Historical weather", "Air quality"]
  }
]
```

5. MCP formats for agent:
```
Found 2 APIs:

• OpenWeatherMap (slug: openweathermap) [Weather] 
  Real-time weather data and forecasts (3 endpoints)

• Open-Meteo (slug: open-meteo) [Weather] 
  Free weather API without API key required (2 endpoints)
```

6. Agent sees results in Cursor and decides to use one

---

### Example 2: Agent Getting Full API Details

**User in Cursor:**
```
"Show me all the endpoints for OpenWeatherMap"
```

**What Happens:**

1. Cursor invokes MCP tool:
```javascript
get_api_info({
  slug: "openweathermap"
})
```

2. MCP Server calls Callio backend:
```
GET https://callio.dev/api/browse/openweathermap
Authorization: Bearer callio_live_xxx
```

3. Callio API Server:
```sql
SELECT a.*, e.* FROM Api a
LEFT JOIN Endpoint e ON e.apiId = a.id
WHERE a.slug = 'openweathermap'
```

4. Response with full details:
```javascript
{
  id: 42,
  name: "OpenWeatherMap",
  slug: "openweathermap",
  category: "Weather",
  shortDescription: "Real-time weather data and forecasts",
  fullDescription: "OpenWeatherMap is the world's largest weather data and API provider. Get current weather, forecasts, alerts, and climate data.",
  authentication: "API Key in query parameter (api_key=...)",
  rateLimit: "1000 calls/day (free), 60 calls/minute",
  pricing: "Free (1000/day), Professional plans available",
  website: "https://openweathermap.org",
  documentation: "https://openweathermap.org/api",
  
  endpoints: [
    {
      id: 421,
      method: "GET",
      path: "/data/2.5/weather",
      description: "Current weather data for a location",
      parameters: [
        {
          name: "q",
          type: "string",
          required: true,
          description: "City name or coordinates (e.g., 'London' or '35.09,-106.61')"
        },
        {
          name: "units",
          type: "string",
          required: false,
          description: "metric (Celsius), imperial (Fahrenheit), standard (Kelvin)"
        },
        {
          name: "lang",
          type: "string",
          required: false,
          description: "Language code (en, de, fr, etc.)"
        }
      ],
      exampleResponse: {
        coord: { lon: -106.61, lat: 35.09 },
        weather: [{ id: 500, main: "Rain", description: "light rain" }],
        main: { temp: 15.2, feels_like: 14.8, humidity: 72 },
        wind: { speed: 4.1 },
        clouds: { all: 90 },
        dt: 1714990800
      }
    },
    {
      id: 422,
      method: "GET",
      path: "/data/2.5/forecast",
      description: "5-day weather forecast",
      parameters: [
        {
          name: "q",
          type: "string",
          required: true,
          description: "City name"
        }
      ]
    },
    {
      id: 423,
      method: "GET",
      path: "/data/2.5/air_pollution",
      description: "Air quality data"
    }
  ]
}
```

5. MCP formats as markdown:
```markdown
# OpenWeatherMap

**Slug:** openweathermap  
**Category:** Weather  

**Description:**  
OpenWeatherMap is the world's largest weather data and API provider. 
Get current weather, forecasts, alerts, and climate data.

**Authentication:**  
API Key in query parameter (api_key=...)

**Rate Limit:**  
1000 calls/day (free), 60 calls/minute

**Pricing:**  
Free (1000/day), Professional plans available

**Website:** https://openweathermap.org  
**Docs:** https://openweathermap.org/api

## Endpoints (3 total)

### GET /data/2.5/weather
Current weather data for a location

**Parameters:**
- q (string, required) — City name or coordinates (e.g., 'London' or '35.09,-106.61')
- units (string, optional) — metric (Celsius), imperial (Fahrenheit), standard (Kelvin)
- lang (string, optional) — Language code (en, de, fr, etc.)

**Example Response:**
```json
{
  "coord": {"lon": -106.61, "lat": 35.09},
  "weather": [{"id": 500, "main": "Rain"}],
  "main": {"temp": 15.2, "humidity": 72},
  "wind": {"speed": 4.1}
}
```

### GET /data/2.5/forecast
5-day weather forecast

### GET /data/2.5/air_pollution
Air quality data
```

6. Agent now has all the info needed to make the call

---

### Example 3: Agent Actually Calling an API

**User in Cursor:**
```
"Get the current weather in New York City"
```

**What Happens:**

1. Cursor invokes MCP tool:
```javascript
call_api({
  slug: "openweathermap",
  path: "/data/2.5/weather",
  method: "GET",
  query: "q=New York&units=imperial"
})
```

2. MCP Server builds the request:
```javascript
const url = "/api/proxy/openweathermap/data/2.5/weather?q=New York&units=imperial";

const response = await callioFetch(url, {
  method: "GET",
  headers: {
    Authorization: "Bearer callio_live_xxx"
  }
});
```

3. HTTP Request to Callio:
```
GET /api/proxy/openweathermap/data/2.5/weather?q=New York&units=imperial
Host: callio.dev
Authorization: Bearer callio_live_xxx
Content-Type: application/json
```

4. Callio Proxy Route processes:

   **Step A: Authenticate the request**
   ```javascript
   const key = headers.authorization.replace("Bearer ", "");
   const user = await prisma.apiKey.findUnique({
     where: { key },
     include: { workspace: true }
   });
   
   // Result:
   // user.workspaceId = "ws_123"
   // user.workspace.tier = "pro"  // allows 50,000 req/month
   // user.workspace.requestsThisMonth = 12,543
   ```

   **Step B: Check rate limit**
   ```javascript
   const PLANS = {
     free: 500,
     builder: 10000,
     pro: 50000,
     enterprise: 250000
   };
   
   if (user.workspace.requestsThisMonth >= PLANS[user.workspace.tier]) {
     return { status: 429, body: "Rate limit exceeded" };
   }
   // ✓ Within limit
   ```

   **Step C: Get API definition**
   ```javascript
   const api = await prisma.api.findUnique({
     where: { slug: "openweathermap" }
   });
   
   // Result:
   // api.name = "OpenWeatherMap"
   // api.upstreamBaseUrl = "https://api.openweathermap.org"
   // api.requiresProviderKey = true
   // api.providerKeyName = "API Key"
   ```

   **Step D: Retrieve provider credentials**
   ```javascript
   const cred = await prisma.providerCredential.findUnique({
     where: {
       workspaceId_apiId: {
         workspaceId: user.workspaceId,
         apiId: api.id
       }
     }
   });
   
   // Decrypt from DB (stored as AES-256-GCM)
   const decrypted = decrypt(cred.encryptedKey, process.env.ENCRYPTION_KEY);
   // decrypted = "sk_live_abc123xyz..."
   ```

   **Step E: Build upstream request**
   ```javascript
   const upstreamUrl = new URL(
     "https://api.openweathermap.org/data/2.5/weather"
   );
   upstreamUrl.searchParams.set("q", "New York");
   upstreamUrl.searchParams.set("units", "imperial");
   upstreamUrl.searchParams.set("appid", decrypted); // Add the key!
   
   const upstreamResponse = await fetch(upstreamUrl.toString());
   ```

   **Step F: Log the usage**
   ```javascript
   await prisma.apiCallLog.create({
     data: {
       workspaceId: user.workspaceId,
       userId: user.id,
       apiId: api.id,
       statusCode: upstreamResponse.status,
       timestamp: new Date(),
       executionTimeMs: 234
     }
   });
   
   // Increment request counter
   await prisma.workspace.update({
     where: { id: user.workspaceId },
     data: { requestsThisMonth: { increment: 1 } }
   });
   ```

   **Step G: Return response**
   ```javascript
   return {
     status: 200,
     headers: upstreamResponse.headers,
     body: await upstreamResponse.json()
   };
   ```

5. OpenWeatherMap API responds:
```json
{
  "coord": {"lon": -74.006, "lat": 40.7143},
  "weather": [
    {"id": 803, "main": "Clouds", "description": "broken clouds"}
  ],
  "main": {
    "temp": 62.5,
    "feels_like": 60.1,
    "temp_min": 57.2,
    "temp_max": 67.3,
    "pressure": 1013,
    "humidity": 65
  },
  "wind": {"speed": 8.5, "deg": 230},
  "clouds": {"all": 75},
  "dt": 1714990800,
  "sys": {
    "country": "US",
    "sunrise": 1714949280,
    "sunset": 1715003100
  },
  "name": "New York",
  "cod": 200
}
```

6. MCP receives response and formats:
```
GET openweathermap/data/2.5/weather?q=New%20York&units=imperial → 200

{
  "coord": {"lon": -74.006, "lat": 40.7143},
  "weather": [{"id": 803, "main": "Clouds", "description": "broken clouds"}],
  "main": {
    "temp": 62.5,
    "feels_like": 60.1,
    "humidity": 65
  },
  "wind": {"speed": 8.5},
  "name": "New York"
}
```

7. Agent in Cursor sees:
```
✓ Current weather in New York: 62.5°F, Broken clouds, 65% humidity
```

---

## Error Handling Examples

### Error: No API Key Configured

**User calls:**
```javascript
call_api({
  slug: "stripe",
  path: "/v1/charges",
  method: "POST",
  body: JSON.stringify({ amount: 1000, currency: "usd" })
})
```

**Response:**
```
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Error: No Callio API key configured. Set the CALLIO_API_KEY environment variable.\n\n1. Sign up at https://callio.dev/signup\n2. Go to Dashboard → Generate API Key\n3. Set CALLIO_API_KEY=callio_your_key_here in your MCP config"
  }]
}
```

---

### Error: API Not Found

**User calls:**
```javascript
get_api_info({
  slug: "nonexistent-api"
})
```

**Response:**
```
API 'nonexistent-api' not found. Use search_apis to find available APIs.
```

---

### Error: Invalid JSON Body

**User calls:**
```javascript
call_api({
  slug: "stripe",
  path: "/v1/charges",
  method: "POST",
  body: "{ invalid json }"  // Missing quotes on keys
})
```

**Response:**
```
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Error: Invalid JSON in body parameter. Please provide valid JSON."
  }]
}
```

---

### Error: Rate Limited

**Scenario:** User's workspace has hit monthly limit

**Response:**
```
{
  "isError": true,
  "status": 429,
  "content": [{
    "type": "text",
    "text": "Rate limit exceeded. You've used 50,000 requests this month (your plan limit). Upgrade your plan or wait until next month."
  }]
}
```

---

## Performance Notes

### Latency Breakdown (typical call)

```
User types → Cursor sends to MCP (local, <1ms)
                    ↓
MCP Server (Node process on user's machine) → Callio API (network, ~100ms)
                    ↓
Callio authenticates, checks limits (DB query, ~10ms)
                    ↓
Callio fetches provider credentials, decrypts (crypto, ~5ms)
                    ↓
Callio calls OpenWeatherMap (network, ~200ms)
                    ↓
Callio logs usage to DB (~15ms)
                    ↓
Response back to MCP (network, ~100ms)
                    ↓
MCP formats and sends to Claude (local, <1ms)
                    ↓
Claude receives and displays (~50ms)

TOTAL: ~480ms (mostly network + upstream API latency)
```

### Response Size Limits

- MCP limits responses to 50KB (truncated with `... (response truncated at 50KB)`)
- This prevents massive API responses from overwhelming the context window
- Future improvement: Stream large responses instead of truncating

---

## Summary

The three-tool design is powerful because it:

1. **Scales to 143+ APIs** without code changes
2. **Provides discovery** (search) so agents know what's available
3. **Enables understanding** (details) so agents know what parameters to use
4. **Allows execution** (call) so agents can actually use the APIs
5. **Maintains security** (encrypted keys, no exposure to agent)
6. **Tracks usage** (logging, rate limiting, billing)

This is why Dust, Kombo, and similar platforms exist—solving the "how do AI agents securely use external services at scale?" problem.
