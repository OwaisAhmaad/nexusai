---
name: seed-data
description: >
  Add or update seed data for NexusAI database (models, agents, research).
  Use when adding a new AI model to the marketplace, adding agent templates,
  or adding research items.
---

## Files to Edit

| Data type | File |
|---|---|
| AI Models | `apps/api/src/models/models.seed.ts` |
| Agent Templates | `apps/api/src/agents/agents.seed.ts` |
| Research Items | `apps/api/src/research/research.seed.ts` |

## Model Entry Template
```typescript
{
  name: 'Model Name',
  lab: 'OpenAI',                    // OpenAI | Anthropic | Google | Meta | Mistral AI | DeepSeek
  description: 'One paragraph description of capabilities and best use cases.',
  tags: ['text', 'code', 'fast'],   // 3–6 lowercase tags
  contextWindow: 128000,
  inputPrice: 0.005,                // $ per token (0.005 = $5 per 1M tokens)
  outputPrice: 0.015,
  rating: 4.7,                      // 0–5 with one decimal
  reviews: 1500,
  isNew: false,
  isFeatured: false,
  category: 'language',             // language | multimodal | vision | audio | code
  imageUrl: null,
  useCases: ['coding', 'writing'],  // use valid values only (see below)
  speed: 'fast',                    // very-fast | fast | medium | slow
  bestFor: 'Short description of ideal workload',
},
```

## Valid useCase Values
`coding` `writing` `analysis` `customer-support` `research` `real-time` `vision` `math`

## Agent Entry Template
```typescript
{
  name: 'Agent Name',
  description: 'What this agent does.',
  category: 'productivity',
  tags: ['writing', 'automation'],
  systemPrompt: 'You are a helpful assistant that...',
  tools: ['web-search', 'code-interpreter'],
  isPublic: true,
},
```

## Research Entry Template
```typescript
{
  title: 'Paper or Article Title',
  summary: 'Two-sentence summary of findings.',
  authors: ['Author One', 'Author Two'],
  publishedDate: new Date('2024-01-15'),
  tags: ['reasoning', 'llm', 'benchmark'],
  category: 'research',             // research | tutorial | news | benchmark
  url: 'https://...',
  isFeatured: false,
},
```

## After Editing Seed Files
```bash
cd apps/api
npm run seed
```

This clears all existing data and re-inserts everything. Verify at:
- `GET http://localhost:3001/api/v1/models`
- `GET http://localhost:3001/api/v1/agents`
- `GET http://localhost:3001/api/v1/research`
