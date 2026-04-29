---
name: shadcn-rhf-form
description: Build compact Signal Lab frontend forms using shadcn-style UI components, React Hook Form for input state, and TanStack Query for API mutation and refresh behavior.
---

# shadcn + RHF Form Skill

Use this skill for Signal Lab form-centric UI work.

## When to Use

- A new frontend form is needed in `apps/frontend/app/page.tsx` or a feature component.
- Mutation and query invalidation flow is required after form submit.
- UI should remain compact and dashboard-like, not marketing-style.

## Repository Pattern

1. Use components from `apps/frontend/components/ui`:
   - `Button`, `Card`, `Input`, `Select`, `Badge`, `Toast`.

2. Use RHF:
   - `useForm` with default values
   - register all fields
   - keep client-side validation simple and explicit

3. Use TanStack Query:
   - `useMutation` for submit action
   - `useQuery` for history/read models
   - invalidate query keys after successful or failed mutation where needed

4. Use `apps/frontend/lib/api.ts`:
   - avoid ad-hoc fetches in component bodies.

5. Required states:
   - loading state on submit button
   - query loading/error/empty states
   - toast for request result
