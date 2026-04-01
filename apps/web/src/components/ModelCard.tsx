import Link from 'next/link';
import type { AIModel } from '@/types';

interface ModelCardProps {
  model: AIModel;
}

const LAB_COLORS: Record<string, string> = {
  OpenAI: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Anthropic: 'bg-violet-50 text-violet-700 border-violet-200',
  Google: 'bg-blue-50 text-blue-700 border-blue-200',
  Meta: 'bg-sky-50 text-sky-700 border-sky-200',
  'Mistral AI': 'bg-amber-50 text-amber-700 border-amber-200',
  DeepSeek: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const LAB_ICONS: Record<string, string> = {
  OpenAI: '◆',
  Anthropic: '✦',
  Google: '●',
  Meta: '◉',
  'Mistral AI': '◈',
  DeepSeek: '◇',
};

const SPEED_COLOR: Record<string, string> = {
  'very-fast': 'text-green-600',
  fast: 'text-emerald-600',
  medium: 'text-amber-600',
  slow: 'text-blue-600',
};

const SPEED_LABEL: Record<string, string> = {
  'very-fast': '⚡ Very fast',
  fast: '⚡ Fast',
  medium: '◑ Medium',
  slow: '◐ Thoughtful',
};

function formatPrice(price: number): string {
  if (price === 0) return 'N/A';
  if (price < 0.001) return `$${price.toFixed(5)}`;
  if (price < 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(3)}`;
}

export function ModelCard({ model }: ModelCardProps) {
  const labColor = LAB_COLORS[model.lab] || 'bg-gray-50 text-gray-700 border-gray-200';
  const labIcon = LAB_ICONS[model.lab] || '○';
  const extendedModel = model as AIModel & { speed?: string };

  return (
    <Link
      href={`/models/${model.id}`}
      className="block rounded-2xl bg-surface border border-border p-4.5 hover:shadow-card-hover transition-all duration-150 group card-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 text-sm font-bold ${labColor}`}>
            {labIcon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-accent transition">
              {model.name}
            </h3>
            <p className="text-[11px] text-muted">{model.lab}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {model.isNew && (
            <span className="text-[10px] bg-accent text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
              NEW
            </span>
          )}
          {model.isFeatured && !model.isNew && (
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full leading-none">
              ★ TOP
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-muted line-clamp-2 mb-3 leading-relaxed">
        {model.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {model.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-full text-muted font-medium"
          >
            {tag}
          </span>
        ))}
        {model.tags.length > 3 && (
          <span className="text-[10px] text-muted px-1">+{model.tags.length - 3}</span>
        )}
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <div className="bg-background rounded-lg px-2.5 py-2">
          <p className="text-[10px] text-muted font-medium">Input / 1K tokens</p>
          <p className="text-xs font-bold text-text-primary mt-0.5">{formatPrice(model.inputPrice)}</p>
        </div>
        <div className="bg-background rounded-lg px-2.5 py-2">
          <p className="text-[10px] text-muted font-medium">Output / 1K tokens</p>
          <p className="text-xs font-bold text-text-primary mt-0.5">{formatPrice(model.outputPrice)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span className="font-semibold text-text-primary">{model.rating.toFixed(1)}</span>
          <span className="text-muted">({model.reviews.toLocaleString()})</span>
        </div>
        {extendedModel.speed && (
          <span className={`font-medium ${SPEED_COLOR[extendedModel.speed] ?? 'text-muted'}`}>
            {SPEED_LABEL[extendedModel.speed] ?? extendedModel.speed}
          </span>
        )}
        {model.contextWindow > 0 && (
          <span className="text-muted">
            {(model.contextWindow / 1000).toFixed(0)}K ctx
          </span>
        )}
      </div>
    </Link>
  );
}
