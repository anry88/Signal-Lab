#!/bin/bash
set -euo pipefail

python3 - <<'PY'
import json
import re
import subprocess
import sys

_ = sys.stdin.read()

try:
    staged = subprocess.check_output(
        ["git", "diff", "--cached", "--name-only"],
        text=True,
    ).splitlines()
except Exception:
    print(json.dumps({"permission": "allow"}))
    raise SystemExit(0)

danger_patterns = (
    ".env",
    "credentials",
    "secret",
    "token",
    "key.json",
)

allowed_secret_like_files = {
    ".env.example",
}

flagged = [
    p
    for p in staged
    if p not in allowed_secret_like_files
    and any(x in p.lower() for x in danger_patterns)
]

try:
    staged_patch = subprocess.check_output(
        ["git", "diff", "--cached", "--unified=0"],
        text=True,
    )
except Exception:
    staged_patch = ""

added_lines = [
    line[1:]
    for line in staged_patch.splitlines()
    if line.startswith("+") and not line.startswith("+++")
]

secret_patterns = [
    re.compile(r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"),
    re.compile(r"(?i)\b(SENTRY_DSN|API[_-]?KEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*['\"]?(?!change-me|placeholder|example|your-)[A-Za-z0-9_./:@%+\-=]{16,}"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"),
    re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
]

secret_hits = []
for line in added_lines:
    if any(pattern.search(line) for pattern in secret_patterns):
        secret_hits.append(line[:120])

if flagged or secret_hits:
    details = []
    if flagged:
        details.append("secret-like files: " + ", ".join(flagged))
    if secret_hits:
        details.append("secret-like diff additions: " + "; ".join(secret_hits[:5]))
    print(
        json.dumps(
            {
                "permission": "deny",
                "user_message": "Commit blocked: staged changes look like secrets or credentials. Remove them or replace with documented placeholders.",
                "agent_message": "Secret guard triggered: " + " | ".join(details),
            }
        )
    )
else:
    print(json.dumps({"permission": "allow"}))
PY
