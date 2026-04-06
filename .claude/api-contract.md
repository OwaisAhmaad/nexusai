# API Contract — FE / BE Source of Truth
> Both FE Agent and BE Agent read this file before writing any code.
> Neither agent may deviate from this contract without orchestrator approval.

## Contract Status
```
status:     draft | approved | locked
version:    1.0.0
ticket:     NXS-000 / NXS-001
approved_by: [your name]
date:       YYYY-MM-DD
```

---

## Endpoint

```
Method:   GET | POST | PUT | PATCH | DELETE
Path:     /api/v1/[resource]/[param]
Auth:     Bearer JWT  (header: Authorization)
Version:  v1
```

### Request

```typescript
// Path params
interface PathParams {
  id: string; // UUID
}

// Query params (GET)
interface QueryParams {
  page?: number;
  limit?: number;
  // add fields as needed
}

// Request body (POST/PUT/PATCH)
interface RequestBody {
  // field: type  — NO optional fields unless truly optional
}
```

---

## Response Shape

```typescript
// Success — 200 / 201
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// The data payload for this endpoint:
interface [ResourceName] {
  id:        string;   // UUID
  // ... fields
  createdAt: string;   // ISO 8601
  updatedAt: string;
}
```

---

## Error Codes

| HTTP | Code                  | When                            |
|------|-----------------------|---------------------------------|
| 400  | VALIDATION_ERROR      | DTO validation failed           |
| 401  | UNAUTHORIZED          | Missing or expired JWT          |
| 403  | FORBIDDEN             | Authenticated but not allowed   |
| 404  | NOT_FOUND             | Resource does not exist         |
| 409  | CONFLICT              | Duplicate / idempotency replay  |
| 422  | UNPROCESSABLE_ENTITY  | Business logic violation        |
| 500  | INTERNAL_ERROR        | Unexpected server error         |

---

## FE Display Rules

```
Loading state:  Show skeleton while fetching
Empty state:    [Description of empty state UI]
Error state:    Show inline error banner — do not crash
Warning:        [Condition] → show warning badge
Blocked:        [Condition] → disable action button
Format:         [Any formatting rules, e.g. dates, currency]
```

---

## Contract Change Rule

> ⚠️ If either agent (FE or BE) discovers a mismatch between this contract
> and what they need to build:
>
> 1. **BOTH agents STOP immediately**
> 2. Agent reports the conflict to orchestrator
> 3. Orchestrator updates this file
> 4. You re-approve the updated contract
> 5. Both agents resume from where they stopped

---

## Changelog

| Version | Date       | Author | Change |
|---------|------------|--------|--------|
| 1.0.0   | YYYY-MM-DD | —      | Initial draft |
