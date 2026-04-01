---
name: api-test
description: >
  Run a quick health check on all NexusAI API endpoints.
  Use after backend changes to verify nothing is broken before committing.
---

## Quick API Health Check

Run these curl commands to verify the backend is healthy:

```bash
BASE="http://localhost:3001/api/v1"

echo "=== Models List ==="
curl -s "$BASE/models?page=1&limit=5" | python3 -m json.tool | grep -E '"success"|"total"'

echo "=== Recommendation Engine ==="
curl -s -X POST "$BASE/models/recommend" \
  -H "Content-Type: application/json" \
  -d '{"useCase":"coding","budget":"medium","speed":"any"}' \
  | python3 -m json.tool | grep -E '"name"|"reasoning"'

echo "=== Research List ==="
curl -s "$BASE/research?page=1&limit=5" | python3 -m json.tool | grep -E '"success"|"total"'

echo "=== Agents List ==="
curl -s "$BASE/agents?page=1&limit=5" | python3 -m json.tool | grep -E '"success"|"total"'

echo "=== Swagger Docs ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs
```

## Pass Criteria
- Models list: `"success": true`, `"total": 12`
- Recommend: returns 3 objects each with `"name"` and `"reasoning"` keys
- Research: `"success": true`, `"total": 6`
- Agents: `"success": true`, `"total": 6`
- Swagger: HTTP `200`

## If Tests Fail

| Failure | Fix |
|---|---|
| Connection refused | Start API: `cd apps/api && npm run start:dev` |
| `"total": 0` | DB empty: `cd apps/api && npm run seed` |
| `400` on list endpoints | Missing `@Type(() => Number)` in DTO |
| `500` on recommend | Check `USE_CASE_MODEL_AFFINITY` map in `models.service.ts` |
| Swagger 404 | Check `SwaggerModule.setup('api/docs', ...)` in `main.ts` |
