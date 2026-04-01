# NexusAI — AI Model Marketplace

NexusAI is a full-stack AI model marketplace that guides users to discover, compare, and choose the best AI model for their needs through a conversational recommendation engine.

> **Live reference:** https://nexusai-db.netlify.app/

---

## Overview

Users land on a chat-based homepage, pick a task (coding, writing, vision, etc.), answer two quick questions about their experience level and budget priority, and receive personalized model recommendations — powered by a scoring engine in the backend. Models can then be explored in detail via the marketplace.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, TypeScript |
| Backend | NestJS, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh tokens), httpOnly cookies |
| File Storage | AWS S3 (presigned upload URLs) |
| API Docs | Swagger (`/api/docs`) |
| Monorepo | npm workspaces + Turborepo |

---

## Project Structure

```
nexusai/
├── apps/
│   ├── api/          # NestJS backend (port 3001)
│   └── web/          # Next.js 14 frontend (port 3000)
└── packages/
    └── shared-types/ # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/OwaisAhmaad/nexusai.git
cd nexusai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `apps/api/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/nexusai
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
S3_BUCKET_NAME=your-s3-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
PORT=3001
```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Seed the database

```bash
cd apps/api
npm run seed
```

This inserts 12 AI models, 6 agent templates, and 6 research items.

### 5. Run in development

```bash
# From root — runs both API and web concurrently
npm run dev
```

Or individually:

```bash
# Backend
cd apps/api && npm run start:dev

# Frontend
cd apps/web && npm run dev
```

---

## Key Features

### Conversational Model Advisor

The homepage presents a visual quick-action grid (14 task tiles). Clicking a tile starts a 3-step guided flow:

1. **Task selection** — What are you building? (coding, writing, vision, analysis, etc.)
2. **Experience level** — Beginner → AI researcher
3. **Budget priority** — Cheap / Balanced / Best quality

The backend scoring engine returns the top 3 recommended models with reasoning text.

### AI Model Marketplace

Browse, search, and filter all models by:
- Provider lab (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek)
- Category (Language, Multimodal, Vision, Audio, Code)
- Free-text search

### Research Hub

Curated AI research papers and articles with category filters, pagination, and direct links.

### Agent Templates

Pre-built agent configurations for common workflows (customer support, coding assistant, research helper, etc.).

---

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/models` | List models (paginated, filterable) |
| `POST` | `/models/recommend` | Get personalized model recommendations |
| `GET` | `/models/:id` | Single model detail |
| `GET` | `/agents` | List agent templates |
| `GET` | `/research` | List research items |
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login (returns JWT) |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/upload/presigned` | Get S3 presigned upload URL |

Full interactive docs: `http://localhost:3001/api/docs`

### Recommendation Request

```json
POST /api/v1/models/recommend
{
  "useCase": "coding",
  "budget": "medium",
  "speed": "any"
}
```

Response includes top 3 models with a `reasoning` field explaining why each was recommended.

---

## Design System

| Token | Value |
|---|---|
| Accent / CTA | `#E8521A` |
| Background | `#F5F4F0` |
| Surface (cards) | `#FFFFFF` |
| Border | `#E5E5E5` |
| Muted text | `#6B7280` |
| Body text | `#1A1A1A` |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start API + web concurrently |
| `npm run build` | Build all packages |
| `npm run seed` | Seed the database |
| `npm run lint` | Lint all packages |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `JWT_EXPIRES_IN` | No | Access token TTL (default `15m`) |
| `S3_BUCKET_NAME` | No | S3 bucket for file uploads |
| `AWS_REGION` | No | AWS region |
| `AWS_ACCESS_KEY_ID` | No | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | No | AWS credentials |
| `PORT` | No | API port (default `3001`) |
| `NEXT_PUBLIC_API_URL` | No | Frontend API base URL (default `http://localhost:3001`) |

---

## License

MIT
