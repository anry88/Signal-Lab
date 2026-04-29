# Signal Lab — Submission Checklist

Complete this file before submission. It is optimized for a 15-minute evaluator walkthrough.

---

## Репозиторий

- **URL**: `___`
- **Ветка**: `___`
- **Время работы** (приблизительно): `___` часов

---

## Runbook (15 minutes)

```bash
# Start:
docker compose up -d

# Quick checks:
docker compose ps
curl -sS http://localhost:3001/api/health
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"

# Stop:
docker compose down --remove-orphans
```

**Prerequisites**: Docker + Docker Compose, free ports `3000`, `3001`, `3100`, `5432`; optional real `SENTRY_DSN` for Sentry verification.

---

## Stack confirmation

| Technology | Used? | Evidence path |
|-----------|:-----:|---------------|
| Next.js (App Router) | ☐ | `apps/frontend/app/layout.tsx`, `apps/frontend/app/page.tsx` |
| shadcn/ui | ☐ | `apps/frontend/components/ui/*` |
| Tailwind CSS | ☐ | `apps/frontend/tailwind.config.ts`, `apps/frontend/app/globals.css` |
| TanStack Query | ☐ | `apps/frontend/app/providers.tsx`, `apps/frontend/app/page.tsx` |
| React Hook Form | ☐ | `apps/frontend/app/page.tsx` |
| NestJS | ☐ | `apps/backend/src/main.ts`, `apps/backend/src/app.module.ts` |
| PostgreSQL | ☐ | `docker-compose.yml`, `prisma/schema.prisma` |
| Prisma | ☐ | `prisma/schema.prisma`, `apps/backend/src/prisma/prisma.service.ts` |
| Sentry | ☐ | `apps/backend/src/main.ts`, `apps/backend/src/scenarios/scenarios.service.ts` |
| Prometheus | ☐ | `apps/backend/src/observability/*`, `observability/prometheus/prometheus.yml` |
| Grafana | ☐ | `observability/grafana/dashboards/signal-lab.json` |
| Loki | ☐ | `observability/loki/loki-config.yml`, `observability/promtail/promtail-config.yml` |

---

## Observability Verification

Use these exact checks:

| Signal | How to reproduce | Where to check |
|--------|------------------|----------------|
| Prometheus metric | Run `success` and `system_error` from UI or `POST /api/scenarios/run` | `http://localhost:3001/metrics` and verify `scenario_runs_total`, `scenario_run_duration_seconds`, `http_requests_total` |
| Grafana dashboard | After 2-3 scenario runs, open Grafana | `http://localhost:3000/grafana` -> dashboard `Signal Lab Overview` with non-empty panels |
| Loki log | Trigger `system_error` or `validation_error` and query Loki | `http://localhost:3100/loki/api/v1/labels` and query `{app="signal-lab"}` |
| Sentry exception | Configure real `SENTRY_DSN`, run `system_error` | Sentry project issue/event with message `Scenario forced an internal server error` and scenario tags/extras |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `signal-lab-observability` | Добавление и проверка Prometheus metrics, JSON logs, Loki/Grafana/Sentry coverage |
| 2 | `nest-endpoint-with-observability` | Создание NestJS endpoints с DTO, Swagger, Prisma, logs, metrics |
| 3 | `shadcn-rhf-form` | Создание compact UI форм через shadcn/ui, RHF и TanStack Query |
| 4 | `signal-lab-demo-verifier` | Финальная 15-minute evaluator verification walkthrough |
| 5 | `signal-lab-orchestrator` | PRD execution pipeline с persisted context и fast/default task routing |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Ведёт добавление backend endpoint с observability checklist |
| 2 | `/check-obs` | Проверяет local Docker observability stack |
| 3 | `/run-prd` | Запускает PRD через orchestrator workflow с resume |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `block-secrets-commit.sh` via `signal-lab-guard.sh` | Блокирует staged secrets/config credentials перед agent-run commit |
| 2 | `endpoint-observability-guard.sh` via `signal-lab-guard.sh` | Ловит backend endpoint changes без metric/log/Sentry markers |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `stack-constraints.mdc` | Обязательный стек и порты walkthrough |
| 2 | `observability-conventions.mdc` | Названия метрик, labels, JSON log fields, Sentry conventions |
| 3 | `frontend-patterns.mdc` | RHF, TanStack Query, shadcn/ui, compact operational UI |
| 4 | `prisma-patterns.mdc` | Prisma-only data access, migrations, ScenarioRun compatibility |
| 5 | `error-handling.mdc` | Backend exception shape и frontend error UX |

### Marketplace Skills

Installed through Cursor Marketplace plugins. These may not appear in the local Signal Lab `.cursor/skills` list; that local list should show the 5 custom project skills.

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `nextjs` via Vercel plugin | Next.js App Router conventions |
| 2 | `shadcn` via Vercel plugin | shadcn/ui + Tailwind component composition |
| 3 | `react-best-practices` via Vercel plugin | React/TSX quality review |
| 4 | `agent-browser-verify` via Vercel plugin | Visual frontend verification |
| 5 | `prisma-cli-migrate-deploy` via Prisma plugin | Prisma migration command guidance |
| 6 | `prisma-client-api-transactions` via Prisma plugin | Prisma transaction patterns |
| 7 | `sentry-nestjs-sdk` via Sentry plugin | Sentry SDK setup for NestJS |
| 8 | `sentry-workflow` via Sentry plugin | Sentry-guided issue triage/fix workflow |
| 9 | `sentry-feature-setup` via Sentry plugin | Configure alerts, AI monitoring, and advanced Sentry features |

**Что закрыли custom skills, чего нет в marketplace:** Signal Lab-specific scenario types, exact metric names/labels, JSON log fields, `/grafana` subpath, Loki query shape, final demo walkthrough, and PRD orchestrator context/resume workflow.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/<timestamp>/context.json`
- **Сколько фаз**: `7`
- **Какие задачи для fast model**: PRD analysis, codebase scan, low-complexity DTO/UI/metric/log/doc tasks, readonly review, final report
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [ ] UI приложения
- [ ] Grafana dashboard с данными
- [ ] Loki logs
- [ ] Sentry error

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
