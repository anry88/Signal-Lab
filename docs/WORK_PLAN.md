# Signal Lab Work Plan

## Current State

The repository currently contains only the assignment package:

- `ASSIGNMENT.md`
- `RUBRIC.md`
- `SUBMISSION_CHECKLIST.md`
- `prds/001_prd-platform-foundation.md`
- `prds/002_prd-observability-demo.md`
- `prds/003_prd-cursor-ai-layer.md`
- `prds/004_prd-orchestrator.md`

There is no application scaffold yet. The implementation starts from an empty project.

## Target Outcome

Build a working Signal Lab observability playground plus a Cursor AI layer. The solution should be checkable in 15 minutes after:

```bash
docker compose up -d
```

Primary target: 80+ rubric points.

Secondary target: include the optional `teapot` scenario for the hidden +5 bonus.

## Architectural Decisions

- Use a TypeScript monorepo with `apps/frontend`, `apps/backend`, and root-level `prisma`.
- Use Next.js App Router for the frontend.
- Use NestJS for the backend and expose all API routes under `/api`.
- Use PostgreSQL 16 plus Prisma for persistence.
- Use `prom-client` for Prometheus metrics.
- Use structured JSON logs and ship container logs to Loki through Promtail.
- Use Grafana provisioning for datasources and dashboards so the demo works after compose startup.
- Use Sentry through `SENTRY_DSN`. Keep secrets out of git; document how to provide a real DSN for demo.
- Keep ports aligned with the assignment:
  - frontend: `http://localhost:3000`
  - backend: `http://localhost:3001`
  - PostgreSQL: `localhost:5432`
  - Loki API: `http://localhost:3100`
  - Grafana dashboard: `http://localhost:3000/grafana`
- Note: PRD 002 mentions Grafana at `localhost:3100`, but the top-level assignment's verification flow uses `localhost:3100` for Loki and `localhost:3000/grafana` for Grafana. Optimize for the top-level verification flow. Configure Grafana with `GF_SERVER_SERVE_FROM_SUB_PATH=true` and proxy `/grafana` through the frontend or a lightweight reverse proxy.

## Target File Tree

```text
signal-lab/
  apps/
    backend/
      src/
        main.ts
        app.module.ts
        health/
        scenarios/
        observability/
        prisma/
      Dockerfile
      package.json
      tsconfig.json
    frontend/
      app/
      components/
      lib/
      Dockerfile
      package.json
      tailwind.config.ts
  prisma/
    schema.prisma
    migrations/
  observability/
    prometheus/prometheus.yml
    loki/loki-config.yml
    promtail/promtail-config.yml
    grafana/
      provisioning/
        datasources/datasources.yml
        dashboards/dashboards.yml
      dashboards/signal-lab.json
  .cursor/
    rules/*.mdc
    skills/*/SKILL.md
    commands/*.md
    hooks/
    marketplace-skills.md
  docker-compose.yml
  .env.example
  README.md
  AI_LAYER.md
  SUBMISSION_CHECKLIST.md
```

## Implementation Phases

### Phase 0 - Repository Hygiene

Estimated time: 15-30 minutes.

Deliverables:

- `.gitignore`
- package manager decision and root workspace files
- `.env.example`
- initial README skeleton

Done when:

- repository has predictable project structure
- no generated or local-only files are tracked
- environment variables are listed without real secrets

### Phase 1 - Platform Foundation

Estimated time: 90-120 minutes.

Deliverables:

- Next.js frontend in `apps/frontend`
- NestJS backend in `apps/backend`
- root Prisma schema and initial migration
- Docker Compose with frontend, backend, and PostgreSQL
- backend health endpoint `GET /api/health`
- Swagger at `/api/docs`
- placeholder scenario endpoint `POST /api/scenarios/run`

Done when:

- `docker compose up -d` starts frontend, backend, and PostgreSQL
- `curl http://localhost:3001/api/health` returns 200
- frontend opens on `http://localhost:3000`
- Prisma migration can be applied predictably

### Phase 2 - Scenario Domain

Estimated time: 60-90 minutes.

Deliverables:

- `ScenarioRun` Prisma model exactly aligned with PRD 001
- DTO validation for scenario run requests
- scenario service logic for:
  - `success`
  - `validation_error`
  - `system_error`
  - `slow_request`
  - optional bonus `teapot`
- endpoint for latest 20 runs, for example `GET /api/scenarios/runs`
- global exception filter returning clean errors

Done when:

- all required scenario types are persisted
- UI can fetch run history
- Swagger shows scenario endpoints and DTOs

### Phase 3 - Frontend Experience

Estimated time: 60-90 minutes.

Deliverables:

- React Hook Form scenario form
- TanStack Query `useMutation` for running scenarios
- TanStack Query `useQuery` for latest runs
- shadcn/ui `Button`, `Card`, `Input`, plus useful `Select`, `Badge`, and `Toast`
- run history with status badges
- observability links block

Done when:

- a user can run scenarios without reading source code
- success and error states are visible
- history refreshes after mutation and/or on interval

### Phase 4 - Observability Stack

Estimated time: 120-180 minutes.

Deliverables:

- Prometheus endpoint `GET /metrics`
- metrics:
  - `scenario_runs_total{type,status}`
  - `scenario_run_duration_seconds{type}`
  - `http_requests_total{method,path,status_code}`
- structured JSON backend logs with scenario fields
- Loki plus Promtail in Docker Compose
- Grafana provisioning for Prometheus and Loki datasources
- Grafana dashboard with at least 3 meaningful panels
- Sentry SDK integration for `system_error`

Done when:

- `curl http://localhost:3001/metrics` shows scenario metrics
- Grafana dashboard has real data after running scenarios
- Grafana Explore can query Loki logs by `{app="signal-lab"}`
- Sentry captures `system_error` when a real DSN is configured

### Phase 5 - Cursor AI Layer

Estimated time: 90-150 minutes.

Deliverables:

- At least 5 project rules in `.cursor/rules/*.mdc`:
  - stack constraints
  - observability conventions
  - Prisma patterns
  - frontend patterns
  - error handling
- At least 3 custom skills in `.cursor/skills/`, including:
  - `signal-lab-observability`
  - `nest-endpoint-with-observability`
  - `shadcn-rhf-form`
- At least 3 commands in `.cursor/commands/`:
  - `add-endpoint.md`
  - `check-obs.md`
  - `run-prd.md`
- At least 2 hooks with documented purpose:
  - schema change reminder
  - endpoint observability guard
- Marketplace skills explanation for at least 6 relevant skills.
- Orchestrator skill in `.cursor/skills/signal-lab-orchestrator/`.

Done when:

- a fresh Cursor chat can understand the stack and continue work
- commands are actionable prompts, not decorative files
- hooks catch real failure modes
- orchestrator has phases, `context.json`, resume behavior, and fast/default task marking

### Phase 6 - Documentation and Submission

Estimated time: 60-90 minutes.

Deliverables:

- complete `README.md`
- `AI_LAYER.md`
- completed `SUBMISSION_CHECKLIST.md`
- verification walkthrough
- optional screenshots:
  - UI
  - Grafana dashboard
  - Loki logs
  - Sentry error

Done when:

- the evaluator can run and verify the project in 15 minutes
- every rubric item has a concrete file path and manual check
- known gaps are honestly documented

## Risk Register

| Risk | Impact | Mitigation |
|---|---:|---|
| Docker Compose becomes slow or flaky | High | Bring up foundation first, then add observability services one by one. |
| Sentry cannot be verified without real DSN | Medium | Keep integration complete, document DSN setup, and avoid committing secrets. |
| Loki labels are missing or logs are not queryable | High | Standardize JSON logs and Promtail labels early. Verify through Grafana Explore. |
| AI layer becomes formal files only | High | Tie every rule, command, hook, and skill to an actual workflow in this repo. |
| Orchestrator overpromises real automation | Medium | Implement it as a practical Cursor skill with persisted context and explicit handoff prompts. |

## Recommended Execution Order

1. Build and verify PRD 001.
2. Implement scenario domain and frontend.
3. Add Prometheus metrics before Loki and Grafana.
4. Add structured logs and Loki.
5. Add Grafana provisioning.
6. Add Sentry integration.
7. Build Cursor AI layer from decisions already made in code.
8. Fill docs and checklist last, using real paths and verification output.

## Final Verification Script

Use this as the final manual pass before submission:

```bash
docker compose down --remove-orphans
docker compose up -d
docker compose ps
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics
```

Then verify in browser:

1. `http://localhost:3000`
2. run `success`
3. run `system_error`
4. open `http://localhost:3100` or query Loki through Grafana Explore
5. open `http://localhost:3000/grafana`
6. inspect dashboard panels and Loki query `{app="signal-lab"}`
7. check Sentry project for captured exception
