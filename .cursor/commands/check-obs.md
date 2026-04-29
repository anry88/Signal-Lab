# /check-obs

Run Signal Lab observability verification against the local docker stack.

## Steps

0. Load `.cursor/skills/signal-lab-demo-verifier/SKILL.md` and use its report format.

1. Confirm services:
   - `docker compose ps`
2. Hit health + metrics:
   - `curl http://localhost:3001/api/health`
   - `curl http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"`
3. Generate scenario traffic:
   - success + system_error calls to `/api/scenarios/run`
4. Loki checks:
   - `curl http://localhost:3100/loki/api/v1/labels`
   - `curl "http://localhost:3100/loki/api/v1/query_range?query={app=\"signal-lab\"}&limit=5"`
5. Grafana checks via subpath:
   - `curl http://localhost:3000/grafana/api/health`
   - `curl "http://localhost:3000/grafana/api/search?query=Signal%20Lab%20Overview"`
6. If checks fail, provide concrete file-level fixes.
