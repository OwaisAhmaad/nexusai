# Coverage Gates

All gates must pass before the GitHub agent is allowed to open PRs.

---

## Required Minimums

| Layer | What is measured | Minimum |
|-------|-----------------|---------|
| BE Services | Line + branch coverage on `*.service.ts` | **≥ 90%** |
| BE Controllers | Line coverage on `*.controller.ts` | **≥ 80%** |
| FE Components | Line + branch coverage on `*.tsx` components | **≥ 70%** |
| Shared Utils | Line coverage on `packages/` utility functions | **≥ 95%** |

---

## What Each Layer Covers

### BE Services (≥ 90%)
Every public method on the service must be tested:
- Happy path (correct data in → correct data out)
- Each error code the service can throw (400, 403, 404, 422, etc.)
- Edge cases: empty arrays, null values, boundary values
- Idempotency: calling the same write operation twice gives the same result

### BE Controllers (≥ 80%)
HTTP layer tests only — no business logic in controllers:
- 200/201 success with valid input
- 400 on DTO validation failure
- 401 on missing/expired JWT
- 403 on insufficient permissions
- Route param extraction is correct

### FE Components (≥ 70%)
All 3 render states must be covered:
- **Loading state**: skeleton/spinner renders while fetching
- **Error state**: error banner renders on API failure
- **Empty state**: empty UI renders when data is `[]` or `null`
- **Happy path**: correct data renders correctly
- User interaction: click handlers, form submission, keyboard nav

### Shared Utils (≥ 95%)
Pure functions must be thoroughly tested — no side effects to mock:
- All input permutations
- Boundary values (0, null, undefined, max values)
- Type coercion edge cases

---

## How Coverage Is Measured

**Backend (NestJS / Jest):**
```bash
cd apps/api && npm test -- --coverage --coverageReporters=text
```

**Frontend (Next.js / Jest):**
```bash
cd apps/web && npm test -- --coverage --coverageReporters=text
```

The test agent runs both, parses the output, and compares against the gates above.

---

## What Happens When a Gate Fails

```
BE Services: 84% ✗  (gate: ≥ 90%)
```

Test agent produces a bug report pointing to the uncovered lines:

```
=== COVERAGE GAP ===
Layer:    BE Services
File:     apps/api/src/models/models.service.ts
Uncovered lines: 47–52, 89–94
Missing scenarios:
  - findById: not found (404) case
  - recommend: empty useCase map key
Route to: BE Agent
Action: Add unit tests for these specific cases
===================
```

BE agent adds the missing tests. Test agent re-runs. If gates pass, pipeline continues.

---

## Adjusting Gates (Team Lead Only)

Gates are defined in `CLAUDE.md`. Only the squad lead should lower them, and only with a documented reason. Lowering a gate is a technical debt entry — track it in Jira.

Never lower a gate to make a failing pipeline pass. Fix the missing tests instead.
