#!/usr/bin/env bash
set -euo pipefail

# Publish helper for the mcp-server package.
# This script prepares a package and shows the commands to publish.

echo "Running quick checks..."
echo "1) lint / smoke run"
node -e "try{require('./index'); console.log('index.js loaded OK')}catch(e){console.error('index.js failed:', e); process.exit(2)}"

echo "2) Show package version"
jq -r .version package.json

echo "Packing to verify contents (npm pack)"
npm pack

cat <<'INSTRUCTIONS'
Publish steps (run manually):

# 1) Bump version in package.json to the release version, e.g. 1.0.0 -> 1.0.1
npm version patch

# 2) Create a Git tag and push
git push && git push --tags

# 3) Publish to npm (requires you to be logged in via `npm login`)
npm publish --access public

# 4) Create a GitHub Release (optional, using `gh` CLI):
# gh release create v1.0.1 --title "v1.0.1" --notes-file RELEASE_NOTES.md

INSTRUCTIONS

echo "Done. Please follow the instructions above to publish the package from your machine (requires npm credentials)."
