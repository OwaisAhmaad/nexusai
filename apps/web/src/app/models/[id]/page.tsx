import { notFound } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface ModelDetail {
  id: string;
  name: string;
  lab: string;
  description: string;
  tags: string[];
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isFeatured: boolean;
  category: string;
  imageUrl?: string;
  speed?: string;
  useCases?: string[];
  bestFor?: string;
}

interface Props {
  params: { id: string };
}

const LAB_COLORS: Record<string, string> = {
  OpenAI: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Anthropic: 'bg-violet-50 text-violet-700 border-violet-200',
  Google: 'bg-blue-50 text-blue-700 border-blue-200',
  Meta: 'bg-sky-50 text-sky-700 border-sky-200',
  'Mistral AI': 'bg-amber-50 text-amber-700 border-amber-200',
  DeepSeek: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const SPEED_LABEL: Record<string, string> = {
  'very-fast': '⚡ Very fast',
  fast: '⚡ Fast',
  medium: '◑ Medium',
  slow: '◐ Thoughtful',
};

function formatPrice(price: number, suffix = '/1K tokens'): string {
  if (price === 0) return 'N/A';
  if (price < 0.001) return `$${price.toFixed(5)}${suffix}`;
  if (price < 0.01) return `$${price.toFixed(4)}${suffix}`;
  return `$${price.toFixed(3)}${suffix}`;
}

function estimateMonthlyCost(inputPrice: number, outputPrice: number): string {
  // Assume 1M input + 500K output tokens per month
  const monthly = (inputPrice * 1000) + (outputPrice * 500);
  if (monthly === 0) return 'N/A';
  if (monthly < 1) return `~$${monthly.toFixed(2)}`;
  return `~$${monthly.toFixed(0)}`;
}

export default async function ModelDetailPage({ params }: Props) {
  let model: ModelDetail;
  try {
    const res = await apiFetch<ApiResponse<ModelDetail>>(
      `/api/v1/models/${params.id}`,
      { cache: 'no-store' },
    );
    model = res.data;
  } catch {
    notFound();
  }

  const labColor = LAB_COLORS[model.lab] || 'bg-gray-50 text-gray-700 border-gray-200';
  const monthlyCost = estimateMonthlyCost(model.inputPrice, model.outputPrice);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/marketplace" className="hover:text-text-primary transition">
          Marketplace
        </Link>
        <span>›</span>
        <span className="text-text-primary font-medium">{model.name}</span>
      </nav>

      {/* Header card */}
      <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl border flex items-center justify-center flex-shrink-0 text-2xl font-bold ${labColor}`}>
            {model.lab[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start flex-wrap gap-2">
              <h1 className="text-2xl font-extrabold text-text-primary">{model.name}</h1>
              {model.isNew && (
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              {model.isFeatured && (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  ★ Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${labColor}`}>
                {model.lab}
              </span>
              <span className="text-xs text-muted capitalize">{model.category}</span>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">★</span>
                <span className="text-sm font-semibold text-text-primary">{model.rating.toFixed(1)}</span>
                <span className="text-xs text-muted">({model.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          <Link
            href={`/auth/register`}
            className="flex-shrink-0 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition shadow-accent hidden sm:block"
          >
            Try now →
          </Link>
        </div>

        <p className="text-text-secondary leading-relaxed mb-5">{model.description}</p>

        {model.bestFor && (
          <div className="bg-accent-light border border-accent/20 rounded-xl px-4 py-3 mb-5">
            <p className="text-sm text-accent font-semibold">
              💡 Best for: <span className="font-medium text-text-secondary">{model.bestFor}</span>
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-background border border-border px-2.5 py-1 rounded-full text-muted font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing + Specs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Pricing */}
        <div className="rounded-2xl bg-surface border border-border p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>💰</span> Pricing
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Input tokens', value: formatPrice(model.inputPrice) },
              { label: 'Output tokens', value: formatPrice(model.outputPrice) },
              { label: 'Est. monthly cost', value: monthlyCost, sub: '1M in + 500K out tokens' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  {sub && <p className="text-[10px] text-muted-light">{sub}</p>}
                </div>
                <p className="text-sm font-bold text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-2xl bg-surface border border-border p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>⚙️</span> Specifications
          </h2>
          <div className="space-y-3">
            {[
              {
                label: 'Context window',
                value: model.contextWindow > 0
                  ? `${(model.contextWindow / 1000).toFixed(0)}K tokens`
                  : 'N/A',
              },
              {
                label: 'Response speed',
                value: model.speed ? (SPEED_LABEL[model.speed] ?? model.speed) : 'Unknown',
              },
              {
                label: 'Category',
                value: model.category,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-sm text-muted">{label}</p>
                <p className="text-sm font-semibold text-text-primary capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use cases */}
      {model.useCases && model.useCases.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border p-5 mb-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>🎯</span> Ideal use cases
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {model.useCases.map((uc) => (
              <div
                key={uc}
                className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2"
              >
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                <span className="text-xs font-medium text-text-secondary capitalize">{uc.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-accent/8 via-orange-50 to-amber-50 border border-accent/20 p-6 text-center">
        <h3 className="font-bold text-text-primary mb-2">Ready to use {model.name}?</h3>
        <p className="text-sm text-muted mb-4">
          Create a free account and start building with {model.name} today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition shadow-accent"
          >
            Get started free →
          </Link>
          <Link
            href="/marketplace"
            className="border border-border bg-surface text-text-primary px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-background transition"
          >
            Compare other models
          </Link>
        </div>
      </div>
    </div>
  );
}
