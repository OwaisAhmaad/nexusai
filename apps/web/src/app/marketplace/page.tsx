import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { MarketplaceFilters } from '@/components/MarketplaceFilters';
import type { PaginatedResponse, AIModel } from '@/types';

interface SearchParams {
  category?: string;
  search?: string;
  lab?: string;
  page?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

const CATEGORY_LABELS: Record<string, string> = {
  language: 'Language',
  multimodal: 'Multimodal',
  vision: 'Vision',
  audio: 'Audio',
  code: 'Code',
};

async function ModelsGrid({ searchParams }: { searchParams: SearchParams }) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.lab) params.set('lab', searchParams.lab);
  params.set('page', searchParams.page || '1');
  params.set('limit', '20');

  let result: PaginatedResponse<AIModel>;
  try {
    result = await apiFetch<PaginatedResponse<AIModel>>(
      `/api/v1/models?${params.toString()}`,
      { cache: 'no-store' },
    );
  } catch {
    return (
      <div className="col-span-full text-center py-20 rounded-2xl bg-surface border border-border">
        <p className="text-2xl mb-2">⚠️</p>
        <p className="font-semibold text-text-primary">Couldn&apos;t load models</p>
        <p className="text-sm text-muted mt-1">Make sure the API is running at localhost:3001</p>
      </div>
    );
  }

  if (!result.data.length) {
    return (
      <div className="col-span-full text-center py-20 rounded-2xl bg-surface border border-border">
        <p className="text-2xl mb-2">🔍</p>
        <p className="font-semibold text-text-primary">No models found</p>
        <p className="text-sm text-muted mt-1">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full flex items-center justify-between mb-1">
        <p className="text-sm text-muted">
          <span className="font-semibold text-text-primary">{result.total}</span> models available
        </p>
      </div>
      {result.data.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </>
  );
}

export default function MarketplacePage({ searchParams }: PageProps) {
  const activeCat = searchParams.category || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary">Model Marketplace</h1>
        <p className="text-muted mt-2">
          Compare every AI model by price, speed, and capabilities
        </p>
      </div>

      {/* Filters + Search */}
      <MarketplaceFilters />

      {/* Category chips */}
      <div className="flex items-center gap-2 flex-wrap mt-4 mb-6">
        {[
          { value: '', label: 'All Models' },
          ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
        ].map((cat) => (
          <a
            key={cat.value}
            href={cat.value ? `/marketplace?category=${cat.value}` : '/marketplace'}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
              activeCat === cat.value
                ? 'bg-accent text-white border-accent shadow-accent'
                : 'bg-surface border-border text-muted hover:border-accent hover:text-accent'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border h-64 skeleton" />
              ))}
            </>
          }
        >
          <ModelsGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
