Release notes & publish checklist for Callio MCP server

What this package provides
- `@hmadhsan/mcp` — a tiny MCP server that proxies model calls to Callio's API gateway.

Pre-publish checklist
1. Ensure package.json `version` is set appropriately (update semantic version).
2. Ensure `repository.url` points to the final repo and `homepage` is correct.
3. Run tests locally: `node index.js` and smoke-check tools in `mcp-server`.
4. Build (if needed) and run `npm pack` to verify package contents.
5. Create a GitHub Release with the same version tag and release notes.
6. Publish to npm (or GitHub Packages): `npm publish --access public` (requires npm credentials).

After publishing
- Update `public/callio-cursor-mcp.json` to point to the published package if you prefer `npx callio-mcp` or `npx -y @hmadhsan/mcp`.

Notes
- Publishing requires coordination; I will prepare the manifest and release notes, but you must run the `npm publish` step with your account.
