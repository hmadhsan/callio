# Callio MCP Server

Give AI agents access to **90+ APIs** through one tool — powered by the [Model Context Protocol](https://modelcontextprotocol.io).

Works with **Claude Code**, **Cursor**, **Antigravity**, and any MCP-compatible AI tool.

## Quick Start

### 1. Get your Callio API key

1. Sign up at [callio.dev](https://callio.dev/signup)
2. Go to Dashboard → Generate API Key
3. Copy your `callio_...` key

### 2. Configure your AI tool

#### Claude Code

Add to your Claude Code MCP config (`~/.claude/claude_desktop_config.json`):

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

#### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json` in your project or global config):

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

#### Antigravity

Add to your Antigravity MCP configuration:

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

#### Any MCP Client

The server uses **stdio transport**. Run:

```bash
CALLIO_API_KEY=callio_xxx npx github:hmadhsan/callio-mcp
```

## Available Tools

### `search_apis`
Search and browse available APIs. Returns name, slug, category, description, and endpoint count.

**Parameters:**
- `query` (optional) — Search by name, category, or description
- `category` (optional) — Filter by category (e.g. "AI Search", "Email", "LLM")

### `get_api_info`
Get detailed info about a specific API, including all endpoints, parameters, and example responses.

**Parameters:**
- `slug` (required) — API slug from search results

### `call_api`
Call any API through the Callio proxy. Handles auth, rate limits, and routing automatically.

**Parameters:**
- `slug` (required) — API slug
- `path` (required) — Endpoint path (e.g. `/posts/1`)
- `method` (optional) — HTTP method (GET, POST, PUT, PATCH, DELETE)
- `body` (optional) — JSON request body
- `query` (optional) — Query string parameters

## Example Conversations

> **You:** "Search for email APIs"
> **Agent:** Uses `search_apis(query: "email")` → finds SendGrid, Snovio, etc.

> **You:** "What endpoints does JSONPlaceholder have?"
> **Agent:** Uses `get_api_info(slug: "jsonplaceholder")` → lists all 5 endpoints

> **You:** "Get post #1 from JSONPlaceholder"
> **Agent:** Uses `call_api(slug: "jsonplaceholder", path: "/posts/1", method: "GET")` → returns the post

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CALLIO_API_KEY` | Yes | Your Callio API key (`callio_...`) |
| `CALLIO_BASE_URL` | No | Override base URL (default: `https://callio.dev`) |

## License

MIT
