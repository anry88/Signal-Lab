---
name: signal-lab-demo-verifier
description: Verify the Signal Lab 15-minute evaluator walkthrough across UI, backend health, Prometheus metrics, Loki logs, Grafana dashboard, Sentry behavior, and Cursor AI-layer artifacts.
---

# Signal Lab Demo Verifier

Use this skill before submission or after observability/UI changes.

## When to Use

- The user asks whether Signal Lab is ready to submit.
- Docker Compose, observability, or scenario behavior changed.
- You need to produce evaluator-facing verification notes for README or `SUBMISSION_CHECKLIST.md`.

## Verification Flow

1. Start from a clean stack:
   - `docker compose down --remove-orphans`
   - `docker compose up -d`
   - `docker compose ps`

2. Backend checks:
   - `curl -sS http://localhost:3001/api/health`
   - `curl -sS http://localhost:3001/metrics`
   - confirm `scenario_runs_total`, `scenario_run_duration_seconds`, and `http_requests_total`.

3. Scenario checks:
   - run `success`, `validation_error`, `system_error`, `slow_request`, and `teapot`.
   - confirm run history shows persisted rows and expected statuses.

4. Observability checks:
   - Loki labels: `curl -sS http://localhost:3100/loki/api/v1/labels`
   - Loki query: `{app="signal-lab"}`
   - Grafana: `http://localhost:3000/grafana`
   - Sentry: configure real `SENTRY_DSN`, trigger `system_error`, then confirm captured exception.

5. Cursor AI-layer checks:
   - `.cursor/rules` has scoped stack, frontend, Prisma, observability, and error rules.
   - `.cursor/skills` has project skills with `SKILL.md` frontmatter and When to Use sections.
   - `.cursor/commands` has `/add-endpoint`, `/check-obs`, and `/run-prd`.
   - `.cursor/hooks.json` points at a real dispatcher hook.
   - marketplace skills are documented and connected or explicitly listed as required Cursor Marketplace setup.

## Report Format

Return:

- passed checks
- failed checks
- exact failing command/output
- files that need changes
- whether the 15-minute evaluator walkthrough is ready
