'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from './AuthModal';
import { CreateAgentModal } from './CreateAgentModal';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/* ─── Static data ─── */

const TASKS = [
  'Dashboard Layout Adjustment',
  'Design agent system prompt',
  'Configure tool integrations',
];

const USE_CASE_PILLS = [
  'Use cases',
  'Build a business',
  'Help me learn',
  'Monitor the situation',
  'Research',
  'Create content',
  'Analyze & research',
];

const SUGGESTIONS_MAP: Record<string, { icon: string; text: string }[]> = {
  'Use cases': [
    { icon: '🚀', text: 'Build a space exploration timeline app' },
    { icon: '📈', text: 'Create a real-time stock market tracker' },
    { icon: '🤖', text: 'Prototype an AI chatbot demo application' },
    { icon: '📋', text: 'Create a project management Kanban board' },
  ],
  'Build a business': [
    { icon: '💼', text: 'Write a business plan for my SaaS idea' },
    { icon: '📊', text: 'Analyze my target market and competitors' },
    { icon: '💰', text: 'Create financial projections for Year 1' },
    { icon: '🎯', text: 'Draft investor pitch deck outline' },
  ],
  'Help me learn': [
    { icon: '🧠', text: 'Explain machine learning in plain English' },
    { icon: '📅', text: 'Create a 30-day Python learning plan' },
    { icon: '📄', text: 'Summarise this research paper for me' },
    { icon: '❓', text: 'Quiz me on JavaScript fundamentals' },
  ],
  'Research': [
    { icon: '📰', text: 'Summarise the latest AI research papers' },
    { icon: '⚖️', text: 'Compare GPT-5 vs Claude Opus 4.6' },
    { icon: '🔍', text: 'Find open-source alternatives to Notion' },
    { icon: '📊', text: 'Research market size for AI tools' },
  ],
};

interface AgentTemplate {
  icon: string;
  name: string;
  desc: string;
  tags: string[];
  tagColors: string[];
}

const STATIC_AGENT_TEMPLATES: AgentTemplate[] = [
  {
    icon: '🔍',
    name: 'Research Agent',
    desc: 'Automates web research and generates structured reports.',
    tags: ['GPT-5.4', 'Web search'],
    tagColors: ['bg-blue-100 text-blue-700', 'bg-gray-100 text-gray-600'],
  },
  {
    icon: '🎧',
    name: 'Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues.',
    tags: ['GPT-5.4', 'Ticketing'],
    tagColors: ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700'],
  },
  {
    icon: '💻',
    name: 'Code Review Agent',
    desc: 'Reviews PRs, flags bugs, and suggests improvements.',
    tags: ['Claude Opus 4.6', 'GitHub'],
    tagColors: ['bg-violet-100 text-violet-700', 'bg-gray-100 text-gray-600'],
  },
  {
    icon: '📊',
    name: 'Data Analysis Agent',
    desc: 'Processes spreadsheets and generates visual insights.',
    tags: ['Gemini', 'Sheets'],
    tagColors: ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700'],
  },
  {
    icon: '✍️',
    name: 'Content Writer Agent',
    desc: 'Creates blog posts and marketing copy with brand voice.',
    tags: ['Claude Opus 4.6', 'Marketing'],
    tagColors: ['bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700'],
  },
];


/* ─── TaskRow ─── */
function TaskRow({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2 py-2 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="rounded accent-[#E8521A]"
      />
      <span className={`text-[13px] flex-1 truncate transition ${checked ? 'line-through text-[#9CA3AF]' : 'text-[#374151]'}`}>{label}</span>
      <button
        type="button"
        className="opacity-0 group-hover:opacity-100 text-[#9CA3AF] text-[16px] leading-none"
        aria-label="More options"
      >
        ···
      </button>
    </div>
  );
}

/* ─── Main component ─── */
export function AgentsPageClient() {
  const router = useRouter();

  /* Auth state */
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  /* UI state */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeUseCasePill, setActiveUseCasePill] = useState('Use cases');
  const [chatInput, setChatInput] = useState('');
  const [agentTemplates, setAgentTemplates] = useState<AgentTemplate[]>(STATIC_AGENT_TEMPLATES);

  /* Attachment state */
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string }[]>([]);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  /* Shuffle state */
  const shuffleOffset = useRef(0);
  const [shuffleIdx, setShuffleIdx] = useState(0);

  /* ── Auth guard on mount ── */
  useEffect(() => {
    const token = localStorage.getItem('nexusai_token');
    if (!token) {
      setShowAuthModal(true);
    }
    setAuthChecked(true);
  }, []);

  /* ── Fetch agent templates from API ── */
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch(`${API}/api/v1/agents`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { data?: unknown[] };
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const mapped = json.data.map((item) => {
            const a = item as Record<string, unknown>;
            return {
              icon: typeof a.icon === 'string' ? a.icon : '🤖',
              name: typeof a.name === 'string' ? a.name : 'Agent',
              desc: typeof a.description === 'string' ? a.description : '',
              tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
              tagColors: ['bg-blue-100 text-blue-700', 'bg-gray-100 text-gray-600'],
            };
          });
          setAgentTemplates(mapped);
        }
      } catch {
        /* fail silently — keep static fallback */
      }
    }
    loadTemplates();
  }, []);

  /* ── Handle auth modal close ── */
  function handleAuthModalClose() {
    setShowAuthModal(false);
    const token = localStorage.getItem('nexusai_token');
    if (!token) {
      router.push('/');
    }
  }

  const currentSuggestions =
    SUGGESTIONS_MAP[activeUseCasePill] ?? SUGGESTIONS_MAP['Use cases'];

  const displayedSuggestions = currentSuggestions
    .slice(shuffleIdx, shuffleIdx + 4)
    .concat(
      currentSuggestions.slice(
        0,
        Math.max(0, shuffleIdx + 4 - currentSuggestions.length),
      ),
    );

  function handleShuffle() {
    const next = (shuffleOffset.current + 1) % currentSuggestions.length;
    shuffleOffset.current = next;
    setShuffleIdx(next);
  }

  function handleSend(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!chatInput.trim() && attachedFiles.length === 0 && attachedImages.length === 0) return;
    // Message would be sent here
    setChatInput('');
    setAttachedFiles([]);
    setAttachedImages([]);
  }

  if (!authChecked) return null;

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-[#F5F4F0] overflow-hidden">
        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="w-[300px] flex-shrink-0 bg-white border-r border-[#E5E5E5] flex flex-col p-5">
          {/* Top branding */}
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-white text-lg">
              🤖
            </div>
            <div>
              <p className="text-[14px] font-black text-[#1A1A1A]">Agent Builder</p>
              <p className="text-[11px] text-[#6B7280]">
                Create powerful AI agents using any model.
              </p>
            </div>
          </div>

          {/* New Agent button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-4 w-full bg-[#E8521A] text-white rounded-xl py-2.5 font-bold text-[13px] hover:bg-[#d04415] transition"
          >
            + New Agent
          </button>

          {/* Banner */}
          <div className="mt-4 bg-[#FFF8F5] border border-[#E8521A]/20 rounded-xl p-3">
            <p className="text-[#E8521A] text-[13px] font-bold">✦ Not sure where to start?</p>
            <p className="text-[12px] text-[#6B7280] mt-1">
              Chat with our AI guide — describe what you want your agent to do and get a
              personalised setup plan.
            </p>
            <button
              type="button"
              className="mt-2 border border-[#E8521A] text-[#E8521A] text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#E8521A]/5 transition"
            >
              Ask the Hub →
            </button>
          </div>

          {/* Task list */}
          <div className="mt-6 flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Tasks
              </span>
              <button
                type="button"
                className="text-[12px] text-[#E8521A] font-semibold hover:underline"
              >
                + New Task
              </button>
            </div>
            {TASKS.map((task) => (
              <TaskRow key={task} label={task} />
            ))}
          </div>

          {/* Create Agent promo card */}
          <div className="mt-auto pt-4 border-t border-[#F0EEE9]">
            <div className="bg-[#1A1A1A] rounded-xl p-3 text-white">
              <p className="text-[12px] font-bold mb-1">🤖 Create Agent</p>
              <p className="text-[10px] text-[#9CA3AF] leading-relaxed">Build a custom AI agent with any model</p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-2 w-full bg-[#E8521A] text-white text-[11px] font-bold py-1.5 rounded-lg hover:bg-[#d04415] transition"
              >
                Get started →
              </button>
            </div>
          </div>
        </aside>

        {/* ─── RIGHT WORKSPACE ─── */}
        <main className="flex-1 flex flex-col overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-black text-[#1A1A1A] leading-tight">
              Agent works{' '}
              <span style={{ color: '#E8521A' }}>for you.</span>
            </h1>
            <p className="text-[#6B7280] mt-1 text-[14px]">
              Your AI agent takes care of everything, end to end.
            </p>
          </div>

          {/* Chat input card */}
          <div className="mt-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            {/* Textarea */}
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.MouseEvent<HTMLButtonElement>);
                }
              }}
              placeholder="What should we work on next?"
              className="w-full px-5 pt-4 pb-2 text-[15px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none resize-none bg-transparent"
              rows={3}
            />

            {/* Attachment chips (only when files attached) */}
            {(attachedFiles.length > 0 || attachedImages.length > 0) && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {attachedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 bg-[#F5F4F0] border border-[#E5E5E5] rounded-lg px-2 py-1 text-[11px] text-[#374151]">
                    <span>📎</span>
                    <span className="max-w-[120px] truncate">{f.name}</span>
                    <button type="button" onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} className="text-[#9CA3AF] hover:text-[#E8521A] ml-0.5">✕</button>
                  </div>
                ))}
                {attachedImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="attached" className="w-10 h-10 rounded-lg object-cover border border-[#E5E5E5]" />
                    <button type="button" onClick={() => setAttachedImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E8521A] text-white text-[8px] flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom toolbar — icons LEFT, controls RIGHT — all one row */}
            <div className="border-t border-[#F0EEE9] px-4 py-2.5 flex items-center justify-between gap-2">
              {/* Left: media icons */}
              <div className="flex items-center gap-1">
                {/* Microphone */}
                <button type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
                {/* Paperclip — file attach */}
                <label className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition cursor-pointer">
                  <input type="file" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    setAttachedFiles(prev => [...prev, { name: f.name, type: f.type }]);
                    setChatInput(prev => prev + (prev ? ' ' : '') + `[📎 ${f.name}]`);
                    e.target.value = '';
                  }} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </label>
                {/* Image */}
                <label className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const url = URL.createObjectURL(f);
                    setAttachedImages(prev => [...prev, url]);
                    e.target.value = '';
                  }} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </label>
                {/* Sparkle / AI enhance */}
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                  </svg>
                </button>
                {/* Video */}
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 8-6 4 6 4V8z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                  </svg>
                </button>
                {/* Screen share */}
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="15" x="2" y="3" rx="2"/><polyline points="8 21 12 17 16 21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </button>
              </div>
              {/* Right: Agent pill + send */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button"
                  className="border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#374151] hover:border-[#1A1A1A] transition">
                  Agent ▼
                </button>
                <button type="button" onClick={handleSend}
                  className="w-9 h-9 rounded-full bg-[#E8521A] flex items-center justify-center hover:bg-[#d04415] transition"
                  aria-label="Send">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Use case pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {USE_CASE_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => {
                  setActiveUseCasePill(pill);
                  setShuffleIdx(0);
                  shuffleOffset.current = 0;
                }}
                className={
                  activeUseCasePill === pill
                    ? 'bg-[#1A1A1A] text-white rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition'
                    : 'border border-[#E5E5E5] text-[#6B7280] rounded-full px-3 py-1.5 text-[12px] hover:border-[#1A1A1A] transition'
                }
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Suggestion list */}
          <div className="mt-4">
            {displayedSuggestions.map((s, i) => (
              <div
                key={`${s.text}-${i}`}
                className="flex items-center gap-3 py-2.5 cursor-pointer group border-b border-[#F5F4F0] last:border-0"
                onClick={() => setChatInput(s.text)}
              >
                <div className="w-8 h-8 rounded-lg bg-[#F5F4F0] flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-[#FFF3EE] transition">
                  {s.icon}
                </div>
                <span className="flex-1 text-[14px] text-[#374151] group-hover:text-[#E8521A] transition leading-snug">
                  {s.text}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 flex-shrink-0 transition">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                className="text-[13px] text-[#6B7280] font-medium hover:text-[#1A1A1A] transition"
              >
                View all suggestions →
              </button>
              <button
                type="button"
                onClick={handleShuffle}
                className="text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition"
              >
                ↻ Shuffle
              </button>
            </div>
          </div>

          {/* Agent templates section */}
          <div className="mt-8">
            <div className="flex items-center">
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Agent Templates
              </span>
              <span className="text-[11px] bg-[#F5F4F0] text-[#6B7280] rounded-full px-2 py-0.5 ml-2 font-semibold">
                {agentTemplates.length}
              </span>
            </div>

            <div className="flex gap-4 mt-4 pb-2 overflow-x-auto">
              {agentTemplates.map((tpl) => (
                <div
                  key={tpl.name}
                  className="flex-shrink-0 w-[200px] bg-white rounded-xl border border-[#E5E5E5] p-4 hover:shadow-md transition cursor-pointer group flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center text-2xl mb-3">{tpl.icon}</div>
                  <p className="font-bold text-[#1A1A1A] text-[14px]">{tpl.name}</p>
                  <p className="text-[12px] text-[#6B7280] mt-1 flex-1">{tpl.desc}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {tpl.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tpl.tagColors[ti] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="mt-3 w-full text-[11px] font-semibold text-[#E8521A] border border-[#E8521A]/30 rounded-lg py-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#E8521A] hover:text-white transition"
                  >
                    Use template →
                  </button>
                </div>
              ))}

              {/* Build from scratch card */}
              <div
                className="flex-shrink-0 w-[200px] border-2 border-dashed border-[#E5E5E5] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8521A] transition"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8521A]/10 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-[#E8521A] leading-none">+</span>
                </div>
                <p className="text-[13px] font-bold text-[#1A1A1A]">Build from Scratch</p>
                <p className="text-[11px] text-[#6B7280] mt-1 text-center">Start with a blank agent</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} />
      )}
      {showCreateModal && (
        <CreateAgentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
