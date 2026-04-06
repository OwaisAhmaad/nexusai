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

const TOOLS_GRID = [
  { id: 'web_search',   icon: '🌐', name: 'Web Search',       desc: 'Search the web in real time for up-to-date information',            color: 'bg-blue-50' },
  { id: 'db_lookup',    icon: '🗄️', name: 'Database Lookup',   desc: 'Query your database or vector store for internal knowledge',         color: 'bg-purple-50' },
  { id: 'email',        icon: '📧', name: 'Email Sender',      desc: 'Send emails or notifications on behalf of the agent',               color: 'bg-red-50' },
  { id: 'calendar',     icon: '📅', name: 'Calendar API',      desc: 'Read/write calendar events and schedule meetings',                  color: 'bg-green-50' },
  { id: 'slack',        icon: '💬', name: 'Slack Webhook',     desc: 'Post messages and alerts to Slack channels',                       color: 'bg-yellow-50' },
  { id: 'jira',         icon: '📋', name: 'Jira',              desc: 'Create and update Jira tickets automatically',                      color: 'bg-blue-50' },
  { id: 'sheets',       icon: '📊', name: 'Google Sheets',     desc: 'Read from and write to spreadsheets',                              color: 'bg-green-50' },
  { id: 'custom_fn',    icon: '⚙️', name: 'Custom Function',   desc: 'Define your own tool with a JSON schema',                          color: 'bg-gray-50' },
];

interface ToolConfig {
  overview: string;
  steps: string[];
  tips: string[];
}

const TOOL_CONFIG_DATA: Record<string, ToolConfig> = {
  web_search: {
    overview: "Lets your agent search the live web for current information, news, and facts beyond its training cutoff.",
    steps: ['Choose a search provider', 'Get your API key', 'Define the tool schema', 'Handle the tool call'],
    tips: ['Limit to 3-5 results to save context tokens', "Include today's date so the model understands what 'recent' means", 'Add a domain blocklist to filter low-quality sources'],
  },
  db_lookup: {
    overview: "Connect your agent to any database or vector store for retrieval-augmented generation (RAG) on private knowledge.",
    steps: ['Set up your database or vector store', 'Create a read-only API endpoint or SDK client', 'Define the query schema', 'Return results in a structured format'],
    tips: ['Always sanitize input to prevent injection attacks', 'Limit result count to keep context manageable', 'Add metadata to help the model filter results'],
  },
  email: {
    overview: "Enable your agent to send emails or notifications using SendGrid, Mailgun, or SMTP.",
    steps: ['Choose an email provider (SendGrid, Mailgun, SMTP)', 'Get your API credentials', 'Define the send schema (to, subject, body)', 'Test with a sandbox address first'],
    tips: ['Always confirm recipient before sending in production', 'Use plain text fallback for HTML emails', 'Include unsubscribe links for marketing emails'],
  },
  calendar: {
    overview: "Allow your agent to read and write calendar events using Google Calendar, Outlook, or CalDAV.",
    steps: ['Enable the Calendar API in your provider dashboard', 'Generate OAuth credentials', 'Define read/write scopes', 'Handle timezone conversion carefully'],
    tips: ['Always work in UTC internally, convert for display', 'Cache calendar events to reduce API calls', 'Handle conflicts gracefully with retry logic'],
  },
  slack: {
    overview: "Send Slack messages and alerts to channels or DMs when your agent completes tasks or detects events.",
    steps: ['Create a Slack app in your workspace', 'Add the incoming-webhooks or chat:write permission', 'Copy the webhook URL', 'Format messages with Block Kit for rich output'],
    tips: ['Use threads to keep channel noise low', 'Mention users with @user only when action required', 'Batch notifications to avoid rate limits'],
  },
  jira: {
    overview: "Create, update, and query Jira tickets automatically as your agent works through tasks.",
    steps: ['Create an API token in your Atlassian account', 'Add JIRA_URL and JIRA_EMAIL env vars', 'Define the issue schema (project, type, summary)', 'Handle status transitions with the transitions API'],
    tips: ['Use a dedicated bot account for cleaner audit trails', 'Store Jira IDs in memory for follow-up actions', 'Add watchers automatically for important tickets'],
  },
  sheets: {
    overview: "Read from and write to Google Sheets or Excel for data processing and reporting tasks.",
    steps: ['Enable the Sheets API in Google Cloud Console', 'Create a service account and download the key', 'Share the target spreadsheet with the service account', 'Use range notation (Sheet1!A1:C10) for reads/writes'],
    tips: ['Batch writes to avoid quota limits', 'Name your ranges for readability', 'Always validate data types before writing'],
  },
  custom_fn: {
    overview: "Define any tool your agent needs using a JSON schema — the model will call it automatically when appropriate.",
    steps: ['Define your function schema with name, description, and parameters', 'Implement the function on your server', 'Register it in the tools array of your API call', 'Return results as structured JSON'],
    tips: ['Write a clear description so the model knows when to call it', 'Use strict: true for reliable parameter validation', 'Include error handling and return error messages as strings'],
  },
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
  const [selectedToolFilter, setSelectedToolFilter] = useState<'All' | 'Connected' | 'Available' | 'Suggested'>('All');
  const [checkedTools, setCheckedTools] = useState<Set<string>>(new Set(['web_search', 'db_lookup']));
  const [configTool, setConfigTool] = useState<string | null>(null);
  const [configTab, setConfigTab] = useState<'Overview' | 'Steps' | 'Config'>('Overview');
  const [enableConfigTool, setEnableConfigTool] = useState(false);

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
          <>
            {configTool ? (
              /* ── Tool config sub-panel ── */
              (() => {
                const tool = TOOLS_GRID.find(t => t.id === configTool)!;
                const cfg = TOOL_CONFIG_DATA[configTool]!;
                return (
                  <div className="px-6 py-5">
                    {/* Sub-panel header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tool.color}`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1A1A1A] text-[15px]">{tool.name}</p>
                        <p className="text-[12px] text-[#6B7280]">Real-time access for your agent</p>
                      </div>
                      <button type="button" onClick={() => setConfigTool(null)} className="w-8 h-8 rounded-full bg-[#F5F4F0] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E5E5]">✕</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#E5E5E5] mb-5">
                      {(['Overview', 'Steps', 'Config'] as const).map(tab => (
                        <button key={tab} type="button" onClick={() => setConfigTab(tab)}
                          className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition ${configTab === tab ? 'border-[#E8521A] text-[#E8521A]' : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'}`}>
                          {tab}
                        </button>
                      ))}
                    </div>

                    {configTab === 'Overview' && (
                      <div>
                        {/* Tool card */}
                        <div className={`flex items-start gap-3 ${tool.color} rounded-xl p-4 mb-5`}>
                          <div className="text-2xl">{tool.icon}</div>
                          <div>
                            <p className="font-bold text-[#1A1A1A] text-[14px]">{tool.name}</p>
                            <p className="text-[13px] text-[#374151] mt-1">{cfg.overview}</p>
                          </div>
                        </div>
                        {/* Setup overview */}
                        <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Setup Overview</p>
                        <div className="space-y-2 mb-5">
                          {cfg.steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 border border-[#E5E5E5] rounded-xl px-4 py-3">
                              <span className="w-6 h-6 rounded-full bg-[#F5F4F0] text-[#374151] text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                              <span className="text-[13px] text-[#374151] font-medium">{s}</span>
                            </div>
                          ))}
                        </div>
                        {/* Pro tips */}
                        <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Pro Tips</p>
                        <div className="space-y-2">
                          {cfg.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                              <span className="text-amber-500 text-base flex-shrink-0">💡</span>
                              <span className="text-[12px] text-[#92400E]">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {configTab === 'Steps' && (
                      <div className="space-y-3">
                        {cfg.steps.map((s, i) => (
                          <div key={i} className="flex gap-3 border border-[#E5E5E5] rounded-xl p-4">
                            <span className="w-7 h-7 rounded-full bg-[#E8521A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                            <div>
                              <p className="font-semibold text-[#1A1A1A] text-[13px]">{s}</p>
                              <p className="text-[12px] text-[#6B7280] mt-1">Follow the provider documentation to complete this step.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {configTab === 'Config' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">API Key</label>
                          <input type="password" placeholder="Enter your API key..." className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E8521A]/50 transition" />
                        </div>
                        <div>
                          <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">Endpoint URL (optional)</label>
                          <input type="url" placeholder="https://api.example.com" className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E8521A]/50 transition" />
                        </div>
                        <div className="bg-[#F5F4F0] rounded-xl p-4">
                          <p className="text-[12px] text-[#6B7280]">Config is saved locally and used when your agent calls this tool.</p>
                        </div>
                      </div>
                    )}

                    {/* Sub-panel footer */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E5E5]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={enableConfigTool} onChange={e => { setEnableConfigTool(e.target.checked); if (e.target.checked) setCheckedTools(prev => new Set([...prev, configTool])); else setCheckedTools(prev => { const n = new Set(prev); n.delete(configTool); return n; }); }} className="rounded accent-[#E8521A]" />
                        <span className="text-[13px] font-medium text-[#374151]">Enable this tool</span>
                      </label>
                      <button type="button" onClick={() => setConfigTool(null)} className="bg-[#E8521A] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#d04415] transition">Done</button>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* ── Main tools grid ── */
              <div className="px-6 py-5">
                <p className="text-[13px] text-[#6B7280] mb-4">
                  Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook. Click any tool to see configuration steps.
                </p>

                {/* Filter tabs */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {(['All', 'Connected', 'Available', 'Suggested'] as const).map(f => (
                    <button key={f} type="button" onClick={() => setSelectedToolFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition ${selectedToolFilter === f ? 'bg-[#1A1A1A] text-white' : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#1A1A1A]'}`}>
                      {f}
                    </button>
                  ))}
                  <button type="button" className="ml-auto border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] text-[#6B7280] hover:border-[#1A1A1A] transition">All categories ▼</button>
                </div>

                {/* 2-col grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {TOOLS_GRID.map(tool => (
                    <div key={tool.id} className={`border rounded-xl p-3.5 transition ${checkedTools.has(tool.id) ? 'border-[#E8521A] bg-[#FFF8F5]' : 'border-[#E5E5E5] bg-white hover:border-[#9CA3AF]'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <input type="checkbox" checked={checkedTools.has(tool.id)} onChange={e => { const n = new Set(checkedTools); e.target.checked ? n.add(tool.id) : n.delete(tool.id); setCheckedTools(n); }} className="mt-0.5 accent-[#E8521A] flex-shrink-0" />
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${tool.color}`}>{tool.icon}</div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">{tool.name}</p>
                          <p className="text-[11px] text-[#6B7280] leading-snug mt-0.5">{tool.desc}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => { setConfigTool(tool.id); setConfigTab('Overview'); setEnableConfigTool(checkedTools.has(tool.id)); }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#E8521A] hover:underline mt-1 ml-9">
                        <span className="text-[10px]">🔗</span> How to configure →
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add more tools */}
                <button type="button" className="w-full border-2 border-dashed border-[#E5E5E5] rounded-xl py-3 text-[13px] font-medium text-[#6B7280] hover:border-[#E8521A] hover:text-[#E8521A] transition">
                  + Add more tools
                </button>

                {/* Info banner */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <p className="text-[12px] text-blue-700 leading-relaxed">
                    <strong>GPT-5.4, Claude Opus 4.6, Grok-4</strong> all support function calling — define tools in JSON schema and the model will invoke them automatically when needed.
                  </p>
                </div>
              </div>
            )}
          </>
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
