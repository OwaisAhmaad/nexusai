'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MediaToolbar } from '@/components/MediaToolbar';

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

const TAB_SUGGESTIONS: Record<string, string[]> = {
  'Recruiting': [
    'Monitor job postings at target companies',
    'Benchmark salary for a specific role',
    'Build a hiring pipeline tracker',
    'Research a candidate before an interview',
    'Build an interactive talent market map',
  ],
  'Create a prototype': [
    'Build a space exploration timeline app',
    'Create a real-time stock market tracker',
    'Prototype an AI chatbot demo application',
    'Create a project management Kanban board',
  ],
  'Build a business': [
    'Write a business plan for my SaaS idea',
    'Analyse my target market and competitors',
    'Create financial projections for Year 1',
    'Draft investor pitch deck outline',
  ],
  'Help me learn': [
    'Explain machine learning in plain English',
    'Create a 30-day Python learning plan',
    'Summarise this research paper for me',
    'Quiz me on JavaScript fundamentals',
  ],
  'Research': [
    'Summarise the latest AI research papers',
    'Compare GPT-5 vs Claude Opus 4.6',
    'Find open-source alternatives to Notion',
    'Research market size for AI tools',
  ],
};

const TAB_PILLS = ['Recruiting', 'Create a prototype', 'Build a business', 'Help me learn', 'Research'];

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
  { icon: '💬', title: 'Guided Discovery Chat',    desc: 'Tell us your goal and we\'ll recommend the best models for your use case, automatically.' },
  { icon: '⚡', title: 'Prompt Engineering Guide', desc: 'Learn the principles and techniques to get the best output from any AI model.' },
  { icon: '🤖', title: 'Agent Builder',            desc: 'Build your own AI agents with custom tools, configuration, and memory.' },
  { icon: '💰', title: 'Flexible Pricing',         desc: 'Every plan is pay-as-you-go with no hidden fees. Only pay for what you actually use.' },
  { icon: '⭐', title: 'User Reviews & Ratings',   desc: 'Real reviews from real builders to help you choose which models to use.' },
  { icon: '📰', title: 'Research Feed',            desc: 'Stay on top of AI breakthroughs, model releases, and benchmarks — all in one place.' },
];

const AI_LABS = [
  { name: 'OpenAI',     color: 'bg-green-500',  count: '9 models'  },
  { name: 'Anthropic',  color: 'bg-violet-500', count: '8 models'  },
  { name: 'Google',     color: 'bg-blue-500',   count: '6 models'  },
  { name: 'Meta',       color: 'bg-sky-500',    count: '4 models'  },
  { name: 'Mistral AI', color: 'bg-amber-500',  count: '3 models'  },
  { name: 'DeepSeek',   color: 'bg-indigo-500', count: '4 models'  },
  { name: 'xAI',        color: 'bg-gray-700',   count: '2 models'  },
  { name: 'Alibaba',    color: 'bg-orange-500', count: '3 models'  },
  { name: 'NVIDIA',     color: 'bg-green-600',  count: '2 models'  },
  { name: 'GLM',        color: 'bg-blue-600',   count: '2 models'  },
  { name: 'Moonshot',   color: 'bg-purple-500', count: '2 models'  },
];

const COMPARISON_TABLE = [
  { model: 'GPT-5',             lab: 'OpenAI',    context: '256K', inputPrice: '$3.00',  outputPrice: '$15.00', multimodal: true,  speed: 3, bestFor: 'Reasoning'    },
  { model: 'Claude Opus 4.6',   lab: 'Anthropic', context: '200K', inputPrice: '$2.00',  outputPrice: '$10.00', multimodal: false, speed: 2, bestFor: 'Analysis'     },
  { model: 'Claude Haiku 4.5',  lab: 'Anthropic', context: '200K', inputPrice: '$0.08',  outputPrice: '$0.40',  multimodal: false, speed: 3, bestFor: 'Lightweight'  },
  { model: 'Gemini 3.1 Pro',    lab: 'Google',    context: '2M',   inputPrice: '$1.25',  outputPrice: '$5.00',  multimodal: true,  speed: 2, bestFor: 'Multimodal'   },
  { model: 'Gemini 3 Flash',    lab: 'Google',    context: '1M',   inputPrice: '$0.10',  outputPrice: '$0.40',  multimodal: true,  speed: 3, bestFor: 'Fast & cheap' },
  { model: 'Grok 2',            lab: 'xAI',       context: '128K', inputPrice: '$2.00',  outputPrice: '$10.00', multimodal: false, speed: 2, bestFor: 'Real-time'    },
  { model: 'Llama 4',           lab: 'Meta',      context: '128K', inputPrice: 'Free',   outputPrice: 'Free',   multimodal: true,  speed: 2, bestFor: 'Open source'  },
  { model: 'DeepSeek R2',       lab: 'DeepSeek',  context: '64K',  inputPrice: '$0.14',  outputPrice: '$0.28',  multimodal: false, speed: 2, bestFor: 'Math/Code'    },
  { model: 'GPT-5 Turbo',       lab: 'OpenAI',    context: '128K', inputPrice: '$1.00',  outputPrice: '$4.00',  multimodal: true,  speed: 3, bestFor: 'Speed'        },
  { model: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K', inputPrice: '$0.60',  outputPrice: '$3.00',  multimodal: false, speed: 3, bestFor: 'Balance'      },
  { model: 'Mistral Large',     lab: 'Mistral',   context: '128K', inputPrice: '$2.00',  outputPrice: '$6.00',  multimodal: false, speed: 2, bestFor: 'European'     },
  { model: 'o4-mini',           lab: 'OpenAI',    context: '128K', inputPrice: '$0.15',  outputPrice: '$0.60',  multimodal: true,  speed: 3, bestFor: 'Reasoning'    },
];

const TRENDING = [
  { badge: 'Just Released', badgeColor: 'bg-green-100 text-green-700',   title: 'Claude Opus 4.6 & Sonnet 4.6 — Thought Signatures', desc: 'Flagship reasoning with chain-of-thought visibility, setting new benchmarks in coding and analysis tasks.', source: 'Anthropic Blog' },
  { badge: 'Just Released', badgeColor: 'bg-blue-100 text-blue-700',     title: 'GPT-5.4 — fastest agent use yet', desc: 'Blinding tool-use, agentic apps, and flow orchestration with drastically improved reasoning efficiency.', source: 'OpenAI Blog' },
  { badge: 'Open Source',   badgeColor: 'bg-purple-100 text-purple-700', title: 'Grok-4-Flash — 4 Agent Architecture', desc: 'xAI releases Grok-4 with a novel 4-agent tree-of-thought architecture for parallel reasoning tasks.', source: 'xAI Research' },
  { badge: 'Data Note',     badgeColor: 'bg-amber-100 text-amber-700',   title: 'Llama & Moonshot — 400B Local', desc: "Meta's 400B local model challenges cloud-only assumptions and brings enterprise inference on-premise.", source: 'Meta AI' },
  { badge: 'Gemini',        badgeColor: 'bg-blue-100 text-blue-700',     title: 'Gemini 3 Pro — Frontier Coding Agent', desc: "Google's coding agent integrates directly with 2026+ codebases with MCP protocol out of the box.", source: 'Google DeepMind' },
  { badge: 'Best Now',      badgeColor: 'bg-orange-100 text-orange-700', title: 'DeepSeek V3 — Cheapest Frontier', desc: 'DeepSeek delivers GPT-5-level coding at 10× lower cost, redefining frontier model economics.', source: 'DeepSeek AI' },
];

const BUDGET_TIERS = [
  { icon: '🆓', tier: 'Free & Open Source', desc: 'Open-source models with no API costs',        models: 'Llama 4, DeepSeek R2, Mistral 7B',        bg: 'bg-blue-50   border-blue-100'   },
  { icon: '💰', tier: 'Budget — Under $0.50/M', desc: 'Low-cost APIs for high-volume tasks',     models: 'GPT-4.1-mini, Gemini Flash, Claude Haiku', bg: 'bg-green-50  border-green-100'  },
  { icon: '⚖️', tier: 'Standard — ~$1–5/M',     desc: 'Best value for production workloads',    models: 'GPT-5, Claude Sonnet, Gemini Pro',         bg: 'bg-orange-50 border-orange-100' },
  { icon: '🏆', tier: 'Premium — ~$1–50/M',     desc: 'Top performance for complex tasks',       models: 'GPT-5, Claude Opus 4.6, Gemini Ultra',    bg: 'bg-purple-50 border-purple-100' },
];

const USE_CASES = [
  { label: 'Code Generation',            icon: '💻', desc: 'GPT-5, Claude Opus 4.6, Gemini Pro',   value: 'coding'    },
  { label: 'Image Generation',           icon: '🎨', desc: 'DALL-E 3, Midjourney, Stable Diff',    value: 'vision'    },
  { label: 'AI Agents',                  icon: '🤖', desc: 'GPT-5, Claude, Gemini agents',         value: 'coding'    },
  { label: 'Document Analysis',          icon: '📄', desc: 'Claude, GPT-4, Gemini with PDFs',      value: 'analysis'  },
  { label: 'Video Generation',           icon: '🎬', desc: 'Sora, Runway, Pika Labs models',       value: 'vision'    },
  { label: 'Video & Audio',              icon: '🎵', desc: 'ElevenLabs, Whisper, Suno AI',         value: 'real-time' },
  { label: 'Multilingual / Translation', icon: '🌐', desc: 'GPT-5, DeepL, Seamless, NLLB',        value: 'writing'   },
  { label: 'Math & Research',            icon: '🧮', desc: 'o4-mini, Gemini, DeepSeek R2',         value: 'research'  },
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
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('Recruiting');
  const [email, setEmail] = useState('');

  function startQuiz(_task?: string) {
    router.push('/chat-hub');
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
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
                router.push('/chat-hub');
              }}
              className="max-w-2xl mx-auto mb-4"
            >
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-md focus-within:border-[#E8521A]/40 transition overflow-hidden">
                {/* Top row — input + status icons */}
                <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onFocus={() => router.push('/chat-hub')}
                    placeholder="Listening... speak now"
                    className="flex-1 text-[15px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
                  />
                  {/* Star + record indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#E8521A] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <div className="h-px bg-[#F0EEE9] mx-3" />
                {/* Bottom toolbar */}
                <MediaToolbar
                  onVoiceTranscript={(t) => setTextInput(t)}
                  onAttachFile={(f) => console.log('file:', f.name)}
                  onAttachImage={(_, url) => console.log('image:', url)}
                  showAgentPill
                  submitLabel="Let's go"
                  onSubmit={() => router.push('/chat-hub')}
                />
              </div>
            </form>

            {/* Tab pills + suggestions */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-[#E5E5E5] overflow-x-auto scrollbar-hide">
                  {TAB_PILLS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-shrink-0 px-4 py-2.5 text-[13px] font-semibold transition whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-[#1A1A1A] text-white'
                          : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F4F0]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {/* Suggestions list */}
                <div className="py-1">
                  {(TAB_SUGGESTIONS[activeTab] ?? []).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setTextInput(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F5F4F0] transition text-left"
                    >
                      <svg className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                      </svg>
                      {suggestion}
                    </button>
                  ))}
                </div>
                {/* Footer hint */}
                <div className="border-t border-[#F5F4F0] px-4 py-2 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="text-[11px] text-[#9CA3AF]">Click any suggestion to fill the search box, then press <strong>Let&apos;s go</strong></span>
                </div>
              </div>
            </div>

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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Featured Models</h2>
              <Link href="/marketplace" className="text-[13px] font-semibold text-[#E8521A] hover:underline">Browse all →</Link>
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
            <div className="mb-10">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Built for every builder</h2>
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Browse by AI Lab</h2>
              <Link href="/marketplace" className="text-[13px] font-semibold text-[#E8521A] hover:underline">See all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {AI_LABS.map((lab) => (
                <Link
                  key={lab.name}
                  href="/marketplace"
                  className="rounded-2xl bg-white border border-[#E5E5E5] p-4 hover:shadow-md transition flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0 ${lab.color}`}>
                    {lab.name[0]}
                  </div>
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-[#1A1A1A]">Flagship Model Comparison</h2>
              <Link href="/marketplace" className="text-[13px] font-semibold text-[#E8521A] hover:underline">Compare all →</Link>
            </div>
            <p className="text-[#6B7280] text-sm mb-8">Side-by-side of the leading models. Input/Output prices per 1M tokens.</p>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-x-auto">
              <table className="w-full min-w-[780px] text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] text-[#6B7280] text-left">
                    <th className="px-4 py-3 font-semibold">Model</th>
                    <th className="px-4 py-3 font-semibold">Lab</th>
                    <th className="px-4 py-3 font-semibold">Context</th>
                    <th className="px-4 py-3 font-semibold">Input /1M</th>
                    <th className="px-4 py-3 font-semibold">Output /1M</th>
                    <th className="px-4 py-3 font-semibold text-center">Multimodal</th>
                    <th className="px-4 py-3 font-semibold">Speed</th>
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
                      <td className="px-4 py-3 font-mono text-[#374151]">{row.inputPrice}</td>
                      <td className="px-4 py-3 font-mono text-[#374151]">{row.outputPrice}</td>
                      <td className="px-4 py-3 text-center">{row.multimodal ? <span className="text-green-500 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                      <td className="px-4 py-3">
                        <span className="flex gap-0.5">
                          {[1,2,3].map(n => <span key={n} className={`w-2 h-2 rounded-full ${n <= row.speed ? 'bg-[#E8521A]' : 'bg-[#E5E5E5]'}`} />)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#F5F4F0] text-[#374151] px-2 py-0.5 rounded-full text-[11px] font-medium">{row.bestFor}</span>
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#1A1A1A]">🔥 Trending This Week</h2>
              <Link href="/research" className="text-[13px] font-semibold text-[#E8521A] hover:underline">View research feed →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRENDING.map((t) => (
                <div key={t.title} className="rounded-2xl bg-white border border-[#E5E5E5] p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{t.source}</span>
                  </div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] mb-2 leading-snug">{t.title}</p>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed">{t.desc}</p>
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
                <div key={b.tier} className={`rounded-2xl border p-5 hover:shadow-md transition ${b.bg}`}>
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">{b.tier}</p>
                  <p className="text-[13px] text-[#6B7280] mb-3">{b.desc}</p>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed mb-4">{b.models}</p>
                  <Link href="/marketplace" className="text-[12px] font-semibold text-[#E8521A] hover:underline">Models available →</Link>
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
                  key={u.label}
                  type="button"
                  onClick={() => startQuiz(u.label)}
                  className="rounded-2xl bg-white border border-[#E5E5E5] p-4 hover:shadow-md hover:border-[#E8521A] transition text-left group"
                >
                  <div className="text-3xl mb-3">{u.icon}</div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">{u.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mb-3 leading-snug">{u.desc}</p>
                  <span className="text-[12px] text-[#E8521A] font-medium group-hover:underline">→ Find models</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─ Section 9: Newsletter CTA ───────────────────────── */}
        <section className="py-20 bg-[#0F0F0F]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest mb-5">YOUR MODEL OF THE WEEK</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              New models drop every week.<br />Don&apos;t miss a release.
            </h2>
            <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed max-w-lg mx-auto">
              Get a curated weekly digest: new model releases, benchmark comparisons, pricing changes, and prompt engineering tips — straight to your inbox.
            </p>
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#6B7280] rounded-full px-4 py-2.5 text-[14px] focus:outline-none focus:border-white/40 transition"
              />
              <button
                type="submit"
                className="bg-[#E8521A] text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-[#d04415] transition whitespace-nowrap"
              >
                Subscribe free →
              </button>
            </form>
            <p className="text-[#6B7280] text-[12px]">No spam. Unsubscribe any time. Trusted by 82K+ builders.</p>
          </div>
        </section>

      </div>
    </>
  );
}
