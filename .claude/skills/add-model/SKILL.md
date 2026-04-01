---
name: add-model
description: >
  Add a new AI model to the NexusAI marketplace end-to-end.
  Handles seed data, recommendation engine affinity, and verifying it appears on the frontend.
---

## Step-by-Step: Adding a New AI Model

### 1. Add to seed data
Edit `apps/api/src/models/models.seed.ts`:
```typescript
{
  name: 'New Model Name',
  lab: 'LabName',           // must match LAB_COLORS keys in frontend
  description: '...',
  tags: ['text', 'fast'],
  contextWindow: 128000,
  inputPrice: 0.001,
  outputPrice: 0.003,
  rating: 4.5,
  reviews: 500,
  isNew: true,
  isFeatured: false,
  category: 'language',
  imageUrl: null,
  useCases: ['coding', 'writing'],
  speed: 'fast',
  bestFor: 'Best for ...',
},
```

### 2. Add to recommendation engine affinity map
Edit `apps/api/src/models/models.service.ts` — find `USE_CASE_MODEL_AFFINITY`:
```typescript
const USE_CASE_MODEL_AFFINITY: Record<string, string[]> = {
  coding: ['GPT-4o', 'Claude Sonnet 4.6', 'New Model Name', ...],
  // Add the model name to relevant use case arrays
};
```

### 3. Add lab colors to frontend (if new lab)
If the lab is not in `LAB_COLORS` in `apps/web/src/components/HomeSections.tsx` and `ModelCard.tsx`, add:
```typescript
'New Lab': { bg: '#XXXXXX', text: '#XXXXXX', border: '#XXXXXX', desc: 'Description' },
```

### 4. Re-seed the database
```bash
cd apps/api && npm run seed
```

### 5. Verify
```bash
# Should return the new model
curl "http://localhost:3001/api/v1/models" | grep "New Model Name"

# Should recommend it for relevant use case
curl -X POST "http://localhost:3001/api/v1/models/recommend" \
  -H "Content-Type: application/json" \
  -d '{"useCase":"coding","budget":"medium","speed":"any"}'
```

### 6. Check frontend
- Navigate to `/marketplace`
- Search for the model name
- Confirm it appears with correct lab badge and pricing
