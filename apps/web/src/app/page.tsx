import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ModelCard } from '@/components/ModelCard';
import { ModelAdvisor } from '@/components/ModelAdvisor';
import type { PaginatedResponse, AIModel } from '@/types';

async function getFeaturedModels(): Promise<AIModel[]> {
  try {
    const res = await apiFetch<PaginatedResponse<AIModel>>(
      '/api/v1/models?limit=8',
      { cache: 'no-store' },
    );
    return res.data;
  } catch {
    return [];
  }
}

const STATS = [
  { value: '12+', label: 'AI Models' },
  { value: '5', label: 'Leading Labs' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '$0', label: 'To get started' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🎯',
    title: 'Describe your use case',
    desc: 'Tell us what you want to build — coding assistant, content writer, customer support bot, or anything else.',
  },
  {
    step: '02',
    icon: '🤖',
    title: 'Get personalized recommendations',
    desc: 'Our advisor matches you with the top 3 models based on your use case, budget, and performance needs.',
  },
  {
    step: '03',
    icon: '🚀',
    title: 'Deploy in seconds',
    desc: 'Connect via our unified API. One integration, access to every model. Switch models without changing your code.',
  },
];

export default async function HomePage() {
  const models = await getFeaturedModels();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-surface border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(232,82,26,0.06),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(251,191,36,0.04),_transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-accent/20">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              AI Model Marketplace — Find your perfect model
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-5">
              The right AI model
              <br />
              <span className="text-gradient">for every use case</span>
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10">
              Compare 12+ AI models by price, speed, and capabilities.
              Get personalized recommendations and deploy with one unified API.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="#advisor"
                className="w-full sm:w-auto bg-accent text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-accent-hover transition shadow-accent text-sm"
              >
                Find my model →
              </Link>
              <Link
                href="/marketplace"
                className="w-full sm:w-auto border border-border bg-surface text-text-primary px-7 py-3.5 rounded-xl font-semibold hover:bg-background transition text-sm"
              >
                Browse all models
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-text-primary">{stat.value}</div>
                <div className="text-xs text-muted mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Advisor */}
      <section id="advisor" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Which AI model is right for you?
            </h2>
            <p className="text-muted">
              Answer 3 quick questions and we&apos;ll recommend the best models for your specific needs.
            </p>
          </div>
          <ModelAdvisor />
        </div>
      </section>

      {/* Featured Models */}
      {models.length > 0 && (
        <section className="py-12 px-4 bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Popular Models</h2>
                <p className="text-muted text-sm mt-1">Used by thousands of developers every day</p>
              </div>
              <Link
                href="/marketplace"
                className="text-sm text-accent font-semibold hover:text-accent-hover transition flex items-center gap-1"
              >
                View all <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {models.slice(0, 8).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              How NexusAI works
            </h2>
            <p className="text-muted">Get from idea to production in minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <div className="rounded-2xl bg-surface border border-border p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-xs font-bold text-muted bg-background border border-border px-2 py-0.5 rounded-full">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2 text-[15px]">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-br from-accent/8 via-orange-50 to-amber-50 border border-accent/20 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Ready to build with AI?
            </h2>
            <p className="text-muted mb-7 leading-relaxed">
              Join thousands of developers using NexusAI to build faster with the best AI models.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex bg-accent text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-accent-hover transition shadow-accent text-sm"
            >
              Start for free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
