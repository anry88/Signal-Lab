# Orchestrator Coordination Notes

Use these concise prompts per phase to keep context small.

## analysis (fast)

- Read PRD.
- Extract requirements, constraints, acceptance checks.
- Write condensed result to `context.json.phases.analysis.result`.

## codebase (fast/explore)

- Map files that will likely change.
- Record gaps versus PRD.

## planning (default)

- Produce implementation plan with risk notes.
- Keep plan in phase result; avoid writing code here.

## decomposition (default)

- Create atomic tasks (5-10 min each) with dependencies.
- Mark each task with `model: fast|default`.
- Attach a project skill to each task when applicable:
  - backend -> `nest-endpoint-with-observability`
  - frontend form/UI -> `shadcn-rhf-form`
  - observability -> `signal-lab-observability`
  - final walkthrough -> `signal-lab-demo-verifier`

## implementation (fast + default)

- Execute ready tasks in dependency order.
- Update task status and implementation counters after each step.

## review (fast readonly)

- Validate against PRD and rubric risk points.
- If failing: create remediation tasks with retry count.

## report (fast)

- Summarize completed/failed/retried.
- Include exact verification commands and next actions.
