# NexusAI — Claude Code Project Guide

## What Is This Project?
NexusAI is a full-stack **AI Model Marketplace**. Users chat with a recommendation wizard, pick a task + experience + budget, and get ranked AI model suggestions. The backend scores models via a static affinity engine (ML team APIs come later).

**Reference site:** https://nexusai-db.netlify.app/

---

## Monorepo Structure
```
nexusai/
├── apps/
│   ├── api/          # NestJS 10 — port 3001
│   └── web/          # Next.js 14 App Router — port 3000
├── packages/
│   └── shared-types/ # Shared TypeScript interfaces
├── .claude/
│   ├── agents/       # Sub-agent definitions
│   └── skills/       # Reusable skill templates
├── CLAUDE.md         # ← you are here
└── README.md
```

---

## Dev Commands

```bash
# Root — run both apps concurrently
npm run dev

# Backend only
cd apps/api && npm run start:dev

# Frontend only
cd apps/web && npm run dev

# Seed the database (run once after connecting to Atlas)
cd apps/api && npm run seed

# Build all packages
npm run build

# Lint all
npm run lint
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | NestJS 10, TypeScript, Mongoose, @nestjs/jwt, @nestjs/passport |
| Frontend | Next.js 14 App Router, Tailwind CSS, TypeScript |
| Database | MongoDB Atlas via `MONGODB_URI` |
| Auth | JWT access token (15m) + refresh token (7d, httpOnly cookie) |
| File Storage | AWS S3 presigned URLs |
| API Docs | Swagger at `http://localhost:3001/api/docs` |
| Monorepo | npm workspaces + Turborepo |

---

## Environment Variables

**`apps/api/.env`**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=nexusai-jwt-secret-prod-2024
JWT_REFRESH_SECRET=nexusai-refresh-secret-prod-2024
JWT_EXPIRES_IN=15m
S3_BUCKET_NAME=nexusai-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
PORT=3001
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Backend Architecture Rules

### Module Structure (6 files per module)
```
src/<module>/
├── schemas/<entity>.schema.ts     # Mongoose schema + document type
├── repositories/
│   ├── <entity>.repository.interface.ts
│   └── <entity>.repository.ts
├── dto/
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   └── query-<entity>.dto.ts
├── <module>.service.ts
├── <module>.controller.ts
└── <module>.module.ts
```

### Critical DTO Rule — Query Params
**Always** add `@Type(() => Number)` from `class-transformer` to numeric query params:
```typescript
import { Type } from 'class-transformer';

@IsOptional() @Type(() => Number) @IsNumber() @Min(1)
page?: number;
```
Without this, HTTP string query params fail `@IsNumber()` validation with 400.

### API Response Shape
All endpoints return:
```typescript
{ success: boolean; data: T; message?: string; meta?: PaginationMeta }
```

### Protected Routes
```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
```

---

## Frontend Architecture Rules

### Server vs Client Components
- **Default:** Server Component (no directive needed)
- **Use `'use client'` only for:** useState, useEffect, event handlers, browser APIs
- **SSR fetch:** Always use absolute URLs — never relative paths
  ```typescript
  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${API}/api/v1/models`, { cache: 'no-store' });
  ```

### Route Structure
```
app/
├── page.tsx              # Homepage (chat + HomeSections)
├── layout.tsx            # Root layout (Navbar)
└── (main)/               # Route group — adds Footer
    ├── layout.tsx
    ├── marketplace/page.tsx
    ├── agents/page.tsx
    ├── research/page.tsx
    └── models/[id]/page.tsx
```

### Key Components
| Component | Purpose |
|---|---|
| `ChatHomePage` | Full-screen chat wizard (`'use client'`) |
| `HomeSections` | 6 marketing sections below chat |
| `MarketplaceFilters` | Search/filter bar |
| `ModelCard` | Model display card |
| `Navbar` | Top navigation |
| `Footer` | Site footer |

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Accent / CTA | `#E8521A` | Buttons, highlights, icons |
| Background | `#F5F4F0` | Page bg, section bg |
| Surface | `#FFFFFF` | Cards, panels |
| Border | `#E5E5E5` | Card borders, dividers |
| Muted text | `#6B7280` | Subtitles, metadata |
| Body text | `#1A1A1A` | Headings, primary text |

### Common Class Patterns
```
Card:           rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition
Button primary: bg-[#E8521A] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#d04415] transition
Button outline: border border-[#E5E5E5] text-[#6B7280] px-3 py-1.5 rounded-full hover:border-[#1A1A1A] transition
Section bg:     bg-[#F5F4F0]
Section white:  bg-white
```

### Lab Color Map
| Lab | Badge bg | Text | Border |
|---|---|---|---|
| OpenAI | `#F0FDF4` | `#15803D` | `#BBF7D0` |
| Anthropic | `#F5F3FF` | `#6D28D9` | `#DDD6FE` |
| Google | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| Meta | `#F0F9FF` | `#0369A1` | `#BAE6FD` |
| Mistral AI | `#FFFBEB` | `#B45309` | `#FDE68A` |
| DeepSeek | `#EEF2FF` | `#4338CA` | `#C7D2FE` |

---

## Database Seed Data

Located in `apps/api/src/`:
- `models/models.seed.ts` — 12 AI models
- `agents/agents.seed.ts` — 6 agent templates
- `research/research.seed.ts` — 6 research items
- `scripts/seed.ts` — Seed runner

Run with: `cd apps/api && npm run seed`

---

## Model Recommendation Engine

`apps/api/src/models/models.service.ts` — `recommend()` method

**Request:** `POST /api/v1/models/recommend`
```json
{ "useCase": "coding", "budget": "medium", "speed": "any" }
```

Valid `useCase` values: `coding` `writing` `analysis` `customer-support` `research` `real-time` `vision` `math`

Valid `budget` values: `low` `medium` `high`

Returns top 3 models with `reasoning` string. Scoring uses `USE_CASE_MODEL_AFFINITY` map + budget/speed multipliers. ML team APIs will replace this later.

---

## Git Branch Strategy

- `main` — production-ready code, push directly
- `claude/setup-nexusai-project-b4rwV` — mirrors main

Always push to both:
```bash
git push origin main
git push origin main:claude/setup-nexusai-project-b4rwV
```

---

## AI Evaluation Checklist (Zero-Bug Policy)

Before pushing, verify:
- [ ] `POST /api/v1/models/recommend` returns 3 models (not 400/500)
- [ ] Homepage chat flow: tile → experience → budget → models → proceed
- [ ] Marketplace page loads model cards
- [ ] Research page shows articles (not empty)
- [ ] All navigation links work
- [ ] No relative URLs in SSR fetch calls
- [ ] All DTO numeric query params have `@Type(() => Number)`
- [ ] CORS allows `http://localhost:3000`
