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
      <div className="text-center py-20 rounded-2xl border border-dashed border-border">
        <p className="text-2xl mb-2">⚠️</p>
        <p className="font-semibold text-text-primary">Couldn&apos;t load research</p>
        <p className="text-sm text-muted mt-1">Make sure the API server is running</p>
      </div>
    );
  }

  if (!result.data.length) {
    return (
      <div className="text-center py-20 rounded-2xl border border-dashed border-border">
        <p className="text-3xl mb-3">📚</p>
        <p className="font-semibold text-text-primary">No research items yet</p>
        <p className="text-sm text-muted mt-1">Run the seed script to populate research data</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {result.data.map((item) => (
        <ResearchCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/20 mb-4">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          AI Research Digest
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary">Latest in AI</h1>
        <p className="text-muted mt-2">
          Stay current with breakthroughs, new model releases, and research from top AI labs.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border h-28 skeleton" />
            ))}
          </div>
        }
      >
        <ResearchFeed />
      </Suspense>
    </div>
  );
}
