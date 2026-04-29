# /add-endpoint

Add a new NestJS endpoint in Signal Lab with observability-first defaults.

## Inputs to collect

- Module/domain name (for example `scenarios`, `health`, `runs`)
- Route + method
- Request DTO fields
- Expected success status and error statuses
- Whether persistence in Prisma is required

## Required implementation checklist

1. DTO with validation + Swagger annotations.
2. Controller route with `ApiTags`, `ApiOperation`, responses.
3. Service method with Prisma integration when needed.
4. Structured JSON log in success and error paths.
5. Update metrics if endpoint belongs to scenario execution flow.
6. Ensure error shape remains compatible with global exception filter.
7. Run:
   - `cd apps/backend && npm run lint && npm run build`
8. Return changed files and curl checks.
