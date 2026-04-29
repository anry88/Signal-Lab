# Cursor Marketplace Skills for Signal Lab

Cursor Marketplace installs plugins. Plugins can contain skills, rules, commands, hooks, MCP servers, and subagents. The assignment asks for marketplace skills, so this repo records the exact plugin-backed skills we expect to be connected in Cursor before submission.

Marketplace state is stored by Cursor, not in this repository. These local `.cursor/*` files document what to connect and why; the actual connection is done in Cursor UI or chat.

Important UI distinction:

- The **Skills** list inside the Signal Lab project shows only local project skills from `.cursor/skills`. Seeing 5 items there is expected.
- Marketplace plugin skills are plugin/global capabilities. They may appear under the installed plugin details, the global skills/plugin inventory, slash-command suggestions, or the Agent context picker, not as files under `.cursor/skills`.
- For submission, keep the screenshot/evidence of installed plugins and document the specific plugin-backed skills below.

## How to Connect

Option A, from Cursor UI:

1. Open Cursor Marketplace: `https://cursor.com/marketplace`.
2. Search the plugin name.
3. Click the plugin.
4. Click **Sign In To Add** / **Add**.
5. Return to this workspace and restart Cursor if the skills do not appear.

Option B, from Cursor chat:

```text
/add-plugin vercel
/add-plugin prisma
/add-plugin sentry
```

Then check Cursor Settings -> Rules/Skills or the Agent context picker to confirm the skills are available.

If Cursor shows a global count such as 108 installed plugin skills but only 5 under Signal Lab, that still satisfies the intent: 5 custom project skills are local, while 6+ marketplace skills are installed through plugins.

## Required Plugins

### Vercel

Marketplace page: `https://cursor.com/marketplace/skills/nextjs`

Connect command:

```text
/add-plugin vercel
```

Use these skills:

1. `nextjs`
   - Next.js App Router guidance for routing, layouts, server/client boundaries, and data-fetching decisions.

2. `shadcn`
   - shadcn/ui component installation, composition, theming, and Tailwind integration.

3. `react-best-practices`
   - React/TSX review after component edits: hooks usage, accessibility, performance, and TypeScript patterns.

4. `agent-browser-verify`
   - Visual verification for the running frontend so the evaluator UI is checked, not only compiled.

### Prisma

Marketplace page: `https://cursor.com/marketplace/prisma`

Connect command:

```text
/add-plugin prisma
```

Use these skills/rules:

5. `prisma-cli-migrate-deploy`
   - Prisma migration command guidance for deploy-style migration checks.

6. `prisma-client-api-transactions`
   - Prisma transaction guidance if ScenarioRun writes become multi-step.

Also relevant from the same plugin:

- `migration-best-practices` rule
- `schema-conventions` rule

### Sentry

Marketplace page: `https://cursor.com/marketplace/sentry`

Connect command:

```text
/add-plugin sentry
```

Use these skills:

7. `sentry-nestjs-sdk`
   - Sentry SDK setup for NestJS error capture.

8. `sentry-setup-logging`
   - Sentry logging integration guidance when backend logging behavior changes.

9. `sentry-setup-metrics`
   - Sentry metrics/performance guidance. Prometheus remains the required primary metrics path for this assignment.

## Why Not Use the PRD Example Names Literally

PRD 003 lists examples such as `next-best-practices`, `nestjs-best-practices`, `docker-expert`, and `postgresql-table-design`. Those are useful categories, but the current Cursor Marketplace exposes concrete plugin-backed names differently.

For this repo, use real marketplace items and let custom skills cover gaps:

- NestJS endpoint workflow: `.cursor/skills/nest-endpoint-with-observability/SKILL.md`
- Docker Compose verification: `.cursor/skills/signal-lab-demo-verifier/SKILL.md`
- Prometheus/Grafana/Loki conventions: `.cursor/skills/signal-lab-observability/SKILL.md`
- PostgreSQL/Prisma project policy: `.cursor/rules/prisma-patterns.mdc`

## What Custom Skills Cover

Marketplace skills are generic. Custom Signal Lab skills encode repository-specific behavior:

- exact scenario types: `success`, `validation_error`, `system_error`, `slow_request`, `teapot`
- exact metric names and labels
- exact JSON log fields
- Loki query and Grafana `/grafana` subpath
- Sentry behavior for `system_error`
- PRD orchestrator state in `.execution/<id>/context.json`
- final 15-minute evaluator walkthrough
