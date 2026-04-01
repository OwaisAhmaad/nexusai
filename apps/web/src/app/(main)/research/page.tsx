import { ResearchCard } from '@/components/ResearchCard';
import type { PaginatedResponse, ResearchItem } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getResearch(): Promise<ResearchItem[]> {
  try {
    const res = await fetch(`${API}/api/v1/research?limit=50`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = (await res.json()) as PaginatedResponse<ResearchItem>;
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function ResearchPage() {
  const items = await getResearch();

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[#F5F4F0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E5E5] text-[#E8521A] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#E8521A] rounded-full animate-pulse" />
            AI Research Digest
          </div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Latest in AI</h1>
          <p className="text-[#6B7280] mt-2 text-sm leading-relaxed">
            Stay current with breakthroughs, new model releases, and research from top AI labs.
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm">
            <p className="text-3xl mb-3">📚</p>
            <p className="font-semibold text-[#1A1A1A]">No research items yet</p>
            <p className="text-sm text-[#6B7280] mt-2">
              Make sure the API is running, then seed with:
            </p>
            <code className="inline-block mt-2 bg-[#F5F4F0] text-[#E8521A] px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E5E5E5]">
              npm run seed
            </code>
          </div>
        )}

        {/* Feed */}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
