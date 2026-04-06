'use client';

import { useState, FormEvent } from 'react';
import { AgentCard } from './AgentCard';
import { CreateAgentModal } from './CreateAgentModal';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

interface AgentsPageClientProps {
  templates: AgentTemplate[];
}

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/* ── Social provider buttons ── */
const SOCIAL_PROVIDERS = [
  { icon: '🔵', label: 'Continue with Google' },
  { icon: '⚫', label: 'Continue with GitHub' },
  { icon: '🟦', label: 'Continue with Microsoft' },
];

/* ── Auth modal with Sign In + Create Account tabs ── */
function AuthModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  /* Sign-in fields */
  const [siEmail,    setSiEmail]    = useState('');
  const [siPassword, setSiPassword] = useState('');

  /* Register fields */
  const [regName,     setRegName]     = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: siEmail, password: siPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || 'Sign in failed'); return; }
      document.cookie = `access_token=${json.data.accessToken}; path=/; max-age=900`;
      onClose();
      window.location.reload();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/v1/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || 'Registration failed'); return; }
      document.cookie = `access_token=${json.data.accessToken}; path=/; max-age=900`;
      onClose();
      window.location.reload();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-[13px] w-full focus:outline-none focus:border-[#E8521A]/50 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1A1A1A] transition text-xl leading-none"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-9 h-9 bg-[#E8521A] rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E5E5] mb-5">
          {(['signin', 'register'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setError(''); }}
              className={`flex-1 pb-2.5 text-[13px] transition ${
                activeTab === tab
                  ? 'border-b-2 border-[#E8521A] text-[#1A1A1A] font-bold'
                  : 'text-[#9CA3AF]'
              }`}
            >
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* ── Sign In tab ── */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              required
              value={siEmail}
              onChange={(e) => setSiEmail(e.target.value)}
              className={inputCls}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={siPassword}
              onChange={(e) => setSiPassword(e.target.value)}
              className={inputCls}
            />
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8521A] text-white rounded-xl py-2.5 text-[13px] font-semibold hover:bg-[#d04415] transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            <div className="flex items-center gap-2 my-1">
              <span className="flex-1 h-px bg-[#E5E5E5]" />
              <span className="text-[11px] text-[#9CA3AF]">or continue with</span>
              <span className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            <div className="space-y-2">
              {SOCIAL_PROVIDERS.map(({ icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-3 w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#374151] hover:border-[#1A1A1A] hover:bg-[#F5F4F0] transition"
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            <p className="text-center text-[12px] text-[#9CA3AF] mt-2">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); }}
                className="text-[#E8521A] font-semibold hover:underline"
              >
                Create one →
              </button>
            </p>
          </form>
        )}

        {/* ── Create Account tab ── */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className={inputCls}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className={inputCls}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className={inputCls}
            />
            <input
              type="password"
              placeholder="Confirm password"
              required
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              className={inputCls}
            />
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8521A] text-white rounded-xl py-2.5 text-[13px] font-semibold hover:bg-[#d04415] transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            <div className="flex items-center gap-2 my-1">
              <span className="flex-1 h-px bg-[#E5E5E5]" />
              <span className="text-[11px] text-[#9CA3AF]">or continue with</span>
              <span className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            <div className="space-y-2">
              {SOCIAL_PROVIDERS.map(({ icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-3 w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#374151] hover:border-[#1A1A1A] hover:bg-[#F5F4F0] transition"
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            <p className="text-center text-[12px] text-[#9CA3AF] mt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setError(''); }}
                className="text-[#E8521A] font-semibold hover:underline"
              >
                Sign in →
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function AgentsPageClient({ templates }: AgentsPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignIn, setShowSignIn]           = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  function requireAuth(action: () => void) {
    if (!getToken()) { setShowSignIn(true); return; }
    action();
  }

  function handleUseTemplate(template: AgentTemplate) {
    requireAuth(() => { setSelectedTemplate(template); setShowCreateModal(true); });
  }

  function handleCreate() {
    requireAuth(() => { setSelectedTemplate(null); setShowCreateModal(true); });
  }

  return (
    <>
      {/* Agent templates */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Agent Templates</h2>
            <p className="text-sm text-muted mt-0.5">Browse free — <button type="button" onClick={() => setShowSignIn(true)} className="text-[#E8521A] hover:underline font-medium">sign in</button> to create your own</p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="bg-[#E8521A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#d04415] transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Create agent
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border">
            <p className="text-3xl mb-3">🤖</p>
            <p className="font-semibold text-text-primary">No templates yet</p>
            <p className="text-sm text-muted mt-1">Run the seed script to populate templates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <AgentCard
                key={template.id}
                agent={template}
                onUse={() => handleUseTemplate(template)}
              />

            ))}
          </div>
        )}
      </section>

      {/* How agents work */}
      <section className="mt-14">
        <h2 className="text-lg font-bold text-text-primary mb-5">How agents work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Choose a model', desc: 'Select from any of our 12+ AI models as the brain for your agent.' },
            { icon: '📝', title: 'Write a system prompt', desc: 'Define your agent\'s persona, capabilities, and how it should behave.' },
            { icon: '🔧', title: 'Add tools', desc: 'Give your agent web search, code execution, or API access (coming soon).' },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl bg-surface border border-border p-5">
              <span className="text-2xl">{step.icon}</span>
              <h3 className="font-semibold text-text-primary mt-3 mb-1">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {showCreateModal && (
        <CreateAgentModal
          template={selectedTemplate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showSignIn && <AuthModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
