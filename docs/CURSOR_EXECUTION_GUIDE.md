# Cursor Execution Guide

Use this guide when part of the work is done in Cursor and part is done here.

## Setup in Cursor

1. Open this folder in Cursor:

   ```bash
   cursor .
   ```

2. Wait for codebase indexing after the application scaffold exists.

3. Keep these files open while working:

   - `ASSIGNMENT.md`
   - `RUBRIC.md`
   - `docs/WORK_PLAN.md`
   - `docs/REQUIREMENTS_MATRIX.md`

4. Use project rules in `.cursor/rules/*.mdc`. Cursor's current docs describe project rules as version-controlled files under `.cursor/rules` and commands as Markdown files under `.cursor/commands`.

## Operating Model

Use this split:

- Codex here: planning, architecture, high-risk observability integration, final review, docs consistency.
- Cursor: repetitive scaffolding, local component edits, small endpoint changes, rule/skill drafting.

Do not give Cursor one giant prompt for the whole assignment. Work in PRD-sized or phase-sized tasks.

## Cursor Guardrails

Paste this at the start of important Cursor chats:

```text
You are working on the Signal Lab assignment. Follow ASSIGNMENT.md, RUBRIC.md, and docs/WORK_PLAN.md.

Hard constraints:
- Do not replace the required stack.
- Frontend must use Next.js App Router, shadcn/ui, Tailwind, TanStack Query, React Hook Form.
- Backend must use NestJS, Prisma, PostgreSQL.
- Observability must include Prometheus, Grafana, Loki, and Sentry.
- Optimize ports for the top-level assignment walkthrough: UI at `localhost:3000`, backend at `localhost:3001`, Loki API at `localhost:3100`, Grafana under `localhost:3000/grafana`.
- Docker Compose must start the app stack in one command.
- Keep secrets out of git.
- Prefer small, reviewable changes.

Before editing, state which phase from docs/WORK_PLAN.md you are implementing and which files you expect to touch.
After editing, report exact files changed and verification commands.
```

## Phase Prompts

### PRD 001 Scaffold

```text
Implement Phase 1 from docs/WORK_PLAN.md and PRD 001.

Create the monorepo scaffold:
- apps/frontend: Next.js App Router, Tailwind, shadcn-ready UI structure
- apps/backend: NestJS with TypeScript strict, health endpoint, Swagger, placeholder scenarios endpoint
- prisma/schema.prisma with ScenarioRun model
- docker-compose.yml for frontend, backend, PostgreSQL
- .env.example

Do not add observability services yet except simple structured logging if it is natural.
Stop after the foundation runs and list verification commands.
```

### Scenario Domain

```text
Implement Phase 2 from docs/WORK_PLAN.md and PRD 002 F4.

Add real scenario execution for:
- success
- validation_error
- system_error
- slow_request
- teapot bonus

Persist every run in Prisma. Add a latest-runs endpoint for the frontend.
Keep errors clean through NestJS filters. Update Swagger DTOs.
Report files changed and how to verify with curl.
```

### Frontend

```text
Implement Phase 3 from docs/WORK_PLAN.md and PRD 002 F1-F3.

Build the Signal Lab UI:
- RHF scenario form
- TanStack useMutation for run scenario
- TanStack useQuery for latest 20 runs
- shadcn Button, Card, Input, Select, Badge, Toast
- loading and error states
- observability links block

Keep the UI work-focused and compact. Do not build a marketing landing page.
```

### Observability

```text
Implement Phase 4 from docs/WORK_PLAN.md and PRD 002 F5-F9.

Add:
- /metrics in Prometheus format
- scenario_runs_total
- scenario_run_duration_seconds
- http_requests_total
- JSON logs with scenarioType, scenarioId, duration, error
- Loki + Promtail
- Grafana datasource and dashboard provisioning
- Sentry SDK integration using SENTRY_DSN

Make the verification walkthrough pass with Loki on `localhost:3100` and Grafana reachable from `localhost:3000/grafana`. Report exact Grafana and Loki checks.
```

### Cursor AI Layer

```text
Implement Phase 5 from docs/WORK_PLAN.md and PRD 003/004.

Create:
- .cursor/rules/*.mdc for stack, observability, Prisma, frontend, error handling
- .cursor/skills/*/SKILL.md with frontmatter and When to Use sections
- .cursor/commands/add-endpoint.md
- .cursor/commands/check-obs.md
- .cursor/commands/run-prd.md
- hooks with clear purpose and current Cursor-compatible config
- marketplace skills explanation
- signal-lab-orchestrator skill with context.json, phases, resume, fast/default task split

Do not create generic boilerplate. Tie every artifact to this repository.
```

### Documentation

```text
Implement Phase 6 from docs/WORK_PLAN.md.

Update:
- README.md
- AI_LAYER.md
- SUBMISSION_CHECKLIST.md

The README must let an evaluator run, verify, and stop the project in 15 minutes.
Include exact URLs and expected observations for UI, metrics, Grafana, Loki, and Sentry.
```

## Checkpoints to Bring Back Here

After each phase, bring one of these back into this chat:

- `git diff --stat`
- failing command output
- `docker compose ps`
- `curl http://localhost:3001/api/health`
- `curl http://localhost:3001/metrics`
- screenshots of Grafana, Loki, or UI if visual verification is needed

## Sentry Note

Sentry verification needs a real DSN. Keep `.env.example` with a placeholder and use a local untracked `.env` for the real value.

For final submission, document:

- where `SENTRY_DSN` is configured
- how to trigger `system_error`
- what event name or message to find in Sentry

## Final Review Prompt

Use this in Cursor before submission:

```text
Review this repository against RUBRIC.md and SUBMISSION_CHECKLIST.md.

Prioritize findings that would reduce score:
- stack substitutions
- broken docker compose startup
- non-working observability walkthrough
- missing or generic Cursor AI layer artifacts
- missing orchestrator resume/context behavior
- incomplete README/checklist

Return findings with file paths and exact fixes. Do not make broad refactors.
```
