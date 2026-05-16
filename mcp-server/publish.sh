#!/usr/bin/env bash
set -euo pipefail

# Publish helper for the mcp-server package.
# This script prepares a package and shows the commands to publish.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

cleanup_npmrc() {
	if [[ -n "${NPM_CONFIG_USERCONFIG:-}" && -f "${NPM_CONFIG_USERCONFIG:-}" ]]; then
		rm -f "$NPM_CONFIG_USERCONFIG"
	fi
}
trap cleanup_npmrc EXIT

if [[ -n "${NPM_TOKEN:-}" ]]; then
	NPM_CONFIG_USERCONFIG="$(mktemp "$SCRIPT_DIR/.npmrc.publish.XXXXXX")"
	printf "//registry.npmjs.org/:_authToken=%s\n" "$NPM_TOKEN" > "$NPM_CONFIG_USERCONFIG"
	export NPM_CONFIG_USERCONFIG
	echo "Using NPM_TOKEN from environment for npm commands."
fi

echo "Running quick checks in $SCRIPT_DIR..."
echo "1) lint / smoke run"
node --check index.js
echo "index.js syntax check passed"

echo "2) Show package version"
jq -r .version package.json

if [[ "${1:-}" == "--pack" ]]; then
	echo "Packing to verify contents (npm pack)"
	npm pack
	echo "npm pack completed successfully."
else
	echo "Skipping npm pack by default. Re-run with --pack if you want a package dry run."
fi

cat <<'INSTRUCTIONS'
Publish steps (run manually):

# 1) Bump version in package.json to the release version, e.g. 1.0.0 -> 1.0.1
npm version patch

# 2) Create a Git tag and push
git push && git push --tags

# 3) Publish to npm (requires you to be logged in via `npm login` or to provide NPM_TOKEN)
npm publish --access public
# If npm prompts for 2FA, set NPM_OTP=<current-code> and pass it interactively or rerun the command with --otp.

# 4) Create a GitHub Release (optional, using `gh` CLI):
# gh release create v1.0.1 --title "v1.0.1" --notes-file RELEASE_NOTES.md

INSTRUCTIONS

echo "Done. Please follow the instructions above to publish the package from your machine (requires npm credentials)."
