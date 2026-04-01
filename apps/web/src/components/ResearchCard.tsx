import type { ResearchItem } from '@/types';

interface ResearchCardProps {
  item: ResearchItem;
}

const SOURCE_COLORS: Record<string, string> = {
  'Anthropic Blog': 'bg-violet-50 text-violet-700 border-violet-200',
  'OpenAI Blog': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Google Research': 'bg-blue-50 text-blue-700 border-blue-200',
  'Meta AI': 'bg-sky-50 text-sky-700 border-sky-200',
  arXiv: 'bg-orange-50 text-orange-700 border-orange-200',
  'DeepSeek Research': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export function ResearchCard({ item }: ResearchCardProps) {
  const sourceColor =
    SOURCE_COLORS[item.source] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:shadow-card-hover transition-all duration-150 card-hover">
      <div className="flex gap-4">
        {/* Date badge */}
        <div className="flex-shrink-0 w-12 text-center pt-0.5">
          <div className="text-xl font-extrabold text-accent leading-none">{item.date}</div>
          <div className="text-[10px] text-muted uppercase font-bold tracking-wide mt-0.5">
            {item.month}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-text-primary text-sm leading-snug flex-1">
              {item.title}
            </h3>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${sourceColor}`}
            >
              {item.source}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.summary}</p>
        </div>
      </div>
    </div>
  );
}
