'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface RecommendedModel {
  id: string;
  name: string;
  lab: string;
  description: string;
  inputPrice: number;
  outputPrice: number;
  rating: number;
  speed: string;
  tags: string[];
  bestFor?: string;
  recommendationScore: number;
  reasoning: string;
  contextWindow: number;
}

interface RecommendResponse {
  useCase: string;
  budget: string;
  recommendations: RecommendedModel[];
}

const USE_CASES = [
  { value: 'coding', label: 'Coding & Dev', icon: '👨‍💻', desc: 'Code review, generation, debugging' },
  { value: 'writing', label: 'Writing', icon: '✍️', desc: 'Content, blogs, marketing copy' },
  { value: 'analysis', label: 'Data Analysis', icon: '📊', desc: 'Insights, reports, summaries' },
  { value: 'customer-support', label: 'Customer Support', icon: '🎧', desc: 'Chatbots, helpdesk automation' },
  { value: 'research', label: 'Research', icon: '🔬', desc: 'Literature review, summarization' },
  { value: 'real-time', label: 'Real-time Apps', icon: '⚡', desc: 'Low latency, high throughput' },
  { value: 'vision', label: 'Vision / Images', icon: '🖼️', desc: 'Image analysis, generation' },
  { value: 'math', label: 'Math & Science', icon: '🧮', desc: 'Complex calculations, reasoning' },
];

const BUDGETS = [
  { value: 'low', label: 'Budget-friendly', icon: '💰', desc: 'Under $0.001 per 1K tokens' },
  { value: 'medium', label: 'Balanced', icon: '⚖️', desc: 'Best value for money' },
  { value: 'high', label: 'Best quality', icon: '🏆', desc: 'No budget constraints' },
];

const SPEEDS = [
  { value: 'any', label: 'Any speed', icon: '🕐' },
  { value: 'fast', label: 'Fast responses', icon: '⚡' },
  { value: 'best', label: 'Best quality', icon: '🎯' },
];

const SPEED_LABEL: Record<string, string> = {
  'very-fast': 'Very fast',
  fast: 'Fast',
  medium: 'Medium',
  slow: 'Thoughtful',
};

export function ModelAdvisor() {
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState('');
  const [budget, setBudget] = useState('');
  const [speed, setSpeed] = useState('any');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendedModel[] | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<ApiResponse<RecommendResponse>>('/api/v1/models/recommend', {
        method: 'POST',
        body: JSON.stringify({ useCase, budget, speed }),
      });
      setResults(res.data.recommendations);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setUseCase('');
    setBudget('');
    setSpeed('any');
    setResults(null);
    setError('');
  }

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-card">
      {/* Progress bar */}
      {step < 3 && (
        <div className="h-1 bg-background">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Step 0 — Use case */}
        {step === 0 && (
          <div className="animate-fade-in">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Step 1 of 3</p>
            <h3 className="text-lg font-bold text-text-primary mb-1">What do you want to build?</h3>
            <p className="text-sm text-muted mb-6">Pick your primary use case</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.value}
                  type="button"
                  onClick={() => { setUseCase(uc.value); setStep(1); }}
                  className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition group ${
                    useCase === uc.value
                      ? 'border-accent bg-accent-light text-accent'
                      : 'border-border bg-background hover:border-accent/40 hover:bg-accent-light/50'
                  }`}
                >
                  <span className="text-xl">{uc.icon}</span>
                  <span className="text-xs font-semibold text-text-primary">{uc.label}</span>
                  <span className="text-[10px] text-muted leading-tight">{uc.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Budget */}
        {step === 1 && (
          <div className="animate-fade-in">
            <button type="button" onClick={() => setStep(0)} className="text-xs text-muted hover:text-text-primary mb-4 flex items-center gap-1 transition">
              ← Back
            </button>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Step 2 of 3</p>
            <h3 className="text-lg font-bold text-text-primary mb-1">What&apos;s your budget preference?</h3>
            <p className="text-sm text-muted mb-6">This affects pricing and model quality</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => { setBudget(b.value); setStep(2); }}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border text-center transition ${
                    budget === b.value
                      ? 'border-accent bg-accent-light'
                      : 'border-border bg-background hover:border-accent/40 hover:bg-accent-light/50'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-sm font-semibold text-text-primary">{b.label}</span>
                  <span className="text-xs text-muted">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Speed */}
        {step === 2 && (
          <div className="animate-fade-in">
            <button type="button" onClick={() => setStep(1)} className="text-xs text-muted hover:text-text-primary mb-4 flex items-center gap-1 transition">
              ← Back
            </button>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Step 3 of 3</p>
            <h3 className="text-lg font-bold text-text-primary mb-1">Speed preference?</h3>
            <p className="text-sm text-muted mb-6">How fast do you need responses?</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {SPEEDS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSpeed(s.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition ${
                    speed === s.value
                      ? 'border-accent bg-accent-light'
                      : 'border-border bg-background hover:border-accent/40'
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-xs font-semibold text-text-primary">{s.label}</span>
                </button>
              ))}
            </div>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-hover transition shadow-accent text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Finding best models...
                </span>
              ) : (
                'Get my recommendations →'
              )}
            </button>
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && results && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Your top recommendations</h3>
                <p className="text-sm text-muted mt-0.5">Based on your preferences</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-accent hover:text-accent-hover font-semibold transition"
              >
                Start over
              </button>
            </div>

            <div className="space-y-3">
              {results.map((model, i) => (
                <div
                  key={model.id}
                  className={`rounded-xl border p-4 transition ${
                    i === 0
                      ? 'border-accent/30 bg-accent-light/40'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        i === 0 ? 'bg-accent text-white' : 'bg-border text-muted'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-text-primary text-sm">{model.name}</span>
                          <span className="text-xs text-muted">{model.lab}</span>
                          {i === 0 && (
                            <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-semibold">
                              Best match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{model.reasoning}</p>
                      </div>
                    </div>
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-shrink-0 text-xs bg-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-accent-hover transition"
                    >
                      View →
                    </Link>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 pl-10">
                    <div className="bg-white rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] text-muted">Input/1K</p>
                      <p className="text-xs font-semibold text-text-primary">
                        ${model.inputPrice < 0.001 ? model.inputPrice.toFixed(5) : model.inputPrice.toFixed(4)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] text-muted">Speed</p>
                      <p className="text-xs font-semibold text-text-primary">{SPEED_LABEL[model.speed] ?? model.speed}</p>
                    </div>
                    <div className="bg-white rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] text-muted">Rating</p>
                      <p className="text-xs font-semibold text-text-primary">★ {model.rating}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/marketplace"
                className="text-sm text-accent font-semibold hover:text-accent-hover transition"
              >
                Browse all 12+ models →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
