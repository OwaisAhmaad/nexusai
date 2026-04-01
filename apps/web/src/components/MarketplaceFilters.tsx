'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useTransition } from 'react';

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      startTransition(() => {
        router.push(`/marketplace?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateParam('search', searchValue);
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search models (GPT, Claude, Gemini...)"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-hover transition disabled:opacity-60"
        >
          Search
        </button>
      </form>

      {/* Lab filter */}
      <select
        value={searchParams.get('lab') || ''}
        onChange={(e) => updateParam('lab', e.target.value)}
        className="px-3 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">All Labs</option>
        {['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral AI', 'DeepSeek'].map((lab) => (
          <option key={lab} value={lab}>{lab}</option>
        ))}
      </select>
    </div>
  );
}
