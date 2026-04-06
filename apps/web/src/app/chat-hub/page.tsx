'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { MediaToolbar } from '@/components/MediaToolbar';

/* ── Static data ─────────────────────────────────────────────── */

const WELCOME_TILES = [
  { icon: '✍️', label: 'Write content',   sub: 'Emails, posts, stories'   },
  { icon: '🎨', label: 'Create images',   sub: 'Art, photos, designs'     },
  { icon: '🛠️',  label: 'Build something', sub: 'Apps, tools, websites'    },
  { icon: '⚡', label: 'Automate work',   sub: 'Save hours every week'    },
  { icon: '📊', label: 'Analyse data',    sub: 'PDFs, sheets, reports'    },
  { icon: '🔍', label: 'Just exploring',  sub: "Show me what's possible"  },
];

const AUDIENCE_OPTIONS = [
  { icon: '👤', label: 'Just me',         sub: 'Personal use'           },
  { icon: '👥', label: 'My team',         sub: 'Small group, work'      },
  { icon: '🏢', label: 'My company',      sub: 'Business/enterprise'    },
  { icon: '🙋', label: 'My customers',    sub: 'Building for end-users' },
  { icon: '🎓', label: 'Students',        sub: 'Education / learning'   },
  { icon: '🌐', label: 'Anyone / public', sub: 'Open to the world'      },
];

const EXPERIENCE_OPTIONS = [
  { icon: '😊', label: 'Complete beginner', sub: 'Never used AI before'     },
  { icon: '🙂', label: 'Some experience',   sub: 'Used ChatGPT etc'         },
  { icon: '💻', label: 'Developer',         sub: 'I can write code'         },
  { icon: '🔬', label: 'AI researcher',     sub: 'Deep technical knowledge' },
];

const BUDGET_OPTIONS = [
  { icon: '🆓', label: 'Free only',   sub: 'No credit card'           },
  { icon: '💳', label: 'Pay as I go', sub: 'Small monthly costs OK'   },
  { icon: '📋', label: 'Fixed plan',  sub: 'Predictable monthly bill' },
  { icon: '🏢', label: 'Enterprise',  sub: 'Scale, SLAs, support'     },
];

const SUGGESTED_PROMPTS = [
  { icon: '🎯', text: 'Help me plan a SaaS product from idea to launch' },
  { icon: '💻', text: 'Write a REST API in Node.js with authentication' },
  { icon: '📊', text: 'Analyze the pros and cons of GPT-5 vs Claude'   },
  { icon: '✍️', text: 'Write a compelling LinkedIn post about AI trends' },
  { icon: '🔬', text: 'Summarize the latest papers on multimodal AI'   },
  { icon: '🎨', text: 'Create a brand identity for a tech startup'     },
];

const NAV_ACTIONS = [
  { icon: '🛍️', label: 'Browse Marketplace',  href: '/marketplace' },
  { icon: '🤖', label: 'Build an Agent',       href: '/agents'      },
  { icon: '📖', label: 'How to use Guide',     href: '/research'    },
  { icon: '📐', label: 'Prompt Engineering',   href: '/research'    },
  { icon: '💰', label: 'View Pricing',         href: '/marketplace' },
  { icon: '📊', label: 'AI Models Analysis',   href: '/marketplace' },
];

const CREATE_ACTIONS = [
  { icon: '🎨', label: 'Create image'     },
  { icon: '🎵', label: 'Generate Audio'   },
  { icon: '🎬', label: 'Create video'     },
  { icon: '📋', label: 'Create slides'    },
  { icon: '📈', label: 'Create Infographs'},
  { icon: '❓', label: 'Create quiz'      },
  { icon: '🗂️', label: 'Create Flashcards'},
  { icon: '🧠', label: 'Create Mind map'  },
];

const ANALYZE_ACTIONS = [
  { icon: '📉', label: 'Analyze Data'       },
  { icon: '✍️', label: 'Write content'      },
  { icon: '💻', label: 'Code Generation'    },
  { icon: '📄', label: 'Document Analysis'  },
  { icon: '🌐', label: 'Translate'          },
];

const CHAT_PILLS = [
  'Use cases', 'Monitor the situation', 'Create a prototype',
  'Build a business plan', 'Create content', 'Analyze & research', 'Learn something',
];

interface Model {
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google';
}

const MODELS: Model[] = [
  { name: 'GPT-5',          provider: 'OpenAI'    },
  { name: 'GPT-5.2',        provider: 'OpenAI'    },
  { name: 'GPT-5 Turbo',    provider: 'OpenAI'    },
  { name: 'GPT-4.5',        provider: 'OpenAI'    },
  { name: 'GPT-4.1',        provider: 'OpenAI'    },
  { name: 'GPT-4.1-mini',   provider: 'OpenAI'    },
  { name: 'o3',             provider: 'OpenAI'    },
  { name: 'o3-mini',        provider: 'OpenAI'    },
  { name: 'o4-mini',        provider: 'OpenAI'    },
  { name: 'Claude Opus 4.6',   provider: 'Anthropic' },
  { name: 'Claude Opus 4.5',   provider: 'Anthropic' },
  { name: 'Claude Opus 4',     provider: 'Anthropic' },
  { name: 'Claude Sonnet 4.6', provider: 'Anthropic' },
  { name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { name: 'Claude Sonnet 4',   provider: 'Anthropic' },
  { name: 'Claude Haiku 4.5',  provider: 'Anthropic' },
  { name: 'Claude Haiku 4',    provider: 'Anthropic' },
  { name: 'Gemini 3.1 Pro',    provider: 'Google'    },
  { name: 'Gemini 3 Pro',      provider: 'Google'    },
  { name: 'Gemini 3 Flash',    provider: 'Google'    },
  { name: 'Gemini 2.5 Pro',    provider: 'Google'    },
  { name: 'Gemini 2.5 Flash',  provider: 'Google'    },
  { name: 'Gemini 2.0 Flash',  provider: 'Google'    },
];

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI:    'bg-green-500',
  Anthropic: 'bg-violet-500',
  Google:    'bg-blue-500',
};

/* ── Prompt builder ──────────────────────────────────────────── */

function buildPrompt(task: string, audience: string, exp: string, budget: string): string {
  const roleMap: Record<string, string> = {
    'Write content':   'professional content writer',
    'Create images':   'creative visual designer',
    'Build something': 'software developer',
    'Automate work':   'workflow automation specialist',
    'Analyse data':    'data analyst',
    'Just exploring':  'helpful AI assistant',
  };
  const audienceMap: Record<string, string> = {
    'Just me':         'my personal use',
    'My team':         'a small team / group',
    'My company':      'a business / enterprise',
    'My customers':    'end-users / customers',
    'Students':        'students / learning',
    'Anyone / public': 'the general public',
  };
  const expMap: Record<string, string> = {
    'Complete beginner': 'Please explain things clearly with no assumed technical knowledge.',
    'Some experience':   'I have some experience with AI tools like ChatGPT.',
    'Developer':         'I am a developer and comfortable with technical details.',
    'AI researcher':     'I have deep technical knowledge of AI systems.',
  };
  const budgetMap: Record<string, string> = {
    'Free only':   'Prioritise free or open-source solutions where possible.',
    'Pay as I go': 'Small monthly costs are acceptable.',
    'Fixed plan':  'I have a fixed monthly budget for tools.',
    'Enterprise':  'Quality and scale matter most — cost is secondary.',
  };

  return `You are a ${roleMap[task] ?? 'helpful assistant'}. Help me with: ${task}.

This is for ${audienceMap[audience] ?? 'personal use'}. ${expMap[exp] ?? ''}

Please give a clear, structured response with practical steps I can act on immediately. ${budgetMap[budget] ?? ''}

Start with a concise overview, then walk me through the most effective approach step by step.`;
}

/* ── Types ───────────────────────────────────────────────────── */

type FlowStep = 'welcome' | 'audience' | 'experience' | 'budget' | 'prompt' | 'done';

type MsgKind =
  | 'thinking'
  | 'assistant'
  | 'bot-text'
  | 'audience-card'
  | 'experience-card'
  | 'budget-card'
  | 'prompt-card'
  | 'user'
  | 'congrats';

interface ChatMsg {
  id: string;
  kind: MsgKind;
  text?: string;
  label?: string;
  payload?: string;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function uid() { return Math.random().toString(36).slice(2); }

function DiamondIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5L16.5 9L9 16.5L1.5 9L9 1.5Z" fill="#E8521A" stroke="#E8521A" strokeWidth="0.5" strokeLinejoin="round"/>
      <path d="M9 5L13 9L9 13L5 9L9 5Z" fill="white"/>
    </svg>
  );
}

function OrangePill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-[#FFF3EE] border border-[#E8521A] text-[#E8521A] rounded-full px-2.5 py-0.5 text-[11px] font-semibold mb-3">
      + {label}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function ChatHubPage() {
  const [flowStep, setFlowStep]           = useState<FlowStep>('welcome');
  const [task, setTask]                   = useState('');
  const [audience, setAudience]           = useState('');
  const [experience, setExperience]       = useState('');
  const [budget, setBudget]               = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptEditing, setPromptEditing] = useState(false);
  const [promptVisible, setPromptVisible] = useState(true);
  const [promptDone, setPromptDone]       = useState(false);

  const [messages, setMessages]           = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput]         = useState('');
  const [activeModel, setActiveModel]     = useState('Claude Sonnet 4.6');
  const [searchQuery, setSearchQuery]     = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll to bottom on new messages / step change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, flowStep]);

  /* Close model dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    }
    if (showModelDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModelDropdown]);

  /* ── Flow handlers ── */

  function handleTileClick(tileLabel: string) {
    setTask(tileLabel);
    setFlowStep('audience');
    setMessages([
      {
        id: uid(), kind: 'bot-text',
        text: `Great choice! 🎉 "${tileLabel}" — I can already think of some excellent models for that.\n\nNow, quick question:`,
      },
      { id: uid(), kind: 'audience-card', label: 'WHO IT\'S FOR' },
    ]);
  }

  function handleAudienceSelect(option: string) {
    if (audience) return; // already selected
    setAudience(option);
    setFlowStep('experience');
    setMessages((prev) => [
      ...prev,
      {
        id: uid(), kind: 'bot-text',
        text: `Perfect — "${option}". That helps a lot! 💡\nOne more:`,
      },
      { id: uid(), kind: 'experience-card', label: 'YOUR EXPERIENCE' },
    ]);
  }

  function handleExperienceSelect(option: string) {
    if (experience) return; // already selected
    setExperience(option);
    setFlowStep('budget');
    setMessages((prev) => [
      ...prev,
      {
        id: uid(), kind: 'bot-text',
        text: `Got it — "${option}". Almost there! 🚀\nLast question:`,
      },
      { id: uid(), kind: 'budget-card', label: 'YOUR BUDGET' },
    ]);
  }

  function handleBudgetSelect(option: string) {
    if (budget) return; // already selected
    setBudget(option);
    setFlowStep('prompt');

    const prompt = buildPrompt(task, audience, experience, option);
    setGeneratedPrompt(prompt);
    setPromptVisible(true);

    // Fire-and-forget API call
    const useCaseMap: Record<string, string> = {
      'Write content':   'writing',
      'Create images':   'vision',
      'Build something': 'coding',
      'Automate work':   'coding',
      'Analyse data':    'analysis',
      'Just exploring':  'general',
    };
    const budgetMap: Record<string, string> = {
      'Free only':   'low',
      'Pay as I go': 'low',
      'Fixed plan':  'medium',
      'Enterprise':  'high',
    };
    const speedMap: Record<string, string> = {
      'Complete beginner': 'fast',
      'Some experience':   'balanced',
      'Developer':         'any',
      'AI researcher':     'any',
    };
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/v1/models/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        useCase: useCaseMap[task] ?? 'general',
        budget:  budgetMap[option] ?? 'medium',
        speed:   speedMap[experience] ?? 'any',
      }),
    }).catch(() => {});

    setMessages((prev) => [
      ...prev,
      {
        id: uid(), kind: 'bot-text',
        text: `Here's a personalised prompt crafted from your answers. You can run it as-is, edit it, regenerate a new version, or delete it and type your own. 🤖`,
      },
      { id: uid(), kind: 'prompt-card', label: 'prompt ready' },
    ]);
  }

  function handleRunPrompt() {
    if (promptDone) return;
    setPromptDone(true);
    setFlowStep('done');
    setMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: generatedPrompt },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: uid(), kind: 'congrats' },
      ]);
    }, 1000);
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
        id: uid(), kind: 'assistant',
        text: `Great question! I'm NexusAI Hub — your AI model advisor. Use the quick actions on the right or the chat to explore AI models. Visit the <a href="/marketplace" class="text-[#E8521A] underline underline-offset-2">Marketplace</a> to browse all models.`,
        label: 'model advisor',
      },
    ]);
  }

  /* ── Render helpers ── */

  function BotRow({ text, label }: { text: string; label?: string }) {
    return (
      <div className="flex items-start gap-3 max-w-lg">
        <div className="w-7 h-7 rounded-full bg-[#FFF3EE] border border-[#E8521A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <DiamondIcon />
        </div>
        <div>
          <p className="text-[14px] text-[#1A1A1A] leading-relaxed whitespace-pre-line">{text}</p>
          {label && <p className="text-[11px] italic text-[#9CA3AF] mt-1">NexusAI Hub · {label}</p>}
        </div>
      </div>
    );
  }

  function OptionGrid({
    options,
    cols,
    selected,
    onSelect,
    disabled,
  }: {
    options: { icon: string; label: string; sub: string }[];
    cols: 2 | 3;
    selected: string;
    onSelect: (label: string) => void;
    disabled: boolean;
  }) {
    return (
      <div className={`grid gap-2 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => !disabled && onSelect(opt.label)}
              disabled={disabled && !isSelected}
              className={`flex flex-col gap-1 p-3.5 rounded-xl border text-left transition ${
                isSelected
                  ? 'border-2 border-[#E8521A] bg-[#FFF3EE]'
                  : disabled
                  ? 'border border-[#E5E5E5] bg-[#F9F9F9] opacity-40 cursor-default'
                  : 'border border-[#E5E5E5] bg-white hover:border-[#E8521A] hover:bg-[#FFF8F5] cursor-pointer'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className={`text-[12px] font-semibold leading-tight ${isSelected ? 'text-[#E8521A]' : 'text-[#1A1A1A]'}`}>{opt.label}</span>
              <span className="text-[10px] text-[#9CA3AF] leading-tight">{opt.sub}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function StepCard({
    pill,
    title,
    subtitle,
    footer,
    children,
  }: {
    pill: string;
    title: string;
    subtitle: string;
    footer: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 max-w-[520px]">
        <OrangePill label={pill} />
        <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1">{title}</h3>
        <p className="text-[12px] text-[#6B7280] mb-4">{subtitle}</p>
        {children}
        <p className="text-[11px] italic text-[#9CA3AF] mt-3">{footer}</p>
      </div>
    );
  }

  /* ── Message renderer ── */

  function renderMsg(msg: ChatMsg) {
    switch (msg.kind) {

      case 'thinking':
        return (
          <div key={msg.id} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
              <DiamondIcon />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E5E5E5] shadow-sm">
              <div className="flex items-center gap-1 py-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-[#E8521A]/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'bot-text':
        return (
          <div key={msg.id} className="flex items-start gap-3 max-w-lg">
            <div className="w-7 h-7 rounded-full bg-[#FFF3EE] border border-[#E8521A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <DiamondIcon />
            </div>
            <p className="text-[14px] text-[#1A1A1A] leading-relaxed whitespace-pre-line pt-1">{msg.text}</p>
          </div>
        );

      case 'audience-card':
        return (
          <div key={msg.id}>
            <StepCard
              pill="WHO IT'S FOR"
              title="Who will be using this AI?"
              subtitle="This helps match the right tool style"
              footer="NexusAI Hub · guided setup"
            >
              <OptionGrid
                options={AUDIENCE_OPTIONS}
                cols={2}
                selected={audience}
                onSelect={handleAudienceSelect}
                disabled={!!audience}
              />
            </StepCard>
          </div>
        );

      case 'experience-card':
        return (
          <div key={msg.id}>
            <StepCard
              pill="YOUR EXPERIENCE"
              title="How comfortable are you with tech / AI?"
              subtitle="Totally fine to be brand new — that's what I'm here for!"
              footer="NexusAI Hub · guided setup"
            >
              <OptionGrid
                options={EXPERIENCE_OPTIONS}
                cols={2}
                selected={experience}
                onSelect={handleExperienceSelect}
                disabled={!!experience}
              />
            </StepCard>
          </div>
        );

      case 'budget-card':
        return (
          <div key={msg.id}>
            <StepCard
              pill="YOUR BUDGET"
              title="What's your budget?"
              subtitle="I'll only show you what fits"
              footer="NexusAI Hub · guided setup"
            >
              <OptionGrid
                options={BUDGET_OPTIONS}
                cols={2}
                selected={budget}
                onSelect={handleBudgetSelect}
                disabled={!!budget}
              />
            </StepCard>
          </div>
        );

      case 'prompt-card':
        if (!promptVisible) return null;
        return (
          <div key={msg.id} className="max-w-[520px]">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
              <OrangePill label="YOUR AI PROMPT" />
              <div className="bg-[#F5F4F0] rounded-xl p-4 mb-4">
                {promptEditing ? (
                  <textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="w-full bg-transparent text-[13px] text-[#374151] leading-relaxed resize-none focus:outline-none min-h-[140px]"
                  />
                ) : (
                  <p className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">{generatedPrompt}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRunPrompt}
                  disabled={promptDone}
                  className="flex items-center gap-1.5 bg-[#E8521A] text-white text-[12px] font-semibold px-4 py-2 rounded-lg hover:bg-[#d04415] transition disabled:opacity-40"
                >
                  ▶ Run prompt
                </button>
                <button
                  type="button"
                  onClick={() => setPromptEditing((v) => !v)}
                  className="flex items-center gap-1.5 border border-[#1A1A1A] text-[#1A1A1A] bg-white text-[12px] px-3 py-2 rounded-lg hover:bg-[#F5F4F0] transition"
                >
                  — Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPromptEditing(false);
                    setGeneratedPrompt(buildPrompt(task, audience, experience, budget));
                  }}
                  className="flex items-center gap-1.5 border border-[#3B82F6] text-[#3B82F6] bg-white text-[12px] px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  ↻ Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => setPromptVisible(false)}
                  className="flex items-center gap-1.5 border border-[#E5E5E5] text-[#6B7280] bg-white text-[12px] px-3 py-2 rounded-lg hover:border-[#1A1A1A] transition"
                >
                  ✕ Delete
                </button>
              </div>
            </div>
            <p className="text-[11px] italic text-[#9CA3AF] mt-1 ml-1">NexusHub · {msg.label}</p>
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

      case 'user':
        return (
          <div key={msg.id} className="flex justify-end items-start gap-2">
            <div
              className="bg-[#E8521A] text-white text-[13px] font-medium px-4 py-2.5 shadow-sm max-w-[70%] whitespace-pre-line"
              style={{ borderRadius: '18px 18px 4px 18px' }}
            >
              {msg.text}
            </div>
            <div className="w-7 h-7 rounded-full bg-[#E8521A] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold mt-0.5">
              U
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
                <div className="bg-[#DCFCE7] rounded-xl p-3 border border-[#BBF7D0] mb-3">
                  <p className="text-[12px] text-[#15803D] font-medium">
                    💡 <strong>What&apos;s next: Explore AI Models</strong> — Now I&apos;ll introduce you to the models that can help with your specific goal.
                  </p>
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 bg-[#E8521A] text-white text-[12px] font-bold px-4 py-2 rounded-full hover:bg-[#d04415] transition"
                >
                  Explore Models →
                </Link>
              </div>
              <p className="text-[11px] italic text-[#9CA3AF] mt-1 ml-1">NexusHub · milestone reached 🎉</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  /* ── Sidebar helpers ── */

  const filteredModels = MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const providers = ['OpenAI', 'Anthropic', 'Google'] as const;

  /* ── Layout ── */

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F4F0] overflow-hidden">

      {/* Left sidebar — Models list */}
      <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-white border-r border-[#E5E5E5] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#F0EEE9]">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">AI Models</p>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 525 models..."
            className="w-full text-[12px] px-3 py-2 rounded-xl border border-[#E5E5E5] bg-[#F5F4F0] focus:outline-none focus:border-[#E8521A]/40 transition"
          />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredModels.map((m) => (
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

      {/* Center — Chat */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="bg-white border-b border-[#E5E5E5] px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <DiamondIcon />
            <span className="text-[14px] font-bold text-[#1A1A1A]">NexusAI Hub</span>
            {task && (
              <span className="text-[11px] text-[#6B7280] bg-[#F5F4F0] px-2 py-0.5 rounded-full">
                {task}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full">
            {activeModel}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 flex flex-col">

          {/* Welcome card — shown until a tile is clicked */}
          {flowStep === 'welcome' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-sm p-8 max-w-lg w-full text-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <DiamondIcon />
                </div>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">Welcome! I&apos;m here to help you 👋</h2>
                <p className="text-[#6B7280] text-[14px] leading-relaxed mb-6">
                  No tech background needed. Tell me what you&apos;d like to <strong>achieve</strong> — I&apos;ll help you discover what&apos;s possible, step by step.
                </p>
                <div className="bg-[#FFF8F5] rounded-2xl border border-[#E8521A]/20 p-4 mb-4">
                  <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-wider mb-3">
                    🔥 WHAT WOULD YOU LIKE TO DO TODAY?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {WELCOME_TILES.map((tile) => (
                      <button
                        key={tile.label}
                        type="button"
                        onClick={() => handleTileClick(tile.label)}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#E8521A] hover:shadow-sm transition text-center"
                      >
                        <span className="text-2xl">{tile.icon}</span>
                        <span className="text-[12px] font-bold text-[#1A1A1A] leading-tight">{tile.label}</span>
                        <span className="text-[10px] text-[#9CA3AF] leading-tight">{tile.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[12px] text-[#9CA3AF]">Or type anything below — there are no wrong answers ↓</p>
              </div>
            </div>
          )}

          {/* Flow messages */}
          {messages.map(renderMsg)}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-[#E5E5E5] px-4 py-3 flex-shrink-0">

          {/* Suggested prompts — shown only at the start */}
          {messages.length <= 2 && flowStep !== 'welcome' && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Suggested prompts</p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => setChatInput(p.text)}
                    className="flex items-start gap-2 bg-white rounded-xl border border-[#E5E5E5] p-3 hover:border-[#E8521A] cursor-pointer transition text-left"
                  >
                    <span className="text-base flex-shrink-0">{p.icon}</span>
                    <span className="text-[11px] text-[#374151] leading-snug">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
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

          <form onSubmit={handleChatSend}>
            <div className="bg-[#F5F4F0] rounded-2xl border border-[#E5E5E5] focus-within:border-[#E8521A]/40 transition overflow-hidden">
              <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
                {/* Model selector */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowModelDropdown((v) => !v)}
                    className="flex items-center gap-1 border border-[#E5E5E5] bg-white rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#374151] hover:border-[#E8521A] transition whitespace-nowrap"
                  >
                    {activeModel}
                    <span className="text-[9px] text-[#9CA3AF]">▼</span>
                  </button>

                  {showModelDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl border border-[#E5E5E5] shadow-lg py-2 z-50 max-h-72 overflow-y-auto">
                      {providers.map((provider) => (
                        <div key={provider}>
                          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 pt-2 pb-1">{provider}</p>
                          {MODELS.filter((m) => m.provider === provider).map((m) => (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => { setActiveModel(m.name); setShowModelDropdown(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left transition hover:bg-[#F5F4F0] ${
                                activeModel === m.name ? 'text-[#E8521A] font-semibold' : 'text-[#374151]'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PROVIDER_COLOR[provider]}`} />
                              {m.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your project, ask a question, or just say hi — I'm here to help…"
                  className="flex-1 bg-transparent text-[13px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none"
                />
              </div>

              <div className="border-t border-[#E5E5E5]/60">
                <MediaToolbar
                  onVoiceTranscript={(t) => setChatInput((prev) => prev + (prev ? ' ' : '') + t)}
                  onAttachFile={(f) => console.log('attach:', f.name)}
                  onAttachImage={(_, url) => console.log('image:', url)}
                  showAgentPill={false}
                  submitLabel={undefined}
                  onSubmit={undefined}
                  submitDisabled={!chatInput.trim()}
                />
                <div className="flex justify-end px-3 pb-2">
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 rounded-full bg-[#E8521A] flex items-center justify-center hover:bg-[#d04415] transition disabled:opacity-30"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right sidebar — Quick Actions */}
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
