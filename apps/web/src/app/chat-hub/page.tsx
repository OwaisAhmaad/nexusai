'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';

/* ── Types ─────────────────────────────────────────────────── */
interface OnboardingData {
  task: string;
  experience: string;
  budget: string;
}

type MsgKind = 'thinking' | 'assistant' | 'prompt-card' | 'user' | 'congrats';

interface ChatMsg {
  id: string;
  kind: MsgKind;
  text?: string;
  label?: string;
  payload?: string;
}

interface Model {
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google';
}

/* ── Static models list ─────────────────────────────────────── */
const MODELS: Model[] = [
  // OpenAI
  { name: 'GPT-5',         provider: 'OpenAI' },
  { name: 'GPT-5.2',       provider: 'OpenAI' },
  { name: 'GPT-5 Turbo',   provider: 'OpenAI' },
  { name: 'GPT-4.5',       provider: 'OpenAI' },
  { name: 'GPT-4.1',       provider: 'OpenAI' },
  { name: 'GPT-4.1-mini',  provider: 'OpenAI' },
  { name: 'o3',            provider: 'OpenAI' },
  { name: 'o3-mini',       provider: 'OpenAI' },
  { name: 'o4-mini',       provider: 'OpenAI' },
  // Anthropic
  { name: 'Claude Opus 4.6',    provider: 'Anthropic' },
  { name: 'Claude Opus 4.5',    provider: 'Anthropic' },
  { name: 'Claude Opus 4',      provider: 'Anthropic' },
  { name: 'Claude Sonnet 4.6',  provider: 'Anthropic' },
  { name: 'Claude Sonnet 4.5',  provider: 'Anthropic' },
  { name: 'Claude Sonnet 4',    provider: 'Anthropic' },
  { name: 'Claude Haiku 4.5',   provider: 'Anthropic' },
  { name: 'Claude Haiku 4',     provider: 'Anthropic' },
  // Google
  { name: 'Gemini 3.1 Pro',  provider: 'Google' },
  { name: 'Gemini 3 Pro',    provider: 'Google' },
  { name: 'Gemini 3 Flash',  provider: 'Google' },
  { name: 'Gemini 2.5 Pro',  provider: 'Google' },
  { name: 'Gemini 2.5 Flash', provider: 'Google' },
  { name: 'Gemini 2.0 Flash', provider: 'Google' },
];

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI:    'bg-green-500',
  Anthropic: 'bg-violet-500',
  Google:    'bg-blue-500',
};

/* ── Quick actions (right sidebar) ─────────────────────────── */
const NAV_ACTIONS = [
  { icon: '🛍️', label: 'Browse Marketplace',   href: '/marketplace' },
  { icon: '🤖', label: 'Build an Agent',        href: '/agents' },
  { icon: '📖', label: 'How to use Guide',      href: '/research' },
  { icon: '📐', label: 'Prompt Engineering',    href: '/research' },
  { icon: '💰', label: 'View Pricing',          href: '/marketplace' },
  { icon: '📊', label: 'AI Models Analysis',    href: '/marketplace' },
];

const CREATE_ACTIONS = [
  { icon: '🎨', label: 'Create image' },
  { icon: '🎵', label: 'Generate Audio' },
  { icon: '🎬', label: 'Create video' },
  { icon: '📋', label: 'Create slides' },
  { icon: '📈', label: 'Create Infographs' },
  { icon: '❓', label: 'Create quiz' },
  { icon: '🗂️', label: 'Create Flashcards' },
  { icon: '🧠', label: 'Create Mind map' },
];

const ANALYZE_ACTIONS = [
  { icon: '📉', label: 'Analyze Data' },
  { icon: '✍️', label: 'Write content' },
  { icon: '💻', label: 'Code Generation' },
  { icon: '📄', label: 'Document Analysis' },
  { icon: '🌐', label: 'Translate' },
];

const CHAT_PILLS = [
  'Use cases', 'Monitor the situation', 'Create a prototype',
  'Build a business plan', 'Create content', 'Analyze & research', 'Learn something',
];

/* ── Helpers ────────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2); }

function generatePrompt(d: OnboardingData): string {
  return `You are an expert AI assistant specialising in ${d.task}. My experience level is: ${d.experience}. Budget priority: ${d.budget}.\n\nHelp me get started with ${d.task}. Provide clear, actionable guidance tailored to my level. Start with the most impactful first steps and explain your reasoning.`;
}

function DiamondIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5L16.5 9L9 16.5L1.5 9L9 1.5Z" fill="#E8521A" stroke="#E8521A" strokeWidth="0.5" strokeLinejoin="round"/>
      <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="white"/>
    </svg>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#E8521A]/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ChatHubPage() {
  const [messages, setMessages]     = useState<ChatMsg[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [activeModel, setActiveModel] = useState('Claude Sonnet 4.6');
  const [chatInput, setChatInput]   = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptDone, setPromptDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Read sessionStorage + auto-play sequence */
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('nexusai_onboarding') : null;
    const d: OnboardingData = raw
      ? (JSON.parse(raw) as OnboardingData)
      : { task: 'general AI assistance', experience: 'Some experience', budget: 'Balanced' };
    setOnboarding(d);
    const prompt = generatePrompt(d);
    setPromptText(prompt);

    const t1 = setTimeout(() => {
      setMessages([{ id: uid(), kind: 'thinking' }]);
    }, 500);

    const t2 = setTimeout(() => {
      setMessages([
        { id: uid(), kind: 'assistant', text: 'Generating your personalised AI prompt based on your answers…', label: 'Building prompt' },
        { id: uid(), kind: 'prompt-card', payload: prompt, label: 'prompt ready' },
      ]);
    }, 2500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleRunPrompt() {
    if (promptDone) return;
    setPromptDone(true);
    setMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: promptText },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: uid(), kind: 'congrats' },
      ]);
    }, 1200);
  }

  function handleChatSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = chatInput.trim();
    if (!val) return;
    setChatInput('');
    setMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: val },
      {
        id: uid(),
        kind: 'assistant',
        text: `Great question! I'm NexusAI Hub — your AI model advisor. Use the quick actions on the right or the chat to explore AI models. Visit the <a href="/marketplace" class="text-[#E8521A] underline underline-offset-2">Marketplace</a> to browse all models.`,
        label: 'model advisor',
      },
    ]);
  }

  /* ── Render a message ── */
  function renderMsg(msg: ChatMsg) {
    switch (msg.kind) {
      case 'thinking':
        return (
          <div key={msg.id} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
              <DiamondIcon />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E5E5E5] shadow-sm">
              <ThinkingDots />
            </div>
          </div>
        );

      case 'assistant':
        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-lg">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
              <DiamondIcon />
            </div>
            <div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E5E5E5] shadow-sm">
                <p className="text-[13px] text-[#1A1A1A] leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text ?? '' }} />
              </div>
              {msg.label && <p className="text-[10px] text-[#9CA3AF] mt-1 ml-1">NexusHub · {msg.label}</p>}
            </div>
          </div>
        );

      case 'prompt-card':
        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-lg">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
              <DiamondIcon />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[#E8521A] text-xs">✦</span>
                  <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider">Your AI Prompt</span>
                </div>
                <div className="bg-[#F5F4F0] rounded-xl p-3 mb-4">
                  <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">{msg.payload}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRunPrompt}
                    disabled={promptDone}
                    className="flex items-center gap-1.5 bg-[#E8521A] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#d04415] transition disabled:opacity-40"
                  >
                    ▶ Run prompt
                  </button>
                  {[{ icon: '✎', label: 'Edit' }, { icon: '↻', label: 'Regenerate' }, { icon: '✕', label: 'Delete' }].map(({ icon, label }) => (
                    <button key={label} type="button" className="flex items-center gap-1 border border-[#E5E5E5] text-[#6B7280] text-[12px] px-3 py-1.5 rounded-full hover:border-[#1A1A1A] transition">
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-1 ml-1">NexusHub · {msg.label}</p>
            </div>
          </div>
        );

      case 'user':
        return (
          <div key={msg.id} className="flex justify-end">
            <div className="bg-[#E8521A] text-white text-[13px] font-medium px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm max-w-sm">
              {msg.text}
            </div>
          </div>
        );

      case 'congrats':
        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-lg">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
              <DiamondIcon />
            </div>
            <div>
              <div className="bg-[#F0FDF4] rounded-2xl border border-[#86EFAC] p-4">
                <p className="text-[14px] font-bold text-[#15803D] mb-1">🎓 Congratulations — you just sent your first AI prompt!</p>
                <p className="text-[12px] text-[#166534] mb-3">You now know how to guide AI to get focused, useful results.</p>
                <div className="bg-white rounded-xl p-3 border border-[#BBF7D0]">
                  <p className="text-[12px] text-[#15803D] font-medium">
                    💡 <strong>What&apos;s next: Explore AI Models</strong> — Now I&apos;ll introduce you to the models that can help with your specific goal.
                  </p>
                </div>
                <Link
                  href="/marketplace"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#E8521A] text-white text-[12px] font-bold px-4 py-2 rounded-full hover:bg-[#d04415] transition"
                >
                  Explore Models →
                </Link>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-1 ml-1">NexusHub · milestone reached 🎉</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  /* ── Layout ── */
  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F4F0] overflow-hidden">

      {/* ── Left sidebar — Models list ── */}
      <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-white border-r border-[#E5E5E5] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F0EEE9]">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">AI Models</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {MODELS.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => setActiveModel(m.name)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition ${
                activeModel === m.name
                  ? 'border-l-2 border-[#E8521A] bg-[#FFF8F5]'
                  : 'border-l-2 border-transparent hover:bg-[#F5F4F0]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PROVIDER_COLOR[m.provider]}`} />
              <div className="min-w-0">
                <p className={`text-[12px] font-medium truncate ${activeModel === m.name ? 'text-[#E8521A]' : 'text-[#374151]'}`}>{m.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{m.provider}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Center — Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white border-b border-[#E5E5E5] px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <DiamondIcon />
            <span className="text-[14px] font-bold text-[#1A1A1A]">NexusAI Hub</span>
            {onboarding && (
              <span className="text-[11px] text-[#6B7280] bg-[#F5F4F0] px-2 py-0.5 rounded-full">
                {onboarding.task}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full">
            {activeModel}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {messages.map(renderMsg)}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-[#E5E5E5] px-4 py-3 flex-shrink-0">
          <form onSubmit={handleChatSend} className="mb-2">
            <div className="flex items-center gap-2 bg-[#F5F4F0] rounded-2xl border border-[#E5E5E5] px-4 py-2.5 focus-within:border-[#E8521A]/40 transition">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your project, ask a question, or just say hi — I'm here to help…"
                className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-8 h-8 rounded-full bg-[#E8521A] flex items-center justify-center hover:bg-[#d04415] transition disabled:opacity-30 flex-shrink-0"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>

          {/* Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CHAT_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setChatInput(pill)}
                className="text-[11px] border border-[#E5E5E5] text-[#6B7280] px-2.5 py-1 rounded-full hover:border-[#E8521A] hover:text-[#E8521A] transition"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right sidebar — Quick Actions ── */}
      <aside className="hidden xl:flex flex-col w-[260px] flex-shrink-0 bg-white border-l border-[#E5E5E5] overflow-y-auto">
        <div className="p-4">

          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Navigation &amp; Tools</p>
            <div className="space-y-0.5">
              {NAV_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-[#374151] hover:bg-[#F5F4F0] hover:text-[#E8521A] transition font-medium"
                >
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Create &amp; Generate</p>
            <div className="space-y-0.5">
              {CREATE_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setChatInput(`Help me ${a.label.toLowerCase()}`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-[#374151] hover:bg-[#F5F4F0] hover:text-[#E8521A] transition font-medium text-left"
                >
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Analyze &amp; Write</p>
            <div className="space-y-0.5">
              {ANALYZE_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setChatInput(`Help me ${a.label.toLowerCase()}`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-[#374151] hover:bg-[#F5F4F0] hover:text-[#E8521A] transition font-medium text-left"
                >
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}
