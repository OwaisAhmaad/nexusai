import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { HeroSection } from '@/components/HeroSection';
import { FilterBar } from '@/components/FilterBar';
import type { PaginatedResponse, AIModel } from '@/types';

interface SearchParams {
  category?: string;
  search?: string;
  lab?: string;
  page?: string;
}

interface HomePageProps {
  searchParams: SearchParams;
}

async function ModelsGrid({ searchParams }: { searchParams: SearchParams }) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.lab) params.set('lab', searchParams.lab);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('limit', '20');

  let result: PaginatedResponse<AIModel>;
  try {
    result = await apiFetch<PaginatedResponse<AIModel>>(
      `/api/v1/models?${params.toString()}`,
      { cache: 'no-store' },
    );
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Failed to load models. Please try again.</p>
      </div>
    );
  }

  if (!result.data.length) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-semibold text-text-primary mb-2">No models found</p>
        <p className="text-muted">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {result.data.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted">
        Showing {result.data.length} of {result.total} models
      </div>
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FilterBar />
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-border h-64 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <ModelsGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
