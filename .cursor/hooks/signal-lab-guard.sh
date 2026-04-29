#!/bin/bash
set -euo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
export HOOK_DIR

python3 - <<'PY'
import json
import os
import subprocess
import sys

payload = sys.stdin.read()
hook_dir = os.environ["HOOK_DIR"]

checks = [
    os.path.join(hook_dir, "block-secrets-commit.sh"),
    os.path.join(hook_dir, "endpoint-observability-guard.sh"),
]

results = []

for check in checks:
    try:
        completed = subprocess.run(
            [check],
            input=payload,
            text=True,
            capture_output=True,
            check=False,
        )
    except Exception as exc:
        results.append(
            {
                "permission": "deny",
                "user_message": f"Signal Lab guard failed to run {check}.",
                "agent_message": str(exc),
            }
        )
        continue

    output = completed.stdout.strip()
    if not output:
        results.append(
            {
                "permission": "deny",
                "user_message": f"Signal Lab guard produced no output for {check}.",
                "agent_message": completed.stderr.strip(),
            }
        )
        continue

    try:
        results.append(json.loads(output.splitlines()[-1]))
    except Exception:
        results.append(
            {
                "permission": "deny",
                "user_message": f"Signal Lab guard returned invalid JSON for {check}.",
                "agent_message": output[-500:],
            }
        )

priority = {"allow": 0, "ask": 1, "deny": 2}
selected = max(results, key=lambda item: priority.get(item.get("permission", "allow"), 0))

messages = [
    item.get("agent_message") or item.get("user_message")
    for item in results
    if item.get("permission") in {"ask", "deny"}
]

if messages:
    selected = dict(selected)
    selected["agent_message"] = " | ".join(messages)

print(json.dumps(selected))
PY
