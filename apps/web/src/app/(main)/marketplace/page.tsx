import { Suspense } from 'react';
import Link from 'next/link';
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

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const CATEGORIES = [
  { value: '',           label: 'All Models', icon: '✦' },
  { value: 'language',   label: 'Language',   icon: '💬' },
  { value: 'multimodal', label: 'Multimodal', icon: '🔮' },
  { value: 'vision',     label: 'Vision',     icon: '🖼️' },
  { value: 'audio',      label: 'Audio',      icon: '🎙️' },
  { value: 'code',       label: 'Code',       icon: '👨‍💻' },
];

const LAB_STATS = [
  { lab: 'OpenAI',     icon: '◆', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { lab: 'Anthropic',  icon: '✦', color: 'bg-violet-50 text-violet-700 border-violet-200'   },
  { lab: 'Google',     icon: '●', color: 'bg-blue-50 text-blue-700 border-blue-200'         },
  { lab: 'Meta',       icon: '◉', color: 'bg-sky-50 text-sky-700 border-sky-200'            },
  { lab: 'Mistral AI', icon: '◈', color: 'bg-amber-50 text-amber-700 border-amber-200'      },
  { lab: 'DeepSeek',   icon: '◇', color: 'bg-indigo-50 text-indigo-700 border-indigo-200'   },
];

async function getModels(searchParams: SearchParams): Promise<{ models: AIModel[]; total: number }> {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.search)   params.set('search',   searchParams.search);
  if (searchParams.lab)      params.set('lab',      searchParams.lab);
  params.set('page',  searchParams.page ?? '1');
  params.set('limit', '20');

  try {
    const res = await fetch(`${API}/api/v1/models?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { models: [], total: 0 };
    const json = (await res.json()) as PaginatedResponse<AIModel>;
    return { models: Array.isArray(json?.data) ? json.data : [], total: json?.total ?? 0 };
  } catch {
    return { models: [], total: 0 };
  }
}

function ModelsSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-[#E5E5E5] h-64 skeleton" />
      ))}
    </>
  );
}

async function ModelsGrid({ searchParams }: { searchParams: SearchParams }) {
  const { models, total } = await getModels(searchParams);

  if (models.length === 0) {
    return (
      <div className="col-span-full text-center py-20 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm">
        <p className="text-3xl mb-3">🔍</p>
        <p className="font-semibold text-[#1A1A1A] text-lg">No models found</p>
        <p className="text-sm text-[#6B7280] mt-1 mb-4">
          {searchParams.search
            ? `No results for "${searchParams.search}" — try a different keyword`
            : 'Try a different category or run the seed script'}
        </p>
        <Link
          href="/marketplace"
          className="inline-flex text-sm text-[#E8521A] font-semibold hover:text-[#d04415] transition"
        >
          Clear filters →
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="col-span-full text-xs text-[#9CA3AF] mb-1">
        Showing <span className="font-semibold text-[#1A1A1A]">{models.length}</span> of{' '}
        <span className="font-semibold text-[#1A1A1A]">{total}</span> models
      </p>
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </>
  );
}

export default function MarketplacePage({ searchParams }: PageProps) {
  const activeCat  = searchParams.category ?? '';
  const activeLab  = searchParams.lab ?? '';
  const hasFilters = !!(activeCat || activeLab || searchParams.search);

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[#F5F4F0]">

      {/* ── Hero banner ── */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fff0eb] border border-[#E8521A]/20 text-[#E8521A] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <span className="text-xs">✦</span>
                {hasFilters ? 'Filtered results' : 'All AI Models'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                Model Marketplace
              </h1>
              <p className="text-[#6B7280] mt-1.5 text-sm">
                Compare 12+ AI models by price, speed &amp; capabilities
              </p>
            </div>
            <Link
              href="/#advisor"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#E8521A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#d04415] transition shadow-sm"
            >
              <span>✦</span> Find my model
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Lab pills ── */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-xs text-[#9CA3AF] font-medium mr-1">By lab:</span>
          <a
            href="/marketplace"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
              !activeLab
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white border-[#E5E5E5] text-[#6B7280] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
            }`}
          >
            All
          </a>
          {LAB_STATS.map(({ lab, icon, color }) => (
            <a
              key={lab}
              href={`/marketplace?lab=${encodeURIComponent(lab)}${activeCat ? `&category=${activeCat}` : ''}`}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                activeLab === lab
                  ? color + ' shadow-sm'
                  : 'bg-white border-[#E5E5E5] text-[#6B7280] hover:border-[#9CA3AF]'
              }`}
            >
              <span className="text-[11px]">{icon}</span>
              {lab}
            </a>
          ))}
        </div>

        {/* ── Category chips ── */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-xs text-[#9CA3AF] font-medium mr-1">Category:</span>
          {CATEGORIES.map(({ value, label, icon }) => (
            <a
              key={value}
              href={
                value
                  ? `/marketplace?category=${value}${activeLab ? `&lab=${encodeURIComponent(activeLab)}` : ''}`
                  : activeLab
                  ? `/marketplace?lab=${encodeURIComponent(activeLab)}`
                  : '/marketplace'
              }
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition ${
                activeCat === value
                  ? 'bg-[#E8521A] text-white border-[#E8521A] shadow-sm'
                  : 'bg-white border-[#E5E5E5] text-[#6B7280] hover:border-[#E8521A] hover:text-[#E8521A]'
              }`}
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>

        {/* ── Search + filter bar ── */}
        <div className="mb-6">
          <MarketplaceFilters />
        </div>

        {/* ── Model grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Suspense fallback={<ModelsSkeleton />}>
            <ModelsGrid searchParams={searchParams} />
          </Suspense>
        </div>

        {/* ── Browse by use case CTA ── */}
        <div className="mt-12 rounded-2xl bg-white border border-[#E5E5E5] p-6 sm:p-8 text-center shadow-sm">
          <p className="text-[#E8521A] text-xs font-bold uppercase tracking-wider mb-2">✦ Not sure which to pick?</p>
          <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2">Let NexusAI find it for you</h3>
          <p className="text-[#6B7280] text-sm mb-5 max-w-sm mx-auto">
            Answer 3 quick questions and our advisor will match you with the perfect model.
          </p>
          <Link
            href="/#advisor"
            className="inline-flex items-center gap-2 bg-[#E8521A] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#d04415] transition shadow-sm"
          >
            <span>✦</span> Start the advisor →
          </Link>
        </div>

      </div>
    </div>
  );
}
