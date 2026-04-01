'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/types';

/* ─── Types ─────────────────────────────────────────────── */
type MessageKind =
  | 'assistant'
  | 'user-pill'
  | 'use-case-cards'
  | 'experience-cards'
  | 'model-cards'
  | 'faq-chips'
  | 'prompt-box'
  | 'thinking';

interface ChatMessage {
  id: string;
  kind: MessageKind;
  text?: string;
  payload?: unknown;
}

interface RecommendedModel {
  id: string;
  name: string;
  lab: string;
  inputPrice: number;
  outputPrice: number;
  rating: number;
  speed: string;
  category: string;
  tags: string[];
  reasoning: string;
  bestFor?: string;
}

/* ─── Data ───────────────────────────────────────────────── */
const USE_CASES = [
  { value: 'coding',           label: 'Coding & Dev',       icon: '👨‍💻', sub: 'Code, review, debug' },
  { value: 'writing',          label: 'Writing',             icon: '✍️',  sub: 'Content, blogs, copy' },
  { value: 'analysis',         label: 'Data Analysis',       icon: '📊', sub: 'Insights, reports' },
  { value: 'customer-support', label: 'Customer Support',    icon: '🎧', sub: 'Chatbots, helpdesk' },
  { value: 'research',         label: 'Research',            icon: '🔬', sub: 'Summaries, literature' },
  { value: 'real-time',        label: 'Real-time Apps',      icon: '⚡', sub: 'Low latency, speed' },
  { value: 'vision',           label: 'Vision / Images',     icon: '🖼️', sub: 'Image analysis, gen' },
  { value: 'math',             label: 'Math & Science',      icon: '🧮', sub: 'Complex reasoning' },
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner',    label: 'Complete beginner', icon: '🐣', sub: 'Never used AI before' },
  { value: 'some',        label: 'Some experience',   icon: '😊', sub: 'Used ChatGPT etc.' },
  { value: 'developer',   label: 'Developer',         icon: '💻', sub: 'I can write code' },
  { value: 'researcher',  label: 'AI researcher',     icon: '🔬', sub: 'Deep technical knowledge' },
];

const BUDGET_LEVELS = [
  { value: 'low',    label: 'Budget-friendly', icon: '💰', sub: 'Cheapest options first' },
  { value: 'medium', label: 'Balanced',        icon: '⚖️', sub: 'Best value for money' },
  { value: 'high',   label: 'Best quality',    icon: '🏆', sub: 'Performance over cost' },
];

const MODEL_FAQ: Record<string, string[]> = {
  default: [
    '✨ What is it best at?',
    '⚡ How fast is it and what affects latency?',
    '💰 What does it cost at small vs large scale?',
    '🔧 What input/output formats work best?',
    '📏 How does context window impact results?',
    '🔄 How does it compare to alternatives?',
    '🔒 What about privacy and data safety?',
    '✍️ Show a few great starter prompts.',
  ],
};

const SPEED_LABEL: Record<string, string> = {
  'very-fast': 'Fast',
  fast: 'Fast',
  medium: 'Balanced',
  slow: 'Thoughtful',
};

const LAB_TAG: Record<string, string> = {
  OpenAI: 'Flagship',
  Anthropic: 'Flagship',
  Google: 'Multimodal',
  Meta: 'Open-source',
  'Mistral AI': 'European',
  DeepSeek: 'Reasoning',
};

function formatPrice(p: number) {
  if (p === 0) return 'N/A';
  if (p < 0.001) return `$${(p * 1000).toFixed(2)}/1M tk`;
  return `$${(p * 1000).toFixed(1)}/1M tk`;
}

/* ─── Sub-components ─────────────────────────────────────── */
function DiamondIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5L16.5 9L9 16.5L1.5 9L9 1.5Z"
        fill="#E8521A"
        stroke="#E8521A"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="white" />
    </svg>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#E8521A]/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function AssistantBubble({ text, label }: { text: string; label?: string }) {
  return (
    <div className="flex items-start gap-3 max-w-xl">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm mt-0.5">
        <DiamondIcon size={16} />
      </div>
      <div>
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#E5E5E5]">
          <p
            className="text-[14px] text-[#1A1A1A] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        {label && (
          <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">NexusAI Hub · {label}</p>
        )}
      </div>
    </div>
  );
}

function UserPill({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-[#E8521A] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
        {text}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export function ChatHomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      kind: 'assistant',
      text: `Hey! 👋 I'm <strong>NexusAI Hub</strong> — I'll help you find the perfect AI model for what you're building.<br/><br/>Let's start with a quick question:`,
    },
    { id: 'm1', kind: 'use-case-cards' },
  ]);

  const [selectedUseCase, setSelectedUseCase]     = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedBudget, setSelectedBudget]       = useState('');
  const [selectedModel, setSelectedModel]         = useState<RecommendedModel | null>(null);
  const [chatInput, setChatInput]                 = useState('');
  const [loading, setLoading]                     = useState(false);
  const [step, setStep]                           = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const uid = () => Math.random().toString(36).slice(2);

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }

  function addMessages(newMsgs: ChatMessage[]) {
    setMessages((prev) => [...prev, ...newMsgs]);
    scrollToBottom();
  }

  /* Step 1 — use case selected */
  function handleUseCaseSelect(uc: typeof USE_CASES[0]) {
    if (selectedUseCase) return;
    setSelectedUseCase(uc.value);
    addMessages([
      { id: uid(), kind: 'user-pill', text: `${uc.icon} ${uc.label}` },
      {
        id: uid(),
        kind: 'assistant',
        text: `Perfect — <strong>"${uc.label}"</strong>. That helps a lot! 💡<br/><br/>One more:`,
      },
      { id: uid(), kind: 'experience-cards' },
    ]);
    setStep(1);
  }

  /* Step 2 — experience selected */
  function handleExperienceSelect(exp: typeof EXPERIENCE_LEVELS[0]) {
    if (selectedExperience) return;
    setSelectedExperience(exp.value);
    addMessages([
      { id: uid(), kind: 'user-pill', text: `${exp.icon} ${exp.label}` },
      {
        id: uid(),
        kind: 'assistant',
        text: `Got it! And last one — what matters most to you?`,
      },
      { id: uid(), kind: 'budget-cards' as MessageKind },
    ]);
    setStep(2);
  }

  /* Step 3 — budget selected → fetch recommendations */
  async function handleBudgetSelect(b: typeof BUDGET_LEVELS[0]) {
    if (selectedBudget) return;
    setSelectedBudget(b.value);
    addMessages([
      { id: uid(), kind: 'user-pill', text: `${b.icon} ${b.label}` },
      { id: uid(), kind: 'thinking' },
    ]);
    setStep(3);
    setLoading(true);

    try {
      const res = await apiFetch<ApiResponse<{ recommendations: RecommendedModel[] }>>(
        '/api/v1/models/recommend',
        {
          method: 'POST',
          body: JSON.stringify({ useCase: selectedUseCase, budget: b.value, speed: 'any' }),
        },
      );
      const models = res.data.recommendations;

      setMessages((prev) => [
        ...prev.filter((m) => m.kind !== 'thinking'),
        {
          id: uid(),
          kind: 'assistant',
          text: `Most popular models on NexusAI right now:`,
          payload: models,
        } as ChatMessage,
        { id: uid(), kind: 'model-cards', payload: models },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.kind !== 'thinking'),
        {
          id: uid(),
          kind: 'assistant',
          text: `⚠️ Couldn't reach the API. Make sure the backend is running at <code class="bg-gray-100 px-1 rounded">localhost:3001</code>.`,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  /* Step 4 — model selected → FAQ chips */
  function handleModelSelect(model: RecommendedModel) {
    if (selectedModel) return;
    setSelectedModel(model);
    const faqs = MODEL_FAQ.default;
    addMessages([
      { id: uid(), kind: 'user-pill', text: `Proceed with ${model.name}` },
      {
        id: uid(),
        kind: 'assistant',
        text: `Before we pick a version of <strong>${model.name}</strong>, here are helpful questions people ask. Tap any to learn more, or continue to select a version. 👇`,
      },
      { id: uid(), kind: 'faq-chips', payload: { model, faqs } },
    ]);
    setStep(4);
  }

  /* FAQ chip tapped */
  function handleFaqTap(question: string) {
    addMessages([
      { id: uid(), kind: 'user-pill', text: question },
      {
        id: uid(),
        kind: 'assistant',
        text: `Great question! For <strong>${selectedModel?.name}</strong>: ${getFaqAnswer(question, selectedModel)}`,
      },
    ]);
  }

  function getFaqAnswer(q: string, m: RecommendedModel | null): string {
    if (!m) return 'Please select a model first.';
    if (q.includes('best at'))       return m.bestFor ?? `${m.name} excels at ${m.tags.slice(0, 3).join(', ')} tasks.`;
    if (q.includes('fast'))          return `${m.name} is rated <strong>${SPEED_LABEL[m.speed] ?? m.speed}</strong> — ideal for ${m.speed === 'very-fast' || m.speed === 'fast' ? 'real-time applications' : 'quality-focused tasks'}.`;
    if (q.includes('cost'))          return `Input: <strong>${formatPrice(m.inputPrice)}</strong>, Output: <strong>${formatPrice(m.outputPrice)}</strong>. Very competitive at scale.`;
    if (q.includes('context'))       return `Larger context windows let ${m.name} process more text per request, reducing the need for chunking long documents.`;
    if (q.includes('compare'))       return `${m.name} by ${m.lab} rated <strong>★${m.rating}</strong>. It's among the top-ranked in its category.`;
    if (q.includes('privacy'))       return `${m.lab} follows strict data policies. For sensitive workloads, consider self-hosted open-source alternatives.`;
    if (q.includes('starter prompts')) return `Try: <em>"You are a helpful ${m.tags[0]} assistant. Help me with..."</em> — simple, effective, and easy to iterate on.`;
    return `${m.name} supports a variety of input/output formats including text, structured JSON, and (where applicable) images.`;
  }

  /* Proceed to model detail */
  function handleProceedWithModel() {
    if (!selectedModel) return;
    addMessages([
      {
        id: uid(),
        kind: 'assistant',
        text: `✅ Great choice! Opening <strong>${selectedModel.name}</strong> details...`,
      },
    ]);
    setTimeout(() => {
      window.location.href = `/models/${selectedModel.id}`;
    }, 600);
  }

  /* Free-form chat input */
  async function handleChatSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = chatInput.trim();
    if (!val) return;
    setChatInput('');
    addMessages([
      { id: uid(), kind: 'user-pill', text: val },
      {
        id: uid(),
        kind: 'assistant',
        text: `Thanks for your message! 😊 I'm NexusAI Hub — your AI model advisor. Use the options above to find your perfect model, or visit the <a href="/marketplace" class="text-[#E8521A] font-semibold underline underline-offset-2">Marketplace</a> to browse all models.`,
      },
    ]);
  }

  /* ─── Render a single message ─────────────────────────── */
  function renderMessage(msg: ChatMessage) {
    switch (msg.kind) {
      case 'assistant':
        return (
          <AssistantBubble
            key={msg.id}
            text={msg.text ?? ''}
            label={step === 0 ? 'guided setup' : step >= 3 ? 'model advisor' : 'guided setup'}
          />
        );

      case 'user-pill':
        return <UserPill key={msg.id} text={msg.text ?? ''} />;

      case 'thinking':
        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-xl">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm">
              <DiamondIcon size={16} />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#E5E5E5]">
              <ThinkingDots />
            </div>
          </div>
        );

      case 'use-case-cards':
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#E8521A] text-xs">✦</span>
                <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider">
                  Your Goal
                </span>
              </div>
              <p className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">
                What are you trying to accomplish?
              </p>
              <p className="text-[12px] text-[#E8521A] mb-3">
                Pick the best fit — you can always change it later!
              </p>
              <div className="grid grid-cols-2 gap-2">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.value}
                    type="button"
                    onClick={() => handleUseCaseSelect(uc)}
                    disabled={!!selectedUseCase}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition group ${
                      selectedUseCase === uc.value
                        ? 'border-[#E8521A] bg-[#fff0eb]'
                        : selectedUseCase
                        ? 'border-[#E5E5E5] opacity-40 cursor-not-allowed'
                        : 'border-[#E5E5E5] hover:border-[#E8521A] hover:bg-[#fff0eb] cursor-pointer'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{uc.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">{uc.label}</p>
                      <p className="text-[11px] text-[#6B7280] truncate">{uc.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">NexusAI Hub · guided setup</p>
          </div>
        );

      case 'experience-cards':
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#E8521A] text-xs">✦</span>
                <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider">
                  Your Experience
                </span>
              </div>
              <p className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">
                How comfortable are you with tech / AI?
              </p>
              <p className="text-[12px] text-[#E8521A] mb-3">
                Totally fine to be brand new — that&apos;s what I&apos;m here for!
              </p>
              <div className="grid grid-cols-2 gap-2">
                {EXPERIENCE_LEVELS.map((exp) => (
                  <button
                    key={exp.value}
                    type="button"
                    onClick={() => handleExperienceSelect(exp)}
                    disabled={!!selectedExperience}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                      selectedExperience === exp.value
                        ? 'border-[#E8521A] bg-[#fff0eb]'
                        : selectedExperience
                        ? 'border-[#E5E5E5] opacity-40 cursor-not-allowed'
                        : 'border-[#E5E5E5] hover:border-[#E8521A] hover:bg-[#fff0eb] cursor-pointer'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{exp.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">{exp.label}</p>
                      <p className="text-[11px] text-[#6B7280]">{exp.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">NexusAI Hub · guided setup</p>
          </div>
        );

      case 'budget-cards' as MessageKind:
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#E8521A] text-xs">✦</span>
                <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider">
                  Your Priority
                </span>
              </div>
              <p className="text-[14px] font-bold text-[#1A1A1A] mb-3">
                What matters most to you?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {BUDGET_LEVELS.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => handleBudgetSelect(b)}
                    disabled={!!selectedBudget || loading}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                      selectedBudget === b.value
                        ? 'border-[#E8521A] bg-[#fff0eb]'
                        : selectedBudget
                        ? 'border-[#E5E5E5] opacity-40 cursor-not-allowed'
                        : 'border-[#E5E5E5] hover:border-[#E8521A] hover:bg-[#fff0eb] cursor-pointer'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A1A1A]">{b.label}</p>
                      <p className="text-[11px] text-[#6B7280]">{b.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">NexusAI Hub · guided setup</p>
          </div>
        );

      case 'model-cards': {
        const models = msg.payload as RecommendedModel[];
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4 space-y-2">
              {models.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    i === 0 ? 'border-[#E8521A]/30 bg-[#fff8f5]' : 'border-[#E5E5E5]'
                  }`}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#F5F4F0] border border-[#E5E5E5] flex items-center justify-center text-sm font-bold text-[#6B7280]">
                    {i === 0 ? '⚡' : i === 1 ? '◆' : '○'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{m.name}</span>
                      {i === 0 && (
                        <span className="text-[9px] bg-[#E8521A] text-white px-1.5 py-0.5 rounded-full font-bold">
                          TOP PICK
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      {LAB_TAG[m.lab] ?? m.category} · {formatPrice(m.inputPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      href={`/models/${m.id}`}
                      className="flex items-center gap-1 border border-[#E5E5E5] text-[#6B7280] text-[11px] font-medium px-2.5 py-1.5 rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition"
                    >
                      <span className="text-[10px]">⊞</span> Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleModelSelect(m)}
                      disabled={!!selectedModel}
                      className="bg-[#E8521A] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#d04415] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">
              NexusAI Hub · {selectedModel ? selectedModel.name : 'model advisor'}
            </p>
          </div>
        );
      }

      case 'faq-chips': {
        const { model: faqModel, faqs } = msg.payload as { model: RecommendedModel; faqs: string[] };
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
              <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider mb-3">
                ⚡ {faqModel.name.toUpperCase()} — INSPIRATION
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {faqs.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleFaqTap(q)}
                    className="text-[12px] text-[#374151] border border-[#E5E5E5] px-2.5 py-1 rounded-full hover:border-[#E8521A] hover:text-[#E8521A] hover:bg-[#fff0eb] transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#F0EEE9] pt-3 flex items-center gap-2">
                <p className="text-[12px] text-[#6B7280] flex-1">Ready to choose a version?</p>
                <Link
                  href={`/models/${faqModel.id}`}
                  className="flex items-center gap-1 border border-[#E5E5E5] text-[#6B7280] text-[11px] font-medium px-2.5 py-1.5 rounded-full hover:border-[#1A1A1A] transition"
                >
                  <span className="text-[10px]">👁</span> View full details
                </Link>
                <button
                  type="button"
                  onClick={handleProceedWithModel}
                  className="flex items-center gap-1 border border-[#E5E5E5] text-[#6B7280] text-[11px] font-medium px-2.5 py-1.5 rounded-full hover:border-[#1A1A1A] transition"
                >
                  — Select a version
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">
              NexusAI Hub · {faqModel.name} overview
            </p>
          </div>
        );
      }

      case 'prompt-box': {
        const promptText = msg.payload as string;
        return (
          <div key={msg.id} className="max-w-xl ml-11">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[#E8521A] text-xs">✦</span>
                <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider">
                  Your AI Prompt
                </span>
              </div>
              <div className="bg-[#F5F4F0] rounded-xl p-3 mb-3">
                <p className="text-[13px] text-[#E8521A] leading-relaxed whitespace-pre-line">
                  {promptText}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-[#E8521A] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#d04415] transition"
                >
                  ▶ Run prompt
                </button>
                <button type="button" className="flex items-center gap-1.5 border border-[#E5E5E5] text-[#6B7280] text-[12px] font-medium px-3 py-1.5 rounded-full hover:border-[#1A1A1A] transition">
                  — Edit
                </button>
                <button type="button" className="flex items-center gap-1.5 border border-[#E5E5E5] text-[#6B7280] text-[12px] font-medium px-3 py-1.5 rounded-full hover:border-[#1A1A1A] transition">
                  ↻ Regenerate
                </button>
                <button type="button" className="flex items-center gap-1.5 border border-[#E5E5E5] text-[#6B7280] text-[12px] font-medium px-3 py-1.5 rounded-full hover:border-red-300 hover:text-red-500 transition">
                  ✕ Delete
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">NexusAI Hub · prompt ready</p>
          </div>
        );
      }

      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F5F4F0]">
      {/* Proceed-with-model sticky banner */}
      {selectedModel && (
        <div className="sticky top-0 z-10 flex justify-end px-4 py-2 bg-[#F5F4F0]/90 backdrop-blur-sm border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={handleProceedWithModel}
            className="bg-[#E8521A] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#d04415] transition shadow-sm"
          >
            🚀 Proceed with {selectedModel.name}
          </button>
        </div>
      )}

      {/* Chat scroll area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-6 space-y-5">
        {messages.map(renderMessage)}
        <div ref={bottomRef} />
      </div>

      {/* Bottom input bar */}
      <div className="border-t border-[#E5E5E5] bg-white px-4 sm:px-8 lg:px-16 py-3">
        <form onSubmit={handleChatSubmit}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-[#F5F4F0] rounded-2xl border border-[#E5E5E5] px-4 py-2.5 focus-within:border-[#E8521A]/40 focus-within:ring-1 focus-within:ring-[#E8521A]/20 transition">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your project, ask a question, or just say hi — I'm here to help..."
                className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-8 h-8 rounded-full bg-[#E8521A] flex items-center justify-center hover:bg-[#d04415] transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Toolbar row */}
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-1">
                {[
                  { icon: '🎙', label: 'Voice' },
                  { icon: '↑', label: 'Upload' },
                  { icon: '🖥', label: 'Screen' },
                  { icon: '📋', label: 'Clipboard' },
                  { icon: '📎', label: 'Attach' },
                  { icon: '🖼', label: 'Image' },
                  { icon: '+', label: 'More' },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F5F4F0] transition text-sm"
                    aria-label={label}
                    title={label}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/marketplace"
                  className="flex items-center gap-1 text-[11px] text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full hover:border-[#9CA3AF] transition"
                >
                  All models →
                </Link>
                <div className="flex items-center gap-1 text-[11px] text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full cursor-pointer hover:border-[#9CA3AF] transition">
                  {selectedModel?.name ?? 'GPT-5.4'}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
