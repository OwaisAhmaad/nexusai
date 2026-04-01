---
name: nextjs-component
description: >
  Build Next.js 14 pages and components for NexusAI frontend.
  Use when creating any page, component, layout, or UI element.
---

## Rules
- TypeScript with explicit prop interfaces
- Tailwind only
- Server Component by default — 'use client' only for interactivity
- API calls: use src/lib/api.ts helper

## API Helper Pattern (src/lib/api.ts)
```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
```

## Card Style
```
rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition
```

## Button Primary
```
bg-[#E8521A] text-white px-4 py-2 rounded-lg hover:bg-[#d04415] transition text-sm font-medium
```

## S3 Image Upload Flow
1. POST /api/v1/upload/presigned → get { uploadUrl, publicUrl }
2. PUT uploadUrl with file (direct to S3, no backend)
3. Save publicUrl to user profile
