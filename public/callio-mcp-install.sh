#!/usr/bin/env bash
# Small installer to create a .cursor/mcp.json with your CALLIO_API_KEY
set -e

ROOT_DIR=$(pwd)
TARGET_DIR="$ROOT_DIR/.cursor"
TARGET_FILE="$TARGET_DIR/mcp.json"

read -p "Enter your CALLIO_API_KEY: " CALLIO_KEY

mkdir -p "$TARGET_DIR"
cat > "$TARGET_FILE" <<EOF
{
  "mcpServers": {
    "callio": {
      "command": "npx",
      "args": ["-y", "github:hmadhsan/callio-mcp"],
      "env": {
        "CALLIO_API_KEY": "$CALLIO_KEY",
        "CALLIO_BASE_URL": "https://callio.dev"
      }
    }
  }
}
EOF

echo "Wrote $TARGET_FILE. Start Cursor and it should detect the MCP server."
