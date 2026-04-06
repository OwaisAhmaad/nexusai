'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ── Types ──────────────────────────────────────────────────── */
type Step = 0 | 1 | 2 | 3;

interface OnboardingData {
  task: string;
  experience: string;
  budget: string;
}

/* ── Static data ─────────────────────────────────────────────── */
const SUGGESTED_PILLS = [
  { label: 'Recruiting',         icon: '👥',  color: 'bg-blue-50   text-blue-700   border-blue-200'   },
  { label: 'Create a prototype', icon: '🎯',  color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Build a business',   icon: '🏢',  color: 'bg-green-50  text-green-700  border-green-200'  },
  { label: 'Help me learn',      icon: '📚',  color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: 'Research',           icon: '🔬',  color: 'bg-pink-50   text-pink-700   border-pink-200'   },
  { label: 'Create content',     icon: '✍️',  color: 'bg-teal-50   text-teal-700   border-teal-200'   },
  { label: 'Code something',     icon: '💻',  color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { label: 'Analyze data',       icon: '📊',  color: 'bg-amber-50  text-amber-700  border-amber-200'  },
];

const TASK_ICONS = [
  { label: 'Create image',       icon: '🎨', href: null },
  { label: 'Generate Audio',     icon: '🎵', href: null },
  { label: 'Create video',       icon: '🎬', href: null },
  { label: 'Create slides',      icon: '📊', href: null },
  { label: 'Create Infographs',  icon: '📈', href: null },
  { label: 'Create quiz',        icon: '❓', href: null },
  { label: 'Create Flashcards',  icon: '🗂️', href: null },
  { label: 'Create Mind map',    icon: '🧠', href: null },
  { label: 'Analyze Data',       icon: '📉', href: null },
  { label: 'Write content',      icon: '✍️', href: null },
  { label: 'Code Generation',    icon: '💻', href: null },
  { label: 'Document Analysis',  icon: '📄', href: null },
  { label: 'Translate',          icon: '🌐', href: null },
  { label: 'Just Exploring',     icon: '🌟', href: '/marketplace' },
];

const STATS = [
  { value: '525+',  label: 'AI Models'  },
  { value: '82K',   label: 'Builders'   },
  { value: '28',    label: 'AI Labs'    },
  { value: '4.8 ⭐', label: 'Avg Rating' },
];

const FEATURED_MODELS = [
  { name: 'GPT-5',            provider: 'OpenAI',     desc: 'Most capable reasoning model',   bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  { name: 'Claude Opus 4.6',  provider: 'Anthropic',  desc: 'Best for complex analysis',      bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  { name: 'Gemini 3.1 Pro',   provider: 'Google',     desc: 'Multimodal intelligence',        bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  { name: 'Llama 4',          provider: 'Meta',       desc: 'Open-source powerhouse',         bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  { name: 'Mistral Large',    provider: 'Mistral AI', desc: 'European AI champion',           bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  { name: 'DeepSeek R2',      provider: 'DeepSeek',   desc: 'Math & coding specialist',       bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
];

const BUILDER_CARDS = [
  { icon: '🌱', title: 'Beginners',   desc: 'No AI experience? No problem. We guide you step by step.' },
  { icon: '💻', title: 'Developers',  desc: 'API access, code examples, and technical comparisons.' },
  { icon: '📊', title: 'Analysts',    desc: 'Data processing, chart generation, and report writing.' },
  { icon: '🎨', title: 'Creatives',   desc: 'Image generation, video creation, and audio synthesis.' },
  { icon: '🏢', title: 'Businesses',  desc: 'Customer support, automation, and workflow tools.' },
  { icon: '🔬', title: 'Researchers', desc: 'Academic writing, literature review, and citations.' },
];

const AI_LABS = [
  { name: 'OpenAI',     emoji: '🟢', count: '9 models'  },
  { name: 'Anthropic',  emoji: '🟣', count: '8 models'  },
  { name: 'Google',     emoji: '🔵', count: '6 models'  },
  { name: 'Meta',       emoji: '🔵', count: '4 models'  },
  { name: 'Mistral AI', emoji: '🟡', count: '3 models'  },
  { name: 'DeepSeek',   emoji: '🟤', count: '4 models'  },
  { name: 'xAI',        emoji: '⚫', count: '2 models'  },
  { name: 'Alibaba',    emoji: '🔴', count: '3 models'  },
  { name: 'NVIDIA',     emoji: '🟢', count: '2 models'  },
  { name: 'GLM',        emoji: '🔵', count: '2 models'  },
  { name: 'Moonshot',   emoji: '🌙', count: '2 models'  },
];

const COMPARISON_TABLE = [
  { model: 'GPT-5',             lab: 'OpenAI',    context: '256K', speed: '⚡⚡⚡', price: '$$',   bestFor: 'Reasoning'   },
  { model: 'Claude Opus 4.6',   lab: 'Anthropic', context: '200K', speed: '⚡⚡',   price: '$$$',  bestFor: 'Analysis'    },
  { model: 'Gemini 3.1 Pro',    lab: 'Google',    context: '2M',   speed: '⚡⚡',   price: '$$',   bestFor: 'Multimodal'  },
  { model: 'GPT-5 Turbo',       lab: 'OpenAI',    context: '128K', speed: '⚡⚡⚡', price: '$',    bestFor: 'Speed'       },
  { model: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K', speed: '⚡⚡⚡', price: '$$',   bestFor: 'Balance'     },
  { model: 'Gemini 3 Flash',    lab: 'Google',    context: '1M',   speed: '⚡⚡⚡', price: '$',    bestFor: 'Fast & cheap'},
  { model: 'Llama 4',           lab: 'Meta',      context: '128K', speed: '⚡⚡',   price: 'Free', bestFor: 'Open source' },
  { model: 'Mistral Large',     lab: 'Mistral',   context: '128K', speed: '⚡⚡',   price: '$$',   bestFor: 'European'    },
  { model: 'DeepSeek R2',       lab: 'DeepSeek',  context: '64K',  speed: '⚡⚡',   price: '$',    bestFor: 'Math/Code'   },
  { model: 'o4-mini',           lab: 'OpenAI',    context: '128K', speed: '⚡⚡⚡', price: '$',    bestFor: 'Reasoning'   },
  { model: 'Claude Haiku 4.5',  lab: 'Anthropic', context: '200K', speed: '⚡⚡⚡', price: '$',    bestFor: 'Lightweight' },
  { model: 'Grok 2',            lab: 'xAI',       context: '128K', speed: '⚡⚡',   price: '$$',   bestFor: 'Real-time'   },
];

const TRENDING = [
  { rank: 1, name: 'GPT-5',           provider: 'OpenAI',    useCase: 'Reasoning'    },
  { rank: 2, name: 'Claude Opus 4.6', provider: 'Anthropic', useCase: 'Analysis'     },
  { rank: 3, name: 'Gemini 3.1 Pro',  provider: 'Google',    useCase: 'Multimodal'   },
  { rank: 4, name: 'o4-mini',         provider: 'OpenAI',    useCase: 'Speed'        },
  { rank: 5, name: 'DeepSeek R2',     provider: 'DeepSeek',  useCase: 'Math/Code'    },
  { rank: 6, name: 'Llama 4',         provider: 'Meta',      useCase: 'Open source'  },
];

const BUDGET_TIERS = [
  { icon: '🆓', tier: 'Free',     desc: 'Open-source models',  models: 'Llama 4, DeepSeek R2, Mistral 7B'          },
  { icon: '💰', tier: 'Budget',   desc: 'Under $10/mo',        models: 'GPT-4.1-mini, Gemini Flash, Claude Haiku'   },
  { icon: '⚖️', tier: 'Standard', desc: '$10–$50/mo',          models: 'GPT-5, Claude Sonnet, Gemini Pro'           },
  { icon: '🏆', tier: 'Premium',  desc: 'Best quality',        models: 'GPT-5, Claude Opus, Gemini Ultra'           },
];

const USE_CASES = [
  { label: 'Coding',            icon: '💻', value: 'coding'           },
  { label: 'Writing',           icon: '✍️', value: 'writing'          },
  { label: 'Analysis',          icon: '📊', value: 'analysis'         },
  { label: 'Customer Support',  icon: '🎧', value: 'customer-support' },
  { label: 'Research',          icon: '🔬', value: 'research'         },
  { label: 'Real-time',         icon: '🔴', value: 'real-time'        },
  { label: 'Vision',            icon: '👁️', value: 'vision'           },
  { label: 'Math',              icon: '🧮', value: 'math'             },
];

const QUIZ_TASKS = [
  { value: 'recruiting',  label: 'Recruiting',         icon: '👥' },
  { value: 'prototype',   label: 'Create a prototype', icon: '🎯' },
  { value: 'business',    label: 'Build a business',   icon: '🏢' },
  { value: 'learning',    label: 'Help me learn',      icon: '📚' },
  { value: 'research',    label: 'Research',           icon: '🔬' },
  { value: 'content',     label: 'Create content',     icon: '✍️' },
  { value: 'coding',      label: 'Code something',     icon: '💻' },
  { value: 'analysis',    label: 'Analyze data',       icon: '📊' },
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner',   label: 'Beginner',        sub: 'Never used AI before',     icon: '🌱' },
  { value: 'some',       label: 'Some experience', sub: 'Used ChatGPT or similar',  icon: '😊' },
  { value: 'developer',  label: 'Developer',       sub: 'I can write code',         icon: '💻' },
  { value: 'researcher', label: 'AI researcher',   sub: 'Deep technical knowledge', icon: '🔬' },
];

const BUDGET_OPTIONS = [
  { value: 'free',     label: 'Free',         sub: 'Open-source only',      icon: '🆓' },
  { value: 'cheap',    label: 'Cheap',        sub: 'Under $10 / month',     icon: '💰' },
  { value: 'balanced', label: 'Balanced',     sub: 'Best value for money',  icon: '⚖️' },
  { value: 'best',     label: 'Best quality', sub: 'Performance over cost', icon: '🏆' },
];

/* ── Page component ──────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();

  /* Onboarding state */
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep]                     = useState<Step>(0);
  const [textInput, setTextInput]           = useState('');
  const [email, setEmail]                   = useState('');
  const [data, setData]                     = useState<Partial<OnboardingData>>({});

  /* Open quiz */
  function startQuiz(task?: string) {
    setData(task ? { task } : {});
    setStep(task ? 0 : 0);   // always show welcome first
    setShowOnboarding(true);
  }

  /* Finish onboarding */
  function finish(budget: string) {
    const final: OnboardingData = {
      task:       data.task       ?? 'general AI assistance',
      experience: data.experience ?? 'Some experience',
      budget,
    };
    sessionStorage.setItem('nexusai_onboarding', JSON.stringify(final));
    setShowOnboarding(false);
    router.push('/chat-hub');
  }

  /* Close on ESC */
  useEffect(() => {
    if (!showOnboarding) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowOnboarding(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showOnboarding]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      {/* ── ONBOARDING MODAL ── */}
      {showOnboarding && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowOnboarding(false); }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-8 relative">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Progress bar — only for steps 1-3 */}
            {step > 0 && (
              <div className="flex gap-2 mb-8">
                {([1, 2, 3] as const).map((n) => (
                  <div
                    key={n}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= n ? 'bg-[#E8521A]' : 'bg-[#E5E5E5]'}`}
                  />
                ))}
              </div>
            )}

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="text-center">
                <div className="w-14 h-14 bg-[#E8521A] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="9" cy="9" r="2.5" fill="white"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-3">Welcome to NexusAI 👋</h2>
                <p className="text-[#6B7280] text-sm mb-5 leading-relaxed">
                  In 3 quick questions, I&apos;ll find the perfect AI models for you.
                </p>
                {data.task && (
                  <div className="bg-[#FFF8F5] border border-[#E8521A]/20 rounded-xl px-4 py-2.5 mb-5 text-sm text-[#E8521A] font-medium">
                    You want to: {data.task}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setStep(data.task ? 2 : 1)}
                  className="w-full bg-[#E8521A] text-white py-3 rounded-full font-bold text-[15px] hover:bg-[#d04415] transition mb-3"
                >
                  Let&apos;s get started →
                </button>
                <button
                  type="button"
                  onClick={() => { setShowOnboarding(false); router.push('/marketplace'); }}
                  className="text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition underline-offset-2 hover:underline"
                >
                  Skip to marketplace
                </button>
              </div>
            )}

            {/* Step 1 — task */}
            {step === 1 && (
              <>
                <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest mb-2">Step 1 of 3</p>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">What are you building?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {QUIZ_TASKS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => { setData((p) => ({ ...p, task: t.label })); setStep(2); }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-[#E5E5E5] bg-white text-left hover:border-[#E8521A] hover:bg-[#FFF8F5] transition"
                    >
                      <span className="text-2xl flex-shrink-0">{t.icon}</span>
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 2 — experience */}
            {step === 2 && (
              <>
                <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest mb-2">Step 2 of 3</p>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-1">What&apos;s your experience level?</h2>
                <p className="text-[#6B7280] text-sm mb-6">Totally fine to be brand new — that&apos;s what I&apos;m here for!</p>
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map((e) => (
                    <button
                      key={e.value}
                      type="button"
                      onClick={() => { setData((p) => ({ ...p, experience: e.label })); setStep(3); }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E5E5] bg-white text-left hover:border-[#E8521A] hover:bg-[#FFF8F5] transition"
                    >
                      <span className="text-2xl flex-shrink-0">{e.icon}</span>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A]">{e.label}</p>
                        <p className="text-[12px] text-[#6B7280]">{e.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3 — budget */}
            {step === 3 && (
              <>
                <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest mb-2">Step 3 of 3</p>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-1">What&apos;s your budget priority?</h2>
                <p className="text-[#6B7280] text-sm mb-6">We&apos;ll filter models to match your budget.</p>
                <div className="space-y-2">
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => finish(b.label)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E5E5E5] bg-white text-left hover:border-[#E8521A] hover:bg-[#FFF8F5] transition"
                    >
                      <span className="text-2xl flex-shrink-0">{b.icon}</span>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A]">{b.label}</p>
                        <p className="text-[12px] text-[#6B7280]">{b.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LANDING PAGE ── */}
      <div className="min-h-screen bg-[#F5F4F0]">

        {/* ─ Section 1: Hero ─────────────────────────────────── */}
        <section className="pt-24 pb-10 px-4 sm:px-8 text-center">
          <div className="max-w-3xl mx-auto">

            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 bg-[#FFF8F5] border border-[#E8521A]/30 rounded-full px-3.5 py-1.5 mb-6">
              <span className="text-[#E8521A] text-[13px] font-semibold">🔥 347 models live · Updated daily</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] mb-5 leading-tight tracking-tight">
              Find the perfect<br />
              <span style={{ color: '#E8521A' }}>AI model</span><br />
              for your use case
            </h1>
            <p className="text-[#6B7280] text-[17px] mb-8 max-w-xl mx-auto leading-relaxed">
              The only AI marketplace that matches you with the right model based on your task, experience, and budget.
            </p>

            {/* Search box */}
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                startQuiz(textInput.trim() || undefined);
              }}
              className="max-w-2xl mx-auto mb-4"
            >
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-md px-4 py-3.5 flex items-center gap-3 focus-within:border-[#E8521A]/40 transition">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="What do you want to build today?..."
                  className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#E8521A] text-white px-5 py-2 rounded-full font-bold text-[13px] hover:bg-[#d04415] transition whitespace-nowrap flex-shrink-0"
                >
                  Find my model →
                </button>
              </div>
            </form>

            {/* Suggested pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {SUGGESTED_PILLS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => startQuiz(p.label)}
                  className={`flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full text-[13px] font-medium transition hover:opacity-80 ${p.color}`}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>

            {/* Task icon grid */}
            <div className="max-w-3xl mx-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 mb-10">
              {TASK_ICONS.map((t) => {
                const inner = (
                  <>
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-[10px] font-medium text-[#6B7280] leading-tight text-center group-hover:text-[#E8521A] transition">
                      {t.label}
                    </span>
                  </>
                );
                if (t.href) {
                  return (
                    <Link
                      key={t.label}
                      href={t.href}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#E8521A] hover:shadow-sm transition group"
                    >
                      {inner}
                    </Link>
                  );
                }
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => startQuiz(t.label)}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#E8521A] hover:shadow-sm transition group"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-8 sm:gap-12">
                  {i > 0 && <div className="hidden sm:block w-px h-8 bg-[#E5E5E5]" />}
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#1A1A1A]">{s.value}</p>
                    <p className="text-[12px] text-[#9CA3AF] font-medium mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 2: Featured Models ──────────────────────── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Featured Models</h2>
              <p className="text-[#6B7280] text-sm mt-1">Hand-picked by our team · Updated weekly</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {FEATURED_MODELS.map((m) => (
                <div
                  key={m.name}
                  className="flex-shrink-0 w-56 rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-3 flex-shrink-0"
                    style={{ backgroundColor: m.bg, color: m.text, border: `1.5px solid ${m.border}` }}
                  >
                    {m.name[0]}
                  </div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">{m.name}</p>
                  <span
                    className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: m.bg, color: m.text, border: `1px solid ${m.border}` }}
                  >
                    {m.provider}
                  </span>
                  <p className="text-[12px] text-[#6B7280] mb-4 leading-snug">{m.desc}</p>
                  <Link
                    href="/marketplace"
                    className="text-[12px] font-semibold text-[#E8521A] hover:underline"
                  >
                    Chat →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 3: Built for every builder ─────────────── */}
        <section className="py-14 bg-[#F5F4F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Built for every builder</h2>
              <p className="text-[#6B7280] text-sm mt-1">Whether you&apos;re just starting out or deploying at scale</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUILDER_CARDS.map((c) => (
                <div key={c.title} className="rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">{c.title}</h3>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 4: Browse by AI Lab ─────────────────────── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Browse by AI Lab</h2>
              <p className="text-[#6B7280] text-sm mt-1">11 leading AI research labs</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {AI_LABS.map((lab) => (
                <Link
                  key={lab.name}
                  href="/marketplace"
                  className="rounded-2xl bg-white border border-[#E5E5E5] p-4 hover:shadow-md transition flex items-center gap-3"
                >
                  <span className="text-2xl">{lab.emoji}</span>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{lab.name}</p>
                    <p className="text-[12px] text-[#6B7280]">{lab.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 5: Comparison Table ─────────────────────── */}
        <section className="py-14 bg-[#F5F4F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Flagship Model Comparison</h2>
              <p className="text-[#6B7280] text-sm mt-1">Side-by-side comparison of the best models</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-x-auto">
              <table className="w-full min-w-[640px] text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] text-[#6B7280] text-left">
                    <th className="px-4 py-3 font-semibold">Model</th>
                    <th className="px-4 py-3 font-semibold">Lab</th>
                    <th className="px-4 py-3 font-semibold">Context</th>
                    <th className="px-4 py-3 font-semibold">Speed</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr
                      key={row.model}
                      className={`border-b border-[#F5F4F0] hover:bg-[#FAFAFA] transition ${i === COMPARISON_TABLE.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-4 py-3 font-semibold text-[#1A1A1A]">{row.model}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.lab}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.context}</td>
                      <td className="px-4 py-3">{row.speed}</td>
                      <td className="px-4 py-3 font-mono text-[#1A1A1A]">{row.price}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#F5F4F0] text-[#374151] px-2 py-0.5 rounded-full text-[11px] font-medium">
                          {row.bestFor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─ Section 6: Trending This Week ───────────────────── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Trending This Week</h2>
              <p className="text-[#6B7280] text-sm mt-1">What builders are using right now</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRENDING.map((t) => (
                <div key={t.name} className="rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-[#E8521A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      #{t.rank}
                    </span>
                    <span className="text-[11px] text-[#E8521A] font-semibold">🔥 trending</span>
                  </div>
                  <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">{t.name}</p>
                  <p className="text-[12px] text-[#6B7280] mb-3">{t.provider}</p>
                  <span className="bg-[#F5F4F0] text-[#374151] text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {t.useCase}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 7: Find Models by Budget ───────────────── */}
        <section className="py-14 bg-[#F5F4F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Find Models by Budget</h2>
              <p className="text-[#6B7280] text-sm mt-1">Every budget has great options</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BUDGET_TIERS.map((b) => (
                <div key={b.tier} className="rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">{b.tier}</p>
                  <p className="text-[13px] text-[#6B7280] mb-3">{b.desc}</p>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{b.models}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 8: Quick-Start by Use Case ─────────────── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Quick-Start by Use Case</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {USE_CASES.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => startQuiz(u.label)}
                  className="rounded-2xl bg-white border border-[#E5E5E5] p-4 hover:shadow-md hover:border-[#E8521A] transition text-left group"
                >
                  <div className="text-3xl mb-3">{u.icon}</div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] mb-2">{u.label}</p>
                  <span className="text-[12px] text-[#E8521A] font-medium group-hover:underline">→ Find models</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 9: Newsletter CTA ───────────────────────── */}
        <section className="py-16 bg-[#0F0F0F]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-white mb-3">Stay ahead of AI</h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">
              Get weekly model updates, use case guides, and exclusive comparisons.
            </p>
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#6B7280] rounded-full px-4 py-2.5 text-[14px] focus:outline-none focus:border-white/40 transition"
              />
              <button
                type="submit"
                className="bg-[#E8521A] text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-[#d04415] transition whitespace-nowrap"
              >
                Subscribe →
              </button>
            </form>
            <p className="text-[#6B7280] text-[12px] mt-4">No spam · Unsubscribe anytime</p>
          </div>
        </section>

      </div>
    </>
  );
}
