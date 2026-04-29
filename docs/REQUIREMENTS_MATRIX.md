# Signal Lab Requirements Matrix

This matrix maps assignment requirements to concrete artifacts and verification checks.

## Platform Foundation

| Requirement | Artifact | Verification |
|---|---|---|
| Next.js App Router frontend | `apps/frontend/app/*` | `http://localhost:3000` renders app shell |
| shadcn/ui | `apps/frontend/components/ui/*` | Buttons, cards, inputs, select, badge, toast are visible in UI |
| Tailwind CSS | `apps/frontend/tailwind.config.ts`, global CSS | layout and status styling render correctly |
| TanStack Query | frontend query provider and scenario hooks | history loads through `useQuery`, run action uses `useMutation` |
| React Hook Form | scenario form component | form state and validation are handled by RHF |
| NestJS backend | `apps/backend/src/*` | `GET /api/health` returns 200 |
| Swagger | backend Swagger setup in `main.ts` | `http://localhost:3001/api/docs` opens |
| PostgreSQL 16 | `docker-compose.yml` | `docker compose ps` shows healthy postgres |
| Prisma | `prisma/schema.prisma`, migrations | `ScenarioRun` table exists and runs persist |
| Docker Compose one-command start | `docker-compose.yml` | `docker compose up -d` starts stack |

## Scenario Requirements

| Scenario | Expected Behavior | Verification |
|---|---|---|
| `success` | save run, return 200, increment success metric, log info | UI shows completed run; metrics increase |
| `validation_error` | return 400, save error run, log warn, add Sentry breadcrumb if possible | UI shows error toast and failed history item |
| `system_error` | return 500, save error run, log error, capture Sentry exception | Sentry shows exception; error metric increases |
| `slow_request` | delay 2-5s, save completed run, log slow warning, histogram spike | UI loading state visible; latency panel changes |
| `teapot` | optional 418 with `{ signal: 42 }`, save metadata `{ easter: true }` | hidden bonus check passes |

## Observability

| Requirement | Artifact | Verification |
|---|---|---|
| Prometheus endpoint | backend metrics module | `curl http://localhost:3001/metrics` |
| `scenario_runs_total` | scenario service metrics | labels include `type` and `status` |
| `scenario_run_duration_seconds` | scenario service histogram | latency buckets appear after runs |
| `http_requests_total` | request metrics middleware/interceptor | labels include method, path, status code |
| JSON logs | backend logger setup | Docker logs contain parseable JSON with scenario fields |
| Loki | `observability/loki/*`, `observability/promtail/*` | Loki API on `localhost:3100` and Grafana Explore query `{app="signal-lab"}` |
| Grafana dashboard | `observability/grafana/dashboards/signal-lab.json` | `http://localhost:3000/grafana` shows at least 3 real-data panels |
| Sentry | backend Sentry module/filter | `system_error` appears in configured Sentry project |

## Cursor AI Layer

| Requirement | Artifact | Verification |
|---|---|---|
| Stack constraints rule | `.cursor/rules/stack-constraints.mdc` | asks agent not to replace required stack |
| Observability conventions rule | `.cursor/rules/observability-conventions.mdc` | names metrics and log fields consistently |
| Prisma patterns rule | `.cursor/rules/prisma-patterns.mdc` | blocks other ORMs and raw SQL by default |
| Frontend patterns rule | `.cursor/rules/frontend-patterns.mdc` | keeps server state in TanStack Query and forms in RHF |
| Error handling rule | `.cursor/rules/error-handling.mdc` | standardizes backend/frontend error behavior |
| Observability custom skill | `.cursor/skills/signal-lab-observability/SKILL.md` | can guide adding metrics/logs/Sentry to a new endpoint |
| Nest endpoint skill | `.cursor/skills/nest-endpoint-with-observability/SKILL.md` | can scaffold endpoint plus DTO, Swagger, metrics, logs |
| Form skill | `.cursor/skills/shadcn-rhf-form/SKILL.md` | can scaffold shadcn + RHF + TanStack mutation form |
| Commands | `.cursor/commands/*.md` | `/add-endpoint`, `/check-obs`, `/run-prd` appear in Cursor chat |
| Hooks | `.cursor/hooks/*` or current Cursor hook config | hook docs explain the real problem they prevent |
| Marketplace skills | `.cursor/marketplace-skills.md` or `AI_LAYER.md` | at least 6 selected and justified |

## Orchestrator

| Requirement | Artifact | Verification |
|---|---|---|
| Orchestrator skill | `.cursor/skills/signal-lab-orchestrator/SKILL.md` | new Cursor chat can invoke it |
| Working directory | `.execution/<timestamp>/` | skill instructs creation and update |
| Persisted state | `.execution/<timestamp>/context.json` | contains phases, tasks, status, `signal: 42` |
| Atomic decomposition | context tasks | tasks are 5-10 minute units with dependencies |
| Model selection | context tasks and skill docs | tasks are marked `fast` or `default` with reasons |
| Resume behavior | orchestrator instructions | completed phases are not repeated |
| Final report | `.execution/<timestamp>/report.md` or chat output | report lists completed, failed, retries, next steps |

## Documentation

| Requirement | Artifact | Verification |
|---|---|---|
| Run, check, stop instructions | `README.md` | evaluator can start in 3 minutes |
| Observability walkthrough | `README.md` | evaluator can verify metrics, Grafana, Loki, Sentry |
| AI layer docs | `AI_LAYER.md` | rules, skills, commands, hooks, marketplace skills explained |
| Submission checklist | `SUBMISSION_CHECKLIST.md` | filled with repo URL, branch, commands, paths |
| Known gaps | README or checklist | any missing items are explicit |

## Rubric Strategy

| Rubric Area | Max | Target | Strategy |
|---|---:|---:|---|
| Working app and stack | 25 | 22+ | Use every required library for real behavior, not placeholders. |
| Observability | 25 | 21+ | Make the walkthrough pass with real Prometheus, Grafana, Loki, and Sentry integration. |
| Cursor AI Layer | 25 | 21+ | Make artifacts workflow-specific and tied to actual project problems. |
| Orchestrator | 15 | 12+ | Persist context, decompose atomically, and mark model choices. |
| Docs and DX | 10 | 8+ | Make README and checklist evaluator-focused. |
| Bonus | 5 | 5 | Implement `teapot`. |

## Non-Negotiables

- Do not replace the required stack without explicit written justification.
- Do not commit real secrets.
- Do not ship an empty dashboard.
- Do not make Cursor files generic boilerplate.
- Do not rely on source-code reading for the verification walkthrough.
