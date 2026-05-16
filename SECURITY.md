# Callio Security Overview

This repository contains an initial, self-attested security statement for the Callio project. It is intended to provide transparency about the controls we maintain and to serve as the basis for audits or customer inquiries.

Key points:
- Secrets and production credentials are stored in environment variables and should never be committed.
- Access to production systems is limited to authorized personnel with MFA enabled.
- Provider credentials are encrypted at rest using AES-256-GCM.
- We perform automated dependency scanning and vulnerability monitoring.

If you need a formal SOC 2 / ISO 27001 / HIPAA attestation, contact the Callio team at hello@callio.dev.

---

This is a living document. See `docs/compliance/controls.md` for a control matrix and evidence locations.
