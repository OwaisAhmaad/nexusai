'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

/* ── Types ─────────────────────────────────────────────────── */
type View = 'landing' | 'quiz';
type Step = 1 | 2 | 3;

interface OnboardingData {
  task: string;
  experience: string;
  budget: string;
}

/* ── Static data ────────────────────────────────────────────── */
const QUICK_PILLS = [
  { label: 'Recruiting', icon: '👥' },
  { label: 'Create a prototype', icon: '🎯' },
  { label: 'Build a business', icon: '🏢' },
  { label: 'Help me learn', icon: '📚' },
  { label: 'Research', icon: '🔬' },
];

const TASK_ICONS = [
  { label: 'Create image',      icon: '🎨' },
  { label: 'Generate Audio',    icon: '🎵' },
  { label: 'Create video',      icon: '🎬' },
  { label: 'Create slides',     icon: '📊' },
  { label: 'Create Infographs', icon: '📈' },
  { label: 'Create quiz',       icon: '❓' },
  { label: 'Create Flashcards', icon: '🗂️' },
  { label: 'Create Mind map',   icon: '🧠' },
  { label: 'Analyze Data',      icon: '📉' },
  { label: 'Write content',     icon: '✍️' },
  { label: 'Code Generation',   icon: '💻' },
  { label: 'Document Analysis', icon: '📄' },
  { label: 'Translate',         icon: '🌐' },
];

const QUIZ_TASKS = [
  { value: 'recruiting',        label: 'Recruiting',          icon: '👥' },
  { value: 'prototype',         label: 'Create a prototype',  icon: '🎯' },
  { value: 'business',          label: 'Build a business',    icon: '🏢' },
  { value: 'learning',          label: 'Help me learn',       icon: '📚' },
  { value: 'research',          label: 'Research',            icon: '🔬' },
  { value: 'content',           label: 'Create content',      icon: '✍️' },
  { value: 'coding',            label: 'Code something',      icon: '💻' },
  { value: 'analysis',          label: 'Analyze data',        icon: '📊' },
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner',   label: 'Beginner',        sub: 'Never used AI before',       icon: '🌱' },
  { value: 'some',       label: 'Some experience', sub: 'Used ChatGPT or similar',    icon: '😊' },
  { value: 'developer',  label: 'Developer',       sub: 'I can write code',           icon: '💻' },
  { value: 'researcher', label: 'AI researcher',   sub: 'Deep technical knowledge',   icon: '🔬' },
];

const BUDGET_OPTIONS = [
  { value: 'free',     label: 'Free',         sub: 'Open-source only',        icon: '🆓' },
  { value: 'cheap',    label: 'Cheap',        sub: 'Under $10 / month',       icon: '💰' },
  { value: 'balanced', label: 'Balanced',     sub: 'Best value for money',    icon: '⚖️' },
  { value: 'best',     label: 'Best quality', sub: 'Performance over cost',   icon: '🏆' },
];

const STATS = [
  { value: '525+',  label: 'AI Models' },
  { value: '82K',   label: 'Builders' },
  { value: '28',    label: 'AI Labs' },
  { value: '4.8 ⭐', label: 'Avg Rating' },
];

/* ── Page component ─────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const [view, setView]           = useState<View>('landing');
  const [step, setStep]           = useState<Step>(1);
  const [textInput, setTextInput] = useState('');
  const [data, setData]           = useState<Partial<OnboardingData>>({});
  const [going, setGoing]         = useState(false);

  /* helpers */
  function startQuiz(task?: string) {
    setData(task ? { task } : {});
    setView('quiz');
    setStep(task ? 2 : 1);   // if task pre-set skip step 1
  }

  function finish(budget: string) {
    const final: OnboardingData = {
      task:       data.task       ?? 'general AI assistance',
      experience: data.experience ?? 'Some experience',
      budget,
    };
    sessionStorage.setItem('nexusai_onboarding', JSON.stringify(final));
    setGoing(true);
    setTimeout(() => router.push('/chat-hub'), 1600);
  }

  /* ── Transition overlay ── */
  if (going) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-[3px] border-[#E8521A] border-t-transparent animate-spin mx-auto mb-5" />
          <p className="text-[#1A1A1A] font-bold text-xl">Taking you to your personalised hub…</p>
          <p className="text-[#6B7280] text-sm mt-1">Setting up your experience ✨</p>
        </div>
      </div>
    );
  }

  /* ── Quiz ── */
  if (view === 'quiz') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {([1, 2, 3] as Step[]).map((n) => (
              <div
                key={n}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= n ? 'bg-[#E8521A]' : 'bg-[#E5E5E5]'}`}
              />
            ))}
          </div>

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
    );
  }

  /* ── Landing ── */
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0]">

      {/* Hero */}
      <section className="pt-14 pb-8 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] mb-4 leading-tight tracking-tight">
            Find your perfect AI model<br className="hidden sm:block" /> with guided discovery
          </h1>
          <p className="text-[#6B7280] text-[17px] mb-8 max-w-xl mx-auto leading-relaxed">
            You don&apos;t need to know anything about AI to get started. Just click the box below — we&apos;ll do the rest together.&nbsp;✨
          </p>

          {/* Input box */}
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (textInput.trim()) startQuiz(textInput.trim());
            }}
            className="max-w-2xl mx-auto mb-4"
          >
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm px-4 py-3 flex items-center gap-3 focus-within:border-[#E8521A]/40 transition">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Click here and type anything — or just say hi..."
                className="flex-1 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-[#E8521A] text-white px-5 py-2 rounded-full font-bold text-[13px] hover:bg-[#d04415] transition whitespace-nowrap flex-shrink-0"
              >
                Let&apos;s go →
              </button>
            </div>
          </form>

          {/* Quick pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {QUICK_PILLS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => startQuiz(p.label)}
                className="flex items-center gap-1.5 bg-white border border-[#E5E5E5] px-3.5 py-1.5 rounded-full text-[13px] text-[#374151] hover:border-[#E8521A] hover:text-[#E8521A] transition font-medium"
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Task icons grid */}
          <div className="max-w-3xl mx-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 mb-12">
            {TASK_ICONS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => startQuiz(t.label)}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#E8521A] hover:shadow-sm transition group"
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-[10px] font-medium text-[#6B7280] leading-tight text-center group-hover:text-[#E8521A] transition">
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-[#1A1A1A]">{s.value}</p>
                <p className="text-[12px] text-[#9CA3AF] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

