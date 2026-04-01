import type { ResearchItem } from '@/types';

interface ResearchCardProps {
  item: ResearchItem;
}

export function ResearchCard({ item }: ResearchCardProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:shadow-md transition">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 text-center">
          <p className="text-lg font-bold text-accent leading-none">{item.date}</p>
          <p className="text-xs text-muted uppercase font-medium">{item.month}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text-primary text-sm leading-snug">
              {item.title}
            </h3>
            <span className="text-xs text-muted bg-background border border-border px-2 py-0.5 rounded-full flex-shrink-0">
              {item.source}
            </span>
          </div>
          <p className="text-xs text-muted mt-2 line-clamp-2">{item.summary}</p>
        </div>
      </div>
    </div>
  );
}
