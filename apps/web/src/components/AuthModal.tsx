'use client';

import { useState, FormEvent } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'register';
  onSuccess?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const FEATURE_ITEMS = [
  { icon: '🟣', text: '525+ AI models from 30+ labs' },
  { icon: '⚡', text: 'Custom agent builder with any model' },
  { icon: '🔗', text: 'Connect tools, memory & APIs' },
  { icon: '📊', text: 'Real-time analytics & monitoring' },
];

const OAUTH_BUTTONS = [
  {
    key: 'google',
    label: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    key: 'microsoft',
    label: 'Microsoft',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#F1511B" />
        <path d="M24 24H12.6V12.6H24V24z" fill="#80CC28" />
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00ADEF" />
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#FBBC09" />
      </svg>
    ),
  },
];

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#E8521A]/50 transition mb-4"
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#E5E5E5]" />
      <span className="text-[12px] text-[#9CA3AF] font-medium">Or continue with</span>
      <div className="flex-1 h-px bg-[#E5E5E5]" />
    </div>
  );
}

function OAuthButtons() {
  return (
    <div className="flex gap-2">
      {OAUTH_BUTTONS.map((btn) => (
        <button
          key={btn.key}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 border border-[#E5E5E5] rounded-xl py-2.5 text-[13px] font-medium hover:bg-[#F5F4F0] transition text-[#374151]"
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin', onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(defaultTab);

  /* Sign in fields */
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  /* Register fields */
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSiError('');
    setSiLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSiError(json?.message ?? 'Sign in failed. Please try again.');
        return;
      }
      const token: string = json?.data?.accessToken ?? '';
      if (token) {
        localStorage.setItem('nexusai_token', token);
        document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=900`;
      }
      onSuccess?.();
      onClose();
    } catch {
      setSiError('Network error. Please check your connection.');
    } finally {
      setSiLoading(false);
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match.');
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setRegError(json?.message ?? 'Registration failed. Please try again.');
        return;
      }
      const token: string = json?.data?.accessToken ?? '';
      if (token) {
        localStorage.setItem('nexusai_token', token);
        document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=900`;
      }
      onSuccess?.();
      onClose();
    } catch {
      setRegError('Network error. Please check your connection.');
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden my-auto" style={{ maxHeight: 'calc(100vh - 32px)' }}>

        {/* ── LEFT PANEL ── */}
        <div className="hidden sm:flex flex-col w-72 flex-shrink-0 bg-[#1C1917] p-8 rounded-l-2xl overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-auto">
            <div className="bg-[#E8521A] rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-white font-black text-[15px]">NexusAI</span>
          </div>

          {/* Robot circle */}
          <div className="w-32 h-32 rounded-full bg-[#2C2825] flex items-center justify-center text-7xl mx-auto my-6" aria-hidden="true">
            🤖
          </div>

          <h2 className="font-black text-white text-xl leading-snug">
            Build Smarter with AI Agents
          </h2>
          <p className="text-[#9CA3AF] text-sm mt-2 leading-relaxed">
            Access 525+ models, create custom agents, and automate your workflow — all in one platform.
          </p>

          <ul className="mt-6 space-y-3">
            {FEATURE_ITEMS.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-[13px] text-[#D1D5DB]">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white rounded-r-2xl sm:rounded-l-none rounded-2xl p-6 sm:p-8 relative overflow-y-auto">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F4F0] text-[#6B7280] hover:bg-[#E5E5E5] transition flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#E5E5E5] mb-6">
            {(['signin', 'register'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 text-[14px] font-semibold transition ${
                  activeTab === tab
                    ? 'text-[#1A1A1A] border-b-2 border-[#E8521A]'
                    : 'text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── SIGN IN TAB ── */}
          {activeTab === 'signin' && (
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A]">Welcome back</h2>
              <p className="text-sm text-[#6B7280] mt-1 mb-6">Sign in to your NexusAI account to continue.</p>

              <form onSubmit={handleSignIn} noValidate>
                <InputField
                  label="Email address"
                  type="email"
                  placeholder="owais@yopmail.com"
                  value={siEmail}
                  onChange={setSiEmail}
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[13px] font-semibold text-[#1A1A1A]">Password</label>
                    <button type="button" className="text-sm text-[#E8521A] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#E8521A]/50 transition mb-4"
                  />
                </div>

                {siError && <p className="text-red-500 text-sm mb-3">{siError}</p>}

                <button
                  type="submit"
                  disabled={siLoading}
                  className="w-full bg-[#E8521A] text-white rounded-xl py-2.5 font-bold text-[14px] hover:bg-[#d04415] transition disabled:opacity-60"
                >
                  {siLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <Divider />
              <OAuthButtons />

              <p className="text-[13px] text-[#6B7280] text-center mt-4">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#E8521A] cursor-pointer hover:underline font-medium"
                >
                  Create one
                </button>{' '}
                —
              </p>
            </div>
          )}

          {/* ── CREATE ACCOUNT TAB ── */}
          {activeTab === 'register' && (
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A]">Create your account</h2>
              <p className="text-sm text-[#6B7280] mt-1 mb-6">Get started with NexusAI — it&apos;s free.</p>

              <form onSubmit={handleRegister} noValidate>
                <InputField
                  label="Full name"
                  type="text"
                  placeholder="John Doe"
                  value={regName}
                  onChange={setRegName}
                />
                <InputField
                  label="Email address"
                  type="email"
                  placeholder="you@company.com"
                  value={regEmail}
                  onChange={setRegEmail}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={regPassword}
                  onChange={setRegPassword}
                />
                <InputField
                  label="Confirm password"
                  type="password"
                  placeholder="Confirm your password"
                  value={regConfirm}
                  onChange={setRegConfirm}
                />

                {regError && <p className="text-red-500 text-sm mb-3">{regError}</p>}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-[#E8521A] text-white rounded-xl py-2.5 font-bold text-[14px] hover:bg-[#d04415] transition disabled:opacity-60"
                >
                  {regLoading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <Divider />
              <OAuthButtons />

              <p className="text-[13px] text-[#6B7280] text-center mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-[#E8521A] cursor-pointer hover:underline font-medium"
                >
                  Sign in
                </button>{' '}
                —
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
