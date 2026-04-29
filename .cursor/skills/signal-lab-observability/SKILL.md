---
name: signal-lab-observability
description: Add or review observability for Signal Lab backend endpoints, including Prometheus metrics, structured JSON logs, Loki visibility, Grafana dashboard compatibility, and Sentry capture for error scenarios.
---

# Signal Lab Observability Skill

Use this skill to make a backend endpoint observability-ready in this repository.

## When to Use

- A new endpoint or scenario path is added in `apps/backend/src/**`.
- Existing behavior changes and metrics/logs are now incomplete.
- You need to verify that Grafana/Loki/Sentry walkthrough still works after a code change.

## Repository-Specific Checklist

1. **Metrics**
   - Update logic in `apps/backend/src/observability/metrics.service.ts` only when needed.
   - For scenario-like actions, update:
     - `scenario_runs_total{type,status}`
     - `scenario_run_duration_seconds{type}`
   - Ensure HTTP metric (`http_requests_total`) remains emitted by middleware.

2. **Structured logs**
   - Emit JSON logs for success and failure paths.
   - Include these keys for scenario flows:
     - `timestamp`, `level`, `message`, `context`.
     - `scenarioType`, `scenarioId`, `duration`, `error`.

3. **Sentry**
   - Capture backend `system_error` failures with tags/extra context.
   - Keep DSN source as env (`SENTRY_DSN`) only.

4. **Compose-level observability**
   - Keep services healthy in `docker-compose.yml`: `prometheus`, `loki`, `promtail`, `grafana`.
   - Keep Grafana subpath routing reachable at `http://localhost:3000/grafana`.

5. **Verification commands**
   - `curl http://localhost:3001/metrics`
   - `curl http://localhost:3100/loki/api/v1/labels`
   - `curl -G "http://localhost:3100/loki/api/v1/query_range" --data-urlencode 'query={app="signal-lab"} |= "scenarioType"' --data-urlencode 'limit=5'`
   - `curl http://localhost:3000/grafana/api/health`
