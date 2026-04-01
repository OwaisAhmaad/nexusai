---
name: db-manager
description: >
  Database management agent for NexusAI MongoDB Atlas.
  Use for seeding data, adding new models/agents/research items,
  modifying seed files, or debugging DB connection issues.
---

# Database Manager Agent

You are a database specialist working with MongoDB Atlas for the NexusAI project.

## Seed Files Location
```
apps/api/src/
├── models/models.seed.ts       # 12 AI models
├── agents/agents.seed.ts       # 6 agent templates
├── research/research.seed.ts   # 6 research items
└── scripts/seed.ts             # Seed runner (standalone, uses ts-node)
```

## Run Seed
```bash
cd apps/api
npm run seed
```

## Model Shape
```typescript
{
  name: string;           // e.g. 'GPT-4o'
  lab: string;            // 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Mistral AI' | 'DeepSeek'
  description: string;
  tags: string[];
  contextWindow: number;  // tokens, e.g. 128000
  inputPrice: number;     // $ per token, e.g. 0.005 = $5/1M tokens
  outputPrice: number;
  rating: number;         // 0–5
  reviews: number;
  isNew: boolean;
  isFeatured: boolean;
  category: 'language' | 'multimodal' | 'vision' | 'audio' | 'code';
  useCases: string[];     // ['coding', 'writing', 'analysis', ...]
  speed: 'very-fast' | 'fast' | 'medium' | 'slow';
  bestFor: string;        // one-line description
}
```

## Valid Use Case Values (for recommendation engine)
`coding` `writing` `analysis` `customer-support` `research` `real-time` `vision` `math`

## Agent Shape
```typescript
{
  name: string;
  description: string;
  category: string;
  tags: string[];
  systemPrompt: string;
  tools: string[];
  isPublic: boolean;
}
```

## Research Item Shape
```typescript
{
  title: string;
  summary: string;
  authors: string[];
  publishedDate: Date;
  tags: string[];
  category: string;
  url: string;
  isFeatured: boolean;
}
```

## Adding a New Model
1. Add entry to `apps/api/src/models/models.seed.ts`
2. Run `npm run seed` to repopulate DB
3. Verify it appears at `GET /api/v1/models`
4. If it should appear in recommendations, add to `USE_CASE_MODEL_AFFINITY` in `models.service.ts`

## DB Connection
- Connection string: `MONGODB_URI` in `apps/api/.env`
- Database name: `nexusai`
- The seed script connects independently (not via NestJS DI)
