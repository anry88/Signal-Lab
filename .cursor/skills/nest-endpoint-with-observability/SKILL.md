---
name: nest-endpoint-with-observability
description: Implement a NestJS endpoint in Signal Lab with DTO validation, Swagger documentation, Prisma persistence patterns, structured JSON logging, and required observability hooks.
---

# Nest Endpoint With Observability

Create backend endpoints that fit this repository's conventions.

## When to Use

- User asks to add a new backend endpoint.
- Existing backend route needs DTO validation + Swagger + persistence.
- Endpoint must be consistent with scenario and observability standards.

## Implementation Steps

1. Add DTO in `apps/backend/src/**/dto/*.dto.ts`:
   - class-validator decorators
   - Swagger `ApiProperty` annotations

2. Add or update controller:
   - route under `/api/...`
   - `ApiTags`, `ApiOperation`, response annotations

3. Add service logic:
   - use Prisma service for DB writes/reads
   - use structured JSON logs for success/failure
   - emit/observe metrics when route belongs to scenario flow

4. Verify global behavior remains intact:
   - global exception filter response shape
   - Swagger available at `/api/docs`
   - if errors are intentional, set explicit HTTP status path

5. Validate:
   - `cd apps/backend && npm run lint && npm run build`
   - run `curl` on new route(s)
