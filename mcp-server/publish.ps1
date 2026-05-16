Param()
Write-Host "Running quick checks for MCP server publishing..."
try {
    node -e "require('./index'); console.log('index.js loaded OK')"
} catch {
    Write-Error "index.js failed to load: $_"
    exit 2
}

$pkg = Get-Content package.json | ConvertFrom-Json
Write-Host "Package version: $($pkg.version)"

Write-Host "Creating npm pack to verify contents..."
npm pack

Write-Host "Publish steps (run manually):"
Write-Host "1) Bump version: npm version patch"
Write-Host "2) Push tags: git push && git push --tags"
Write-Host "3) Publish: npm publish --access public (requires npm login)"
Write-Host "4) (Optional) Create GitHub release: gh release create vX.Y.Z --notes-file RELEASE_NOTES.md"

Write-Host "Done. Run the commands above from your machine to publish."
