import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { ResearchCard } from '@/components/ResearchCard';
import type { PaginatedResponse, ResearchItem } from '@/types';

async function ResearchFeed() {
  let result: PaginatedResponse<ResearchItem>;
  try {
    result = await apiFetch<PaginatedResponse<ResearchItem>>(
      '/api/v1/research?limit=50',
      { cache: 'no-store' },
    );
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Failed to load research. Please try again.</p>
      </div>
    );
  }

  if (!result.data.length) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-semibold text-text-primary mb-2">No research items yet</p>
        <p className="text-muted">Check back soon for the latest AI research.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {result.data.map((item) => (
        <ResearchCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">AI Research</h1>
        <p className="text-muted mt-2">
          Stay up to date with the latest breakthroughs in AI research.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface border border-border h-28 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <ResearchFeed />
      </Suspense>
    </div>
  );
}
