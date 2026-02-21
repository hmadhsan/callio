#!/usr/bin/env node

/**
 * Callio MCP Server
 * 
 * Gives AI agents (Claude Code, Cursor, Antigravity, etc.) access to 50+ APIs
 * through the Callio gateway using the Model Context Protocol.
 * 
 * Usage:
 *   CALLIO_API_KEY=callio_xxx npx @callio/mcp-server
 * 
 * Or configure in your AI tool's MCP settings.
 */

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const CALLIO_BASE = process.env.CALLIO_BASE_URL || "https://callio.dev";
const CALLIO_API_KEY = process.env.CALLIO_API_KEY || "";

// ── Helpers ──

async function callioFetch(path, options = {}) {
  const url = `${CALLIO_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(CALLIO_API_KEY ? { Authorization: `Bearer ${CALLIO_API_KEY}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  return res;
}

// ── Create Server ──

const server = new McpServer({
  name: "callio",
  version: "1.0.0",
});

// ── Tool: search_apis ──

server.tool(
  "search_apis",
  "Search and browse available APIs on Callio. Returns a list of APIs matching the query, or all APIs if no query provided. Use this to discover what APIs are available before calling them.",
  {
    query: z.string().optional().describe("Search query to filter APIs by name, category, or description. Leave empty to list all."),
    category: z.string().optional().describe("Filter by category (e.g. 'AI Search', 'Email', 'LLM', 'Web Search', 'Scrape', 'Payments')"),
  },
  async ({ query, category }) => {
    try {
      const res = await callioFetch("/api/browse");
      if (!res.ok) {
        return { content: [{ type: "text", text: `Error fetching APIs: ${res.status} ${res.statusText}` }] };
      }
      let apis = await res.json();

      // Filter by category
      if (category) {
        const cat = category.toLowerCase();
        apis = apis.filter((a) => a.category.toLowerCase().includes(cat));
      }

      // Filter by search query
      if (query) {
        const q = query.toLowerCase();
        apis = apis.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.shortDescription.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.slug.toLowerCase().includes(q)
        );
      }

      if (apis.length === 0) {
        return { content: [{ type: "text", text: "No APIs found matching your search." }] };
      }

      const lines = apis.map((a) => {
        const premium = a.allowUnauthenticated ? "Free" : "Pro";
        return `• ${a.name} (slug: ${a.slug}) [${a.category}] [${premium}] — ${a.shortDescription} (${a.endpointsCount} endpoints)`;
      });

      return {
        content: [{
          type: "text",
          text: `Found ${apis.length} APIs:\n\n${lines.join("\n")}`,
        }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  }
);

// ── Tool: get_api_info ──

server.tool(
  "get_api_info",
  "Get detailed information about a specific API, including all endpoints with their methods, paths, parameters, and example responses. Use the slug from search_apis results.",
  {
    slug: z.string().describe("The API slug (e.g. 'openai', 'stripe', 'tavily', 'jsonplaceholder')"),
  },
  async ({ slug }) => {
    try {
      const res = await callioFetch(`/api/browse/${slug}`);
      if (!res.ok) {
        return { content: [{ type: "text", text: `API '${slug}' not found. Use search_apis to find available APIs.` }] };
      }
      const api = await res.json();

      let text = `# ${api.name}\n`;
      text += `Slug: ${api.slug}\n`;
      text += `Category: ${api.category}\n`;
      text += `Description: ${api.shortDescription}\n`;
      text += `Full Description: ${api.fullDescription}\n\n`;
      text += `Authentication: ${api.authentication}\n`;
      text += `Rate Limit: ${api.rateLimit}\n`;
      text += `Pricing: ${api.pricing}\n`;

      if (api.useCases && api.useCases.length > 0) {
        text += `\nUse Cases: ${api.useCases.join(", ")}\n`;
      }

      if (api.endpoints && api.endpoints.length > 0) {
        text += `\n## Endpoints (${api.endpoints.length})\n\n`;
        for (const ep of api.endpoints) {
          text += `### ${ep.method} ${ep.path}\n`;
          text += `${ep.description}\n`;
          if (ep.parameters && ep.parameters.length > 0) {
            text += `Parameters:\n`;
            for (const p of ep.parameters) {
              text += `  - ${p.name} (${p.type}${p.required ? ", required" : ""}) — ${p.description}\n`;
            }
          }
          text += `\n`;
        }
      }

      text += `\n## How to Call\n`;
      text += `Use the call_api tool with slug="${api.slug}" and the endpoint path.\n`;
      text += `Example: call_api(slug="${api.slug}", path="${api.endpoints?.[0]?.path || "/example"}", method="${api.endpoints?.[0]?.method || "GET"}")\n`;

      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  }
);

// ── Tool: call_api ──

server.tool(
  "call_api",
  "Call any API through the Callio proxy. Requires a valid Callio API key. The request is routed through callio.dev/api/proxy/{slug}/{path} with automatic auth handling.",
  {
    slug: z.string().describe("The API slug (e.g. 'openai', 'jsonplaceholder', 'tavily')"),
    path: z.string().describe("The endpoint path (e.g. '/posts/1', '/search', '/v1/chat/completions')"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("GET").describe("HTTP method"),
    body: z.string().optional().describe("JSON request body (for POST/PUT/PATCH). Must be valid JSON string."),
    query: z.string().optional().describe("Query string parameters (e.g. 'q=hello&limit=10')"),
  },
  async ({ slug, path, method, body, query }) => {
    if (!CALLIO_API_KEY) {
      return {
        content: [{
          type: "text",
          text: "Error: No Callio API key configured. Set the CALLIO_API_KEY environment variable.\n\n" +
            "1. Sign up at https://callio.dev/signup\n" +
            "2. Go to Dashboard → Generate API Key\n" +
            "3. Set CALLIO_API_KEY=callio_your_key_here in your MCP config",
        }],
        isError: true,
      };
    }

    try {
      // Clean up path — ensure it starts with /
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      let url = `/api/proxy/${slug}/${cleanPath}`;
      if (query) {
        url += `?${query}`;
      }

      const fetchOptions = {
        method,
      };

      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        // Validate JSON
        try {
          JSON.parse(body);
        } catch {
          return {
            content: [{ type: "text", text: "Error: Invalid JSON in body parameter. Please provide valid JSON." }],
            isError: true,
          };
        }
        fetchOptions.body = body;
      }

      const res = await callioFetch(url, fetchOptions);
      const contentType = res.headers.get("content-type") || "";

      let responseText;
      if (contentType.includes("application/json")) {
        const json = await res.json();
        responseText = JSON.stringify(json, null, 2);
      } else {
        responseText = await res.text();
      }

      if (!res.ok) {
        return {
          content: [{
            type: "text",
            text: `API returned ${res.status} ${res.statusText}:\n\n${responseText}`,
          }],
          isError: true,
        };
      }

      // Truncate very large responses
      if (responseText.length > 50000) {
        responseText = responseText.slice(0, 50000) + "\n\n... (response truncated at 50KB)";
      }

      return {
        content: [{
          type: "text",
          text: `${method} ${slug}/${cleanPath} → ${res.status}\n\n${responseText}`,
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error calling API: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ── Start Server ──

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is now listening on stdin/stdout
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
