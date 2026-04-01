import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { ApiResponse, AIModel } from '@/types';

interface Props {
  params: { id: string };
}

export default async function ModelDetailPage({ params }: Props) {
  let model: AIModel;
  try {
    const res = await apiFetch<ApiResponse<AIModel>>(
      `/api/v1/models/${params.id}`,
      { cache: 'no-store' },
    );
    model = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-text-primary mb-8 transition"
      >
        ← Back to Models
      </Link>

      <div className="rounded-2xl bg-surface border border-border p-8">
        <div className="flex items-start gap-6">
          {model.imageUrl ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-border">
              <Image
                src={model.imageUrl}
                alt={`${model.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🤖</span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{model.name}</h1>
                <p className="text-muted mt-1">{model.lab}</p>
              </div>
              <div className="flex gap-2">
                {model.isNew && (
                  <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                {model.isFeatured && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <span className="text-amber-400">★</span>
              <span className="font-medium">{model.rating.toFixed(1)}</span>
              <span className="text-muted text-sm">({model.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-text-primary leading-relaxed">{model.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-background border border-border px-2 py-1 rounded-full text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide font-medium">Context Window</p>
            <p className="text-lg font-semibold text-text-primary mt-1">
              {(model.contextWindow / 1000).toFixed(0)}K tokens
            </p>
          </div>
          <div className="bg-background rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide font-medium">Input Price</p>
            <p className="text-lg font-semibold text-text-primary mt-1">
              ${model.inputPrice.toFixed(4)} / 1K tokens
            </p>
          </div>
          <div className="bg-background rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide font-medium">Output Price</p>
            <p className="text-lg font-semibold text-text-primary mt-1">
              ${model.outputPrice.toFixed(4)} / 1K tokens
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-muted">
            Category: <span className="text-text-primary font-medium capitalize">{model.category}</span>
          </span>
          <button
            type="button"
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-hover transition text-sm font-medium"
          >
            Try this Model
          </button>
        </div>
      </div>
    </div>
  );
}
