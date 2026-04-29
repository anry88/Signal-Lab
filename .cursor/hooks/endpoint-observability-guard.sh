#!/bin/bash
set -euo pipefail

python3 - <<'PY'
import json
import subprocess
import sys

_ = sys.stdin.read()

try:
    staged_files = subprocess.check_output(
        ["git", "diff", "--cached", "--name-only"],
        text=True,
    ).splitlines()
except Exception:
    print(json.dumps({"permission": "allow"}))
    raise SystemExit(0)

backend_touched = [
    p
    for p in staged_files
    if p.startswith("apps/backend/src/")
    and (p.endswith(".controller.ts") or p.endswith(".service.ts"))
]

if not backend_touched:
    print(json.dumps({"permission": "allow"}))
    raise SystemExit(0)

try:
    staged_patch = subprocess.check_output(
        ["git", "diff", "--cached"],
        text=True,
    )
except Exception:
    print(json.dumps({"permission": "allow"}))
    raise SystemExit(0)

markers = [
    "scenario_runs_total",
    "scenario_run_duration_seconds",
    "http_requests_total",
    "scenarioRunsTotal",
    "scenarioRunDurationSeconds",
    "httpRequestsTotal",
    "metrics.",
    "scenarioType",
    "scenarioId",
    "JSON.stringify({",
    "captureException",
    "Sentry",
    "OBSERVABILITY_REVIEWED",
]

if any(m in staged_patch for m in markers):
    print(json.dumps({"permission": "allow"}))
else:
    print(
        json.dumps(
            {
                "permission": "ask",
                "user_message": "Backend endpoint changes detected. Confirm observability coverage (metrics/logs/Sentry) before commit.",
                "agent_message": "No observability markers found in staged backend controller/service diff.",
            }
        )
    )
PY
