# Signal Lab Hooks

Cursor loads `.cursor/hooks.json`. The active hook is a single dispatcher:

- `signal-lab-guard.sh`
  - Trigger: `beforeShellExecution` on `git commit`
  - Purpose: runs all project commit guards and returns the strictest permission result.
  - Reason: keeping one hook entry avoids Cursor beta behavior where multiple hooks on the same event may not all run consistently.
  - The command in `hooks.json` supports both project-root and `.cursor` working directories.

## Guard Checks

- `block-secrets-commit.sh`
  - Blocks staged secret-like files and staged diff additions that look like credentials.
  - Allows documented placeholders such as `.env.example`.

- `endpoint-observability-guard.sh`
  - When backend controllers/services are staged, asks for observability confirmation if the diff lacks metric, structured-log, or Sentry markers.
  - Intentional exceptions can include `OBSERVABILITY_REVIEWED` in the staged diff with a short reason.
