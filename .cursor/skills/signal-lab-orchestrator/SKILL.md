---
name: signal-lab-orchestrator
description: Orchestrate Signal Lab PRD execution through analysis, planning, atomic decomposition, implementation, review, and reporting with persisted context and explicit fast/default task routing.
---

# Signal Lab Orchestrator

Coordinate PRD execution while minimizing context usage in the main chat.

## When to Use

- User says "implement PRD 00X" or "run phase X".
- Work must continue from partial progress after interruption.
- You need atomic tasks and explicit fast/default routing.

## Inputs

- `prdPath` (example: `prds/002_prd-observability-demo.md`)
- Optional target phase subset
- Optional existing execution directory in `.execution/`

## Execution State

1. Create execution folder:
   - `.execution/<timestamp>/`
2. Create or load:
   - `.execution/<timestamp>/context.json`
3. If context exists, **resume** from `currentPhase`. Do not rerun completed phases.

Reference template: [context.template.json](context.template.json)

## Required Phases

1. `analysis` (fast)
2. `codebase` (fast/explore)
3. `planning` (default)
4. `decomposition` (default)
5. `implementation` (fast for low complexity, default for medium/high)
6. `review` (fast readonly + targeted rework)
7. `report` (fast)

## Atomic Decomposition Rules

- Tasks target 5-10 minutes each.
- Every task includes:
  - `id`
  - `title`
  - `domain` (`database|backend|frontend|observability|ai-layer|docs`)
  - `complexity` (`low|medium|high`)
  - `model` (`fast|default`)
  - `status`
  - `dependsOn` list
  - `skill` when a project skill should be used
- Route 80%+ tasks to `fast` when complexity is low.

## Skill Routing

Use project skills for repo-specific work:

- Backend endpoints, DTOs, Swagger, Prisma write paths: `nest-endpoint-with-observability`.
- Metrics, structured logs, Loki, Grafana, Sentry checks: `signal-lab-observability`.
- Frontend forms, shadcn components, RHF, TanStack Query mutations: `shadcn-rhf-form`.
- Evaluator walkthrough and final manual verification: `signal-lab-demo-verifier`.

Use marketplace skills for generic support:

- Vercel plugin skills: `nextjs`, `shadcn`, `react-best-practices`, `verification`.
- Prisma plugin skills/rules: `prisma-cli-migrate-deploy`, `prisma-client-api-transactions`, `migration-best-practices`, `schema-conventions`.
- Sentry plugin skills: `sentry-nestjs-sdk`, `sentry-workflow`, `sentry-feature-setup`.

If a generic PRD example skill name is unavailable in Cursor Marketplace, do not invent it. Use the connected marketplace skill closest to the role and keep Signal Lab-specific details in project skills/rules.

## Delegation Policy

- Do not perform all work in a single monolithic prompt.
- Delegate phase outputs to small sub-tasks and update `context.json` after each completed task.
- Keep main-chat context small: write detailed task state into `.execution/<timestamp>/context.json`, then summarize only changed status and blockers in chat.
- On failure:
  - mark task `failed`
  - record failure reason
  - continue independent tasks

## Review Loop

Per domain:

1. run readonly review pass
2. if gaps found, create focused remediation tasks
3. retry at most 3 times per failed task chain
4. keep unresolved items in final report

## Final Report Output

Produce concise summary with:

- completed / failed / retried task counts
- phase statuses
- model usage split (`fast` vs `default`)
- exact remaining blockers
- next executable commands
