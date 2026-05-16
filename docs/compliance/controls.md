# Callio - Minimal Controls Matrix (Self-Attestation)

Controls and status:

- Secrets management: Partially implemented — `.env` removed from tracking; rotate secrets.
- MFA for org accounts: Recommended — enable for all admins.
- Branch protection: Implemented — enable required reviews on `main`.
- Dependency scanning: In progress — enable Dependabot and weekly `npm audit`.
- Encryption in transit: Implemented — TLS everywhere.
- Encryption at rest: Implemented — DB/provider encryption; provider keys encrypted via AES-256-GCM.
- Logging & monitoring: Partially implemented — Vercel and Supabase logs available; retention policy TBD.
- Incident response: Draft — add `docs/incident-response.md`.

Next steps:

1. Remove secrets from git history and rotate keys.
2. Enable 2FA for all org users.
3. Enable Dependabot + schedule weekly scans.
4. Create a short incident response playbook and evidence collection locations.
