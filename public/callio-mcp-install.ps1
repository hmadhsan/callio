Param()
Write-Host "This script will create .cursor\mcp.json with your CALLIO_API_KEY"
$CALLIO_KEY = Read-Host "Enter your CALLIO_API_KEY"
$root = Get-Location
$targetDir = Join-Path $root ".cursor"
If (-Not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir | Out-Null }
$targetFile = Join-Path $targetDir "mcp.json"
$content = @"
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
"@

Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote $targetFile. Start Cursor and it should detect the MCP server."
