'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'language', label: 'Language' },
  { value: 'vision', label: 'Vision' },
  { value: 'code', label: 'Code' },
  { value: 'audio', label: 'Audio' },
  { value: 'multimodal', label: 'Multimodal' },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const setCategory = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category) {
        params.set('category', category);
      } else {
        params.delete('category');
      }
      params.delete('page');
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="mb-6 flex items-center gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => setCategory(cat.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
            currentCategory === cat.value
              ? 'bg-accent text-white border-accent'
              : 'bg-surface text-muted border-border hover:border-accent hover:text-accent'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
