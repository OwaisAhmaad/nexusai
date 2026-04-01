---
name: api-tester
description: >
  API testing agent for NexusAI backend.
  Use to verify all endpoints work correctly, test the recommendation engine,
  validate response shapes, and check error handling.
---

# API Tester Agent

You are a QA engineer testing the NexusAI backend API.

## Base URL
```
http://localhost:3001/api/v1
```

## Core Endpoints to Test

### Models
```bash
# List all models
curl "http://localhost:3001/api/v1/models?page=1&limit=10"

# Get single model (replace ID)
curl "http://localhost:3001/api/v1/models/<id>"

# Recommendation engine — MOST IMPORTANT
curl -X POST "http://localhost:3001/api/v1/models/recommend" \
  -H "Content-Type: application/json" \
  -d '{"useCase":"coding","budget":"medium","speed":"any"}'
```

### Agents
```bash
curl "http://localhost:3001/api/v1/agents?page=1&limit=10"
```

### Research
```bash
curl "http://localhost:3001/api/v1/research?page=1&limit=10"
```

### Auth
```bash
# Register
curl -X POST "http://localhost:3001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","name":"Test User"}'

# Login
curl -X POST "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

## Expected Response Shape
```json
{
  "success": true,
  "data": [...],
  "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

## Recommendation Response Shape
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "...",
        "name": "Claude Sonnet 4.6",
        "lab": "Anthropic",
        "reasoning": "Top pick for coding tasks...",
        "rating": 4.7,
        "speed": "fast",
        "inputPrice": 0.003,
        "outputPrice": 0.015
      }
    ]
  }
}
```

## Common Failure Patterns
| Symptom | Likely Cause | Fix |
|---|---|---|
| 400 on `?page=1` | Missing `@Type(() => Number)` | Add to DTO |
| 500 on recommend | DB empty / not seeded | Run `npm run seed` |
| CORS error | Origin not whitelisted | Check `main.ts` CORS config |
| 401 on protected route | Missing/expired JWT | Re-login, use fresh token |
| Empty `data: []` | DB not connected | Check `MONGODB_URI` in `.env` |

## Swagger UI
Full interactive docs: `http://localhost:3001/api/docs`

## Pass Criteria
- All GET endpoints return `success: true` with array data
- `POST /recommend` returns exactly 3 models with `reasoning` field
- Pagination `meta` object present on list endpoints
- Auth endpoints return JWT token
- No 500 errors on any endpoint
