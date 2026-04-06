'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from './AuthModal';
import { CreateAgentModal } from './CreateAgentModal';
import { MediaToolbar } from './MediaToolbar';

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
      <span className="text-[13px] text-[#374151] flex-1 truncate">{label}</span>
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
          <div className="mt-6">
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

          {/* Chat input */}
          <div className="mt-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            <div className="p-4 pb-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="What should we work on next?"
                className="w-full text-[15px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none resize-none bg-transparent"
                rows={3}
              />
            </div>
            {/* Media toolbar */}
            <div className="border-t border-[#F0EEE9]">
              {/* Attachment chips */}
              {(attachedFiles.length > 0 || attachedImages.length > 0) && (
                <div className="flex flex-wrap gap-1.5 px-3 pt-2">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 bg-[#F5F4F0] border border-[#E5E5E5] rounded-lg px-2 py-1 text-[11px] text-[#374151]">
                      <span>📎</span>
                      <span className="max-w-[120px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))}
                        className="text-[#9CA3AF] hover:text-[#E8521A] ml-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {attachedImages.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="attached" className="w-10 h-10 rounded-lg object-cover border border-[#E5E5E5]" />
                      <button
                        type="button"
                        onClick={() => setAttachedImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E8521A] text-white text-[8px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <MediaToolbar
                onVoiceTranscript={(t) => setChatInput((prev) => prev + (prev ? ' ' : '') + t)}
                onAttachFile={(f) => {
                  setAttachedFiles(prev => [...prev, { name: f.name, type: f.type }]);
                  setChatInput(prev => prev + (prev ? ' ' : '') + `[📎 ${f.name}]`);
                }}
                onAttachImage={(_, url) => {
                  setAttachedImages(prev => [...prev, url]);
                }}
                showAgentPill={false}
              />
              {/* Agent pill + send */}
              <div className="flex justify-end items-center gap-2 px-3 pb-3">
                <button
                  type="button"
                  className="border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#374151] hover:border-[#1A1A1A] transition"
                >
                  Agent ▼
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="w-9 h-9 rounded-full bg-[#E8521A] flex items-center justify-center hover:bg-[#d04415] transition"
                  aria-label="Send"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" />
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
                className="flex items-center gap-3 py-2.5 cursor-pointer hover:text-[#E8521A] transition group border-b border-[#F5F4F0] last:border-0"
                onClick={() => setChatInput(s.text)}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5F4F0] to-[#E5E5E5] flex items-center justify-center text-base flex-shrink-0">
                  {s.icon}
                </div>
                <span className="text-[14px] text-[#374151] group-hover:text-[#E8521A] transition">
                  {s.text}
                </span>
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
                  className="flex-shrink-0 w-[200px] bg-white rounded-xl border border-[#E5E5E5] p-4 hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center text-2xl mb-3">{tpl.icon}</div>
                  <p className="font-bold text-[#1A1A1A] text-[14px]">{tpl.name}</p>
                  <p className="text-[12px] text-[#6B7280] mt-1">{tpl.desc}</p>
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
