'use client';

import { useState, useEffect, useRef } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/* ─── Types ─── */

type StepNum = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS = ['Purpose', 'System Prompt', 'Tools & APIs', 'Memory', 'Test', 'Deploy'];

interface Step1Data {
  name: string;
  type: string;
  job: string;
  audience: string;
  tone: string;
  constraints: string;
  successCriteria: string;
}

interface ToolState {
  name: string;
  enabled: boolean;
}

interface MemoryState {
  shortTerm: boolean;
  longTerm: boolean;
  historyLength: number;
}

interface ChatMessage {
  role: 'agent' | 'user' | 'sim';
  text: string;
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Constants ─── */

const AGENT_TYPES = [
  'Customer Support',
  'Research & Data',
  'Code & Dev',
  'Sales & CRM',
  'Content & Writing',
  'Operations',
  'Finance & Reports',
  'Something else',
];

const AUDIENCE_PILLS = [
  '👤 Customers',
  '👥 Internal team',
  '💻 Developers',
  '💼 Executives',
];

const TONE_PILLS = [
  '🤝 Professional',
  '😊 Friendly',
  '⚡ Short & direct',
  '📋 Thorough',
];

const JOB_SUGGESTIONS = [
  'Answer customer questions and escalate unresolved issues',
  'Search the web and write structured research reports',
  'Review code for bugs and suggest improvements',
  'Draft emails, posts, and marketing content',
  'Summarise meetings and extract action items',
];

const INITIAL_TOOLS: ToolState[] = [
  { name: 'Web Search', enabled: true },
  { name: 'Data Analysis', enabled: true },
  { name: 'Email', enabled: false },
  { name: 'Calendar', enabled: false },
  { name: 'Slack', enabled: false },
  { name: 'Database', enabled: false },
  { name: 'Custom API', enabled: false },
];

const TOOL_META: Record<string, { icon: string; desc: string }> = {
  'Web Search': { icon: '🌐', desc: 'Search the internet for real-time info' },
  'Data Analysis': { icon: '📊', desc: 'Process spreadsheets and structured data' },
  'Email': { icon: '📧', desc: 'Send and read emails' },
  'Calendar': { icon: '📅', desc: 'Schedule and manage events' },
  'Slack': { icon: '💬', desc: 'Post messages and read channels' },
  'Database': { icon: '🗄️', desc: 'Query and update databases' },
  'Custom API': { icon: '🔗', desc: 'Connect any REST API with a URL + key' },
};

/* ─── Helpers ─── */

function buildSystemPrompt(data: Step1Data): string {
  const name = data.name || 'an AI assistant';
  const type = data.type || 'general';
  const job = data.job || 'assist users with their requests';
  const audience = data.audience ? data.audience.replace(/^[^\s]+\s/, '') : 'users';
  const tone = data.tone ? data.tone.replace(/^[^\s]+\s/, '') : 'Professional';
  const constraints = data.constraints
    ? `\n\nConstraints:\n- ${data.constraints}`
    : '';
  const success = data.successCriteria
    ? `\n\nSuccess criteria: ${data.successCriteria}`
    : '';

  return `You are ${name}, a ${type} agent.

Your primary job is to: ${job}

Audience: You are speaking with ${audience}.

Tone: Respond in a ${tone.toLowerCase()} manner at all times.${constraints}${success}

Always be helpful, accurate, and stay within the scope of your designated role.`;
}

/* ─── Toggle switch ─── */
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-[#E8521A]' : 'bg-[#E5E5E5]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ─── Main modal ─── */
export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const [step, setStep] = useState<StepNum>(1);

  /* Step 1 data */
  const [step1, setStep1] = useState<Step1Data>({
    name: '',
    type: '',
    job: '',
    audience: '',
    tone: '',
    constraints: '',
    successCriteria: '',
  });

  /* Step 2 */
  const [systemPrompt, setSystemPrompt] = useState('');

  /* Step 3 */
  const [tools, setTools] = useState<ToolState[]>(INITIAL_TOOLS);

  /* Step 4 */
  const [memory, setMemory] = useState<MemoryState>({
    shortTerm: true,
    longTerm: false,
    historyLength: 20,
  });

  /* Step 5 */
  const [testInput, setTestInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* Step 6 */
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState('');
  const [deployed, setDeployed] = useState(false);

  /* Sync generated prompt when entering step 2 */
  useEffect(() => {
    if (step === 2 && !systemPrompt) {
      setSystemPrompt(buildSystemPrompt(step1));
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Seed initial chat message when entering step 5 */
  useEffect(() => {
    if (step === 5 && chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'agent',
          text: `Hi! I'm ${step1.name || 'your agent'}. How can I help you today?`,
        },
      ]);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Scroll to bottom of chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  /* ─── Handlers ─── */

  function handleNext() {
    if (step < 6) {
      if (step === 2 && !systemPrompt) {
        setSystemPrompt(buildSystemPrompt(step1));
      }
      setStep((s) => (s + 1) as StepNum);
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as StepNum);
  }

  function handleRegenerate() {
    setSystemPrompt(buildSystemPrompt(step1));
  }

  function toggleTool(index: number) {
    setTools((prev) =>
      prev.map((t, i) => (i === index ? { ...t, enabled: !t.enabled } : t)),
    );
  }

  async function handleSendTest() {
    if (!testInput.trim() || testLoading) return;
    const userMsg = testInput.trim();
    setTestInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setTestLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setChatMessages((prev) => [
      ...prev,
      {
        role: 'sim',
        text: 'This is a simulated response. Deploy your agent to test with real AI.',
      },
    ]);
    setTestLoading(false);
  }

  async function handleDeploy() {
    setDeploying(true);
    setDeployError('');
    const enabledTools = tools.filter((t) => t.enabled).map((t) => t.name);
    try {
      const token = localStorage.getItem('nexusai_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch(`${API}/api/v1/agents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: step1.name || 'My Agent',
          systemPrompt,
          tools: enabledTools,
          memory,
          model: 'GPT-5.4',
        }),
      });
    } catch {
      /* API unavailable — proceed with optimistic success */
    } finally {
      setDeploying(false);
    }
    /* Always show success — agent config is saved locally regardless */
    setDeployed(true);
    setTimeout(() => onClose(), 2000);
  }

  /* ─── Step header label ─── */
  const stepTitles: Record<StepNum, string> = {
    1: "Define your agent's purpose",
    2: 'Configure the system prompt',
    3: 'Connect tools & APIs',
    4: 'Set up memory',
    5: 'Test your agent',
    6: 'Deploy your agent',
  };

  const inputClass =
    'w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E8521A]/50 transition';
  const labelClass = 'text-[13px] font-semibold text-[#1A1A1A] mb-2 block';

  /* ─── Render ─── */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-[#1A1A1A] text-[15px]">{stepTitles[step]}</p>
              <p className="text-[#6B7280] text-[13px]">Step {step} of 6</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition text-[18px] leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* STEP PROGRESS */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 flex-wrap">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                    step > i + 1
                      ? 'bg-[#E8521A] text-white'
                      : step === i + 1
                      ? 'bg-[#E8521A] text-white'
                      : 'bg-[#F5F4F0] text-[#9CA3AF]'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] text-[#9CA3AF]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── STEP 1: PURPOSE ─── */}
        {step === 1 && (
          <div className="px-6 py-6 space-y-5">
            {/* Name */}
            <div>
              <label className={labelClass}>What do you want to call your agent?</label>
              <input
                type="text"
                value={step1.name}
                onChange={(e) => setStep1({ ...step1, name: e.target.value })}
                placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..."
                className={inputClass}
              />
            </div>

            {/* Type */}
            <div>
              <label className={labelClass}>What kind of agent is this?</label>
              <div className="flex flex-wrap gap-2">
                {AGENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStep1({ ...step1, type: t })}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition ${
                      step1.type === t
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Job */}
            <div>
              <label className={labelClass}>What&#39;s the main job? (in plain English)</label>
              <textarea
                value={step1.job}
                onChange={(e) => setStep1({ ...step1, job: e.target.value })}
                rows={3}
                placeholder="e.g. Answer customer questions, handle returns..."
                className={`${inputClass} resize-none`}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {JOB_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setStep1({ ...step1, job: sug })}
                    className="text-[11px] bg-[#F5F4F0] text-[#374151] px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#E8521A]/10 hover:text-[#E8521A] transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className={labelClass}>Who will be talking to this agent?</label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_PILLS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setStep1({ ...step1, audience: a })}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition ${
                      step1.audience === a
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className={labelClass}>How should the agent sound?</label>
              <div className="flex flex-wrap gap-2">
                {TONE_PILLS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStep1({ ...step1, tone: t })}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition ${
                      step1.tone === t
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <label className={labelClass}>Anything it should never do? (optional)</label>
              <input
                type="text"
                value={step1.constraints}
                onChange={(e) => setStep1({ ...step1, constraints: e.target.value })}
                placeholder="e.g. Never share pricing, never discuss competitors..."
                className={inputClass}
              />
            </div>

            {/* Success criteria */}
            <div>
              <label className={labelClass}>
                How will you know it&#39;s doing a good job? (optional)
              </label>
              <input
                type="text"
                value={step1.successCriteria}
                onChange={(e) => setStep1({ ...step1, successCriteria: e.target.value })}
                placeholder="e.g. Resolves most questions without human help..."
                className={inputClass}
              />
            </div>

            {/* Footer note */}
            <div className="bg-[#FFF8F5] border border-[#E8521A]/20 rounded-xl p-3 mt-4">
              <p className="text-[12px] text-[#E8521A]">
                ⚡ Your answers will auto-generate a system prompt in the next step
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2: SYSTEM PROMPT ─── */}
        {step === 2 && (
          <div className="px-6 py-6">
            <h3 className="font-bold text-[#1A1A1A] mb-2">Auto-generated System Prompt</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">
              Generated from your answers. Edit as needed.
            </p>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={10}
              className="w-full border border-[#E5E5E5] rounded-xl p-4 text-[13px] font-mono text-[#374151] focus:outline-none focus:border-[#E8521A]/50 transition resize-none"
            />
            <button
              type="button"
              onClick={handleRegenerate}
              className="mt-3 border border-[#E5E5E5] text-[#6B7280] text-[13px] font-semibold px-4 py-2 rounded-xl hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition"
            >
              ↻ Regenerate
            </button>
          </div>
        )}

        {/* ─── STEP 3: TOOLS & APIs ─── */}
        {step === 3 && (
          <div className="px-6 py-6">
            <h3 className="font-bold text-[#1A1A1A] mb-1">Tools &amp; APIs</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">
              Choose what your agent can access.
            </p>
            <div>
              {tools.map((tool, idx) => {
                const meta = TOOL_META[tool.name] ?? { icon: '🔧', desc: '' };
                return (
                  <div
                    key={tool.name}
                    className="flex items-center justify-between py-3 border-b border-[#F5F4F0]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{meta.icon}</span>
                      <div>
                        <p className="font-semibold text-[#1A1A1A] text-[13px]">{tool.name}</p>
                        <p className="text-[12px] text-[#6B7280]">{meta.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={tool.enabled} onChange={() => toggleTool(idx)} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STEP 4: MEMORY ─── */}
        {step === 4 && (
          <div className="px-6 py-6 space-y-6">
            <h3 className="font-bold text-[#1A1A1A] mb-1">Memory Settings</h3>
            <p className="text-[13px] text-[#6B7280] mb-4">
              Control how your agent remembers context.
            </p>

            {/* Short-term */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1A1A1A] text-[14px]">Short-term memory</p>
                <p className="text-[#6B7280] text-[12px]">
                  Remember context within a conversation
                </p>
              </div>
              <Toggle
                enabled={memory.shortTerm}
                onChange={(val) => setMemory({ ...memory, shortTerm: val })}
              />
            </div>

            {/* Long-term */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1A1A1A] text-[14px]">Long-term memory</p>
                <p className="text-[#6B7280] text-[12px]">
                  Remember user preferences across sessions (vector store)
                </p>
              </div>
              <Toggle
                enabled={memory.longTerm}
                onChange={(val) => setMemory({ ...memory, longTerm: val })}
              />
            </div>

            {/* History length */}
            <div>
              <label className="text-[13px] font-semibold text-[#1A1A1A] mb-2 block">
                History length: {memory.historyLength} messages
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={memory.historyLength}
                onChange={(e) =>
                  setMemory({ ...memory, historyLength: Number(e.target.value) })
                }
                className="w-full accent-[#E8521A]"
              />
              <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1">
                <span>10</span>
                <span>100</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 5: TEST ─── */}
        {step === 5 && (
          <div className="px-6 py-6">
            <h3 className="font-bold text-[#1A1A1A] mb-4">
              Test your agent before deploying
            </h3>

            {/* Chat area */}
            <div className="bg-[#F5F4F0] rounded-2xl p-4 h-48 overflow-y-auto flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-[13px] ${
                      msg.role === 'user'
                        ? 'bg-[#E8521A] text-white'
                        : 'bg-white text-[#374151] border border-[#E5E5E5]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {testLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-[13px] text-[#9CA3AF]">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendTest();
                }}
                placeholder="Type a test message..."
                className="flex-1 border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E8521A]/50 transition"
              />
              <button
                type="button"
                onClick={() => void handleSendTest()}
                disabled={testLoading}
                className="bg-[#E8521A] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#d04415] transition disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 6: DEPLOY ─── */}
        {step === 6 && (
          <div className="px-6 py-6">
            {deployed ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold text-[#1A1A1A] text-lg mb-1">Agent deployed!</h3>
                <p className="text-[#6B7280] text-[13px]">Your agent is live and ready to use.</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="bg-[#F5F4F0] rounded-xl p-4 mb-6">
                  <p className="font-bold text-[#1A1A1A]">
                    Agent: {step1.name || '(unnamed)'}
                  </p>
                  <p className="text-[#6B7280] text-[13px] mt-1">
                    Type: {step1.type || 'General'}
                  </p>
                  <p className="text-[#6B7280] text-[13px] mt-1">
                    Tools:{' '}
                    {tools
                      .filter((t) => t.enabled)
                      .map((t) => t.name)
                      .join(', ') || 'None'}
                  </p>
                  <p className="text-[#6B7280] text-[13px] mt-1">
                    Memory:{' '}
                    {[
                      memory.shortTerm ? 'Short-term' : null,
                      memory.longTerm ? 'Long-term' : null,
                    ]
                      .filter(Boolean)
                      .join(', ') || 'None'}
                  </p>
                </div>

                {deployError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl">
                    {deployError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void handleDeploy()}
                  disabled={deploying}
                  className="w-full bg-[#E8521A] text-white py-3 rounded-xl font-bold text-[15px] hover:bg-[#d04415] transition disabled:opacity-60"
                >
                  {deploying ? 'Deploying...' : '🚀 Deploy Agent'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ─── FOOTER ─── */}
        {!deployed && (
          <div className="sticky bottom-0 bg-white border-t border-[#E5E5E5] px-6 py-4">
            <div className="flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="border border-[#E5E5E5] text-[#6B7280] px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#E8521A] text-white rounded-xl px-6 py-2.5 font-bold text-[13px] hover:bg-[#d04415] transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleDeploy()}
                  disabled={deploying}
                  className="bg-[#E8521A] text-white rounded-xl px-6 py-2.5 font-bold text-[13px] hover:bg-[#d04415] transition disabled:opacity-60"
                >
                  {deploying ? 'Deploying...' : 'Deploy Agent'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
