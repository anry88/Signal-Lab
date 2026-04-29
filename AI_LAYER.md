# Signal Lab AI Layer

This file explains how the Cursor layer is designed to keep this repository maintainable in new chats with minimal re-briefing.

## Goal

The AI layer is not a checklist artifact. It is a control system for three outcomes:

- preserve assignment stack and port constraints
- keep observability consistent when endpoints change
- make larger PRD execution resumable with low context overhead

## Rules (`.cursor/rules`)

Persistent guardrails:

- `stack-constraints.mdc`
  - locks required technologies and evaluator-facing URLs/ports (`3000`, `3001`, `3100`, `/grafana`)
- `observability-conventions.mdc`
  - standard metric names/labels and scenario JSON log fields
  - keeps Sentry DSN env-driven (`SENTRY_DSN`)
- `frontend-patterns.mdc`
  - enforces Next.js App Router + RHF + TanStack Query + shadcn usage patterns
- `prisma-patterns.mdc`
  - ensures Prisma-first data access and migration discipline
- `error-handling.mdc`
  - stabilizes backend error shape and frontend error-state UX

Why this matters:

- New agents do not accidentally drift away from rubric-critical constraints.
- Docs and implementation stay aligned through repeated edits.

## Custom Skills (`.cursor/skills`)

Project-scoped operational skills:

- `signal-lab-observability`
  - extend/review metrics, logs, Grafana/Loki wiring, and Sentry capture paths
- `nest-endpoint-with-observability`
  - endpoint implementation flow including DTO validation, Swagger, Prisma persistence, and instrumentation hooks
- `shadcn-rhf-form`
  - compact UI form construction using RHF + TanStack Query mutation/query patterns
- `signal-lab-demo-verifier`
  - 15-minute end-to-end verification script for evaluator walkthrough
- `signal-lab-orchestrator`
  - PRD execution framework with phased decomposition and persisted context

Why this matters:

- Marketplace skills are broad; these skills encode Signal Lab specifics (scenario types, exact metric contracts, walkthrough expectations).

## Commands (`.cursor/commands`)

Slash commands for recurring workflows:

- `/add-endpoint`
  - scaffold and verify a new backend endpoint with observability requirements
- `/check-obs`
  - run local checks for metrics, Loki, and Grafana health
- `/run-prd`
  - run a PRD using orchestrator logic and resume context

Why this matters:

- Converts common prompts into repeatable execution playbooks.

## Hooks (`.cursor/hooks`)

Configured in `.cursor/hooks.json` through `signal-lab-guard.sh` dispatcher:

- `block-secrets-commit.sh`
  - blocks secret-like staged content (DSNs, keys, credentials)
- `endpoint-observability-guard.sh`
  - warns when backend endpoint changes are missing metrics/log/Sentry markers

Why this matters:

- Prevents high-cost mistakes before they land in git.

## Marketplace Skills

Marketplace skills are documented in `.cursor/marketplace-skills.md` (Vercel, Prisma, and Sentry plugin ecosystems).

Role split:

- marketplace skills: framework/tool general expertise
- custom skills: Signal Lab project policy and assignment-specific conventions

Recent Sentry plugin coverage includes:

- `sentry-nestjs-sdk`
- `sentry-workflow` / `sentry-fix-issues`
- `sentry-create-alert`
- `sentry-feature-setup`

## Orchestrator Model

Orchestrator skill path:

- `.cursor/skills/signal-lab-orchestrator/SKILL.md`

Context persistence:

- `.execution/<run-id>/context.json`

Execution behavior:

- decomposes PRD work into scoped tasks
- marks low-complexity tasks for fast model routing
- supports resume without losing prior decisions

## New Chat Operating Flow

1. Read `ASSIGNMENT.md`, `RUBRIC.md`, `docs/WORK_PLAN.md`, and this file.
2. Apply rules automatically (stack + observability + error handling first).
3. Use targeted skills for backend/frontend edits instead of generic prompting.
4. Use `/check-obs` before claiming observability completion.
5. Use orchestrator for PRD-sized work and store progress in context.
6. Validate final deliverables against `SUBMISSION_CHECKLIST.md`.
