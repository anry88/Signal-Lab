# /run-prd

Execute a PRD using the Signal Lab orchestrator workflow.

## Usage

Provide:

- `prdPath` (for example `prds/003_prd-cursor-ai-layer.md`)
- optional `startPhase`
- optional existing `.execution/<id>/context.json` for resume

## Required behavior

1. Load `.cursor/skills/signal-lab-orchestrator/SKILL.md`.
2. Create/read `.execution/<timestamp>/context.json`.
3. Run phases:
   - analysis -> codebase -> planning -> decomposition -> implementation -> review -> report
4. Mark tasks with explicit model route:
   - `fast` for low complexity
   - `default` for architectural/high-complexity work
5. Assign project skills to tasks:
   - backend -> `nest-endpoint-with-observability`
   - frontend -> `shadcn-rhf-form`
   - observability -> `signal-lab-observability`
   - final verification -> `signal-lab-demo-verifier`
6. Persist progress after each phase/task.
7. End with:
   - completed/failed counts
   - retries
   - remaining blockers
   - exact next commands.
