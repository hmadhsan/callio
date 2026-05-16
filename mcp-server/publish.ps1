Param(
    [switch]$Pack
)
$scriptRoot = $PSScriptRoot
Set-Location $scriptRoot

$cleanupConfig = $null
if ($env:NPM_TOKEN) {
    $cleanupConfig = Join-Path $env:TEMP ("callio-npmrc-{0}.tmp" -f ([guid]::NewGuid().ToString("N")))
    Set-Content -Path $cleanupConfig -Value ("//registry.npmjs.org/:_authToken={0}`n" -f $env:NPM_TOKEN) -Encoding UTF8
    $env:NPM_CONFIG_USERCONFIG = $cleanupConfig
    Write-Host "Using NPM_TOKEN from environment for npm commands."
}

Write-Host "Running quick checks for MCP server publishing in $scriptRoot..."
try {
    node --check index.js
    Write-Host "index.js syntax check passed"
} catch {
    Write-Error "index.js failed to load: $_"
    exit 2
}

try {
    $packageJson = Get-Content package.json -Raw | ConvertFrom-Json
    Write-Host "Package version: $($packageJson.version)"
} catch {
    Write-Host "Package version: (unable to read package.json version)"
}

if ($Pack) {
    Write-Host "Creating npm pack to verify contents..."
    npm pack
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm pack failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
    Write-Host "npm pack completed successfully."
} else {
    Write-Host "Skipping npm pack by default. Re-run with -Pack if you want a package dry run."
}

Write-Host "Publish steps (run manually):"
Write-Host "1) Bump version: npm version patch"
Write-Host "2) Push tags: git push && git push --tags"
if ($env:NPM_OTP) {
    Write-Host "3) Publish: npm publish --access public --otp <your-otp>"
    Write-Host "   Tip: pass the current OTP in NPM_OTP if npm prompts for 2FA."
} else {
    Write-Host "3) Publish: npm publish --access public"
    Write-Host "   If npm prompts for 2FA, re-run with NPM_OTP set to your current code."
}
Write-Host "4) (Optional) Create GitHub release: gh release create vX.Y.Z --notes-file RELEASE_NOTES.md"

Write-Host "Done. Run the commands above from your machine to publish."

if ($cleanupConfig -and (Test-Path $cleanupConfig)) {
    Remove-Item $cleanupConfig -Force
}
