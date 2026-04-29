# Signal Lab

Signal Lab is a small observability playground for scenario execution.
You run scenarios from the UI and verify resulting signals in Prometheus metrics, Grafana panels, Loki logs, and Sentry errors.

## Stack (required and used)

- Frontend: Next.js App Router + Tailwind + shadcn/ui + TanStack Query + React Hook Form
- Backend: NestJS + Prisma + PostgreSQL
- Observability: Prometheus + Grafana + Loki + Sentry
- Infra: Docker Compose (single command startup)

## 15-Minute Evaluator Walkthrough

### 0) Prerequisites

- Docker + Docker Compose available
- Ports free:
  - `3000` (UI + Grafana subpath)
  - `3001` (backend)
  - `3100` (Loki API)
  - `5432` (PostgreSQL)
- Optional for full Sentry check: real `SENTRY_DSN` in `.env` (never commit secrets)

### 1) Run everything (single command)

```bash
docker compose up -d
```

Optional readiness check:

```bash
docker compose ps
```

Cold-start readiness check (recommended on clean machines):

```bash
for i in {1..30}; do
  curl -fsS http://localhost:3001/api/health && break
  sleep 2
done
```

Expected observation:

- Services are up: `postgres`, `backend`, `frontend`, `prometheus`, `loki`, `promtail`, `grafana`.
- First startup can take 1-3 minutes while dependencies install and migrations run.

### 2) Verify backend/API quickly

```bash
curl -sS http://localhost:3001/api/health
```

Expected observation:

- JSON health response with HTTP `200`.

Open Swagger:

- <http://localhost:3001/api/docs>

Expected observation:

- Scenario endpoints documented, including `POST /api/scenarios/run` and `GET /api/scenarios/runs`.

### 3) Open UI and run scenarios

Open:

- <http://localhost:3000>

Expected observation:

- `Run scenario` form, `Run history`, and `Observability links` cards.

Run these scenario types from the UI form:

1. `success`
2. `slow_request`
3. `system_error`

Expected observation:

- Success/failed toast feedback appears.
- New rows appear in run history with status badges and durations.

### 4) Verify Prometheus metrics endpoint

Open:

- <http://localhost:3001/metrics>

Or use:

```bash
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"
```

Expected observation:

- Metric families are present:
  - `scenario_runs_total{type,status}`
  - `scenario_run_duration_seconds{type}`
  - `http_requests_total{method,path,status_code}`
- After running scenarios, matching label values (for example `type="system_error"` and `status="failed"`) are visible.

### 5) Verify Grafana dashboard under UI subpath

Open:

- <http://localhost:3000/grafana>

Expected observation:

- Grafana is reachable without separate port mapping.
- Pre-provisioned dashboard `Signal Lab Overview` is available.
- Dashboard panels show non-empty data after scenario runs:
  - scenario run rate by type/status
  - p95 scenario duration
  - HTTP request rate
  - Loki logs panel

### 6) Verify Loki API

Open:

- <http://localhost:3100/loki/api/v1/labels>

Expected observation:

- Loki returns label data JSON (for example includes `app`).

Optional query check:

```bash
curl -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode 'query={app="signal-lab"}' \
  --data-urlencode 'limit=5'
```

Expected observation:

- Recent backend log lines in JSON format with fields like `scenarioType`, `scenarioId`, `duration`, `error`.

### 7) Verify Sentry capture

Trigger from UI:

- Run `system_error` scenario.

Open your Sentry project (organization/project specific URL).

Expected observation:

- A new backend error event is captured with message similar to:
  - `Scenario forced an internal server error`
- Event tags/extras include scenario context (`scenarioType`, `scenarioId`, `duration`).

Notes:

- If `SENTRY_DSN` is empty, the app still runs and all non-Sentry checks pass.
- Sentry verification requires a real DSN provided via environment.

## Useful Commands

Run scenario from CLI:

```bash
curl -sS -X POST http://localhost:3001/api/scenarios/run \
  -H "Content-Type: application/json" \
  -d '{"type":"success","name":"readme-smoke"}'
```

List latest runs:

```bash
curl -sS http://localhost:3001/api/scenarios/runs
```

## Stop

```bash
docker compose down --remove-orphans
```

Optional full cleanup (including volumes):

```bash
docker compose down -v --remove-orphans
```

## Cursor AI Layer

Project AI artifacts are in `.cursor/`:

- rules: `.cursor/rules/*.mdc`
- skills: `.cursor/skills/*/SKILL.md`
- commands: `.cursor/commands/*.md`
- hooks: `.cursor/hooks.json` and `.cursor/hooks/*`
- marketplace skills notes: `.cursor/marketplace-skills.md`

See `AI_LAYER.md` for the intent and usage model.
