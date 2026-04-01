'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useTransition, FormEvent } from 'react';

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      startTransition(() => router.push(`/marketplace?${params.toString()}`));
    },
    [router, searchParams],
  );

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateParam('search', searchValue);
  }

  function clearSearch() {
    setSearchValue('');
    updateParam('search', '');
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
      {/* Search input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4 flex-shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search models by name, lab, or capability..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 focus:border-[#E8521A] transition"
        />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="px-5 py-2.5 bg-[#E8521A] text-white rounded-xl text-sm font-semibold hover:bg-[#d04415] transition shadow-sm flex-shrink-0"
      >
        Search
      </button>
    </form>
  );
}
