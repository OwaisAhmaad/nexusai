import Image from 'next/image';
import Link from 'next/link';
import type { AIModel } from '@/types';

interface ModelCardProps {
  model: AIModel;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.id}`}
      className="block rounded-2xl bg-surface border border-border p-5 hover:shadow-md transition group"
    >
      <div className="flex items-start gap-3 mb-3">
        {model.imageUrl ? (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
            <Image
              src={model.imageUrl}
              alt={`${model.name} logo`}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🤖</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-accent transition">
            {model.name}
          </h3>
          <p className="text-xs text-muted truncate">{model.lab}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {model.isNew && (
            <span className="bg-accent text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              New
            </span>
          )}
          {model.isFeatured && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              ★
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-muted line-clamp-2 mb-4">{model.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {model.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-full text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-background rounded-lg p-2">
          <p className="text-muted">Context</p>
          <p className="font-medium text-text-primary">
            {(model.contextWindow / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-background rounded-lg p-2">
          <p className="text-muted">Input/1K</p>
          <p className="font-medium text-text-primary">${model.inputPrice.toFixed(4)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs">
        <span className="text-amber-400">★</span>
        <span className="font-medium text-text-primary">{model.rating.toFixed(1)}</span>
        <span className="text-muted">({model.reviews})</span>
      </div>
    </Link>
  );
}
