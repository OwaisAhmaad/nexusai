'use client';

import { useState, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'register';
  onSuccess?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const FEATURE_COLORS = ['#E8521A', '#F59E0B', '#8B5CF6', '#10B981'];

const OAUTH_BUTTONS = [
  {
    key: 'google', label: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    key: 'github', label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    key: 'microsoft', label: 'Microsoft',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" aria-hidden="true">
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#F1511B"/>
        <path d="M24 24H12.6V12.6H24V24z" fill="#80CC28"/>
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00ADEF"/>
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#FBBC09"/>
      </svg>
    ),
  },
];

function RobotIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="28" width="60" height="48" rx="10" fill="#3D3530"/>
      <rect x="30" y="28" width="60" height="48" rx="10" stroke="#5C4F47" strokeWidth="1.5"/>
      <rect x="40" y="42" width="16" height="12" rx="4" fill="#E8521A"/>
      <rect x="64" y="42" width="16" height="12" rx="4" fill="#E8521A"/>
      <rect x="43" y="45" width="6" height="4" rx="2" fill="#FF8A65" opacity="0.8"/>
      <rect x="67" y="45" width="6" height="4" rx="2" fill="#FF8A65" opacity="0.8"/>
      <rect x="42" y="62" width="36" height="6" rx="3" fill="#5C4F47"/>
      <rect x="46" y="63" width="6" height="4" rx="1.5" fill="#E8521A" opacity="0.6"/>
      <rect x="57" y="63" width="6" height="4" rx="1.5" fill="#E8521A" opacity="0.6"/>
      <rect x="68" y="63" width="6" height="4" rx="1.5" fill="#E8521A" opacity="0.6"/>
      <rect x="57" y="14" width="6" height="16" rx="3" fill="#5C4F47"/>
      <circle cx="60" cy="12" r="5" fill="#E8521A"/>
      <circle cx="60" cy="12" r="2.5" fill="#FF8A65"/>
      <rect x="50" y="76" width="20" height="8" rx="3" fill="#3D3530"/>
      <rect x="24" y="84" width="72" height="28" rx="8" fill="#3D3530"/>
      <rect x="24" y="84" width="72" height="28" rx="8" stroke="#5C4F47" strokeWidth="1.5"/>
      <rect x="38" y="92" width="20" height="12" rx="4" fill="#2C2825"/>
      <rect x="62" y="92" width="20" height="12" rx="4" fill="#2C2825"/>
      <circle cx="48" cy="98" r="3" fill="#E8521A" opacity="0.8"/>
      <circle cx="72" cy="98" r="3" fill="#10B981" opacity="0.8"/>
      <rect x="6" y="86" width="16" height="22" rx="6" fill="#3D3530" stroke="#5C4F47" strokeWidth="1.5"/>
      <rect x="98" y="86" width="16" height="22" rx="6" fill="#3D3530" stroke="#5C4F47" strokeWidth="1.5"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin', onSuccess }: AuthModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(defaultTab);

  /* Sign in state */
  const [siEmail,    setSiEmail]    = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError,    setSiError]    = useState('');
  const [siLoading,  setSiLoading]  = useState(false);

  /* Register state */
  const [regName,     setRegName]     = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');
  const [regError,    setRegError]    = useState('');
  const [regLoading,  setRegLoading]  = useState(false);

  if (!isOpen) return null;

  const inputCls = 'w-full bg-[#F5F4F0] border-0 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 transition';

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
      if (!res.ok) { setSiError(json?.message ?? 'Sign in failed.'); return; }
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
    if (regPassword !== regConfirm) { setRegError('Passwords do not match.'); return; }
    if (regPassword.length < 8)     { setRegError('Password must be at least 8 characters.'); return; }
    setRegLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setRegError(json?.message ?? 'Registration failed.'); return; }
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

  const featureTexts = [t.auth_feature1, t.auth_feature2, t.auth_feature3, t.auth_feature4];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal — fixed height, no viewport overflow */}
      <div
        className="flex w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: '820px', height: 'min(580px, calc(100vh - 48px))' }}
      >

        {/* ── LEFT PANEL ── */}
        <div className="hidden sm:flex flex-col w-[300px] flex-shrink-0 bg-[#1C1917] p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="bg-[#E8521A] rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="text-white font-black text-[15px]">NexusAI</span>
          </div>

          <div className="w-28 h-28 rounded-full bg-[#2C2825] flex items-center justify-center mx-auto mb-5 p-3">
            <RobotIllustration />
          </div>

          <h2 className="font-black text-white text-[18px] leading-snug text-center mb-2">
            {t.auth_panelTitle}
          </h2>
          <p className="text-[#9CA3AF] text-[12px] leading-relaxed text-center mb-5">
            {t.auth_panelSubtitle}
          </p>

          <ul className="space-y-2.5">
            {featureTexts.map((text, i) => (
              <li key={text} className="flex items-center gap-2.5 text-[12px] text-[#D1D5DB]">
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: FEATURE_COLORS[i] + '33' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FEATURE_COLORS[i] }} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white relative flex flex-col min-h-0 rounded-r-2xl sm:rounded-l-none rounded-2xl">

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#E5E5E5] bg-white text-[#6B7280] hover:bg-[#F5F4F0] transition flex items-center justify-center text-[13px] font-bold z-10"
          >
            ✕
          </button>

          {/* Tabs — fixed */}
          <div className="flex gap-6 border-b border-[#E5E5E5] px-7 pt-5 flex-shrink-0">
            {(['signin', 'register'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-semibold transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-[#1A1A1A] border-[#E8521A]'
                    : 'text-[#9CA3AF] border-transparent hover:text-[#6B7280]'
                }`}
              >
                {tab === 'signin' ? t.auth_signInTab : t.auth_createAccountTab}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-7 py-5">

            {/* SIGN IN */}
            {activeTab === 'signin' && (
              <div>
                <h2 className="text-[22px] font-black text-[#1A1A1A] mb-0.5">{t.auth_welcomeBack}</h2>
                <p className="text-[13px] text-[#6B7280] mb-5">{t.auth_signInSubtitle}</p>

                <form onSubmit={handleSignIn} noValidate className="space-y-3">
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{t.auth_emailLabel}</label>
                    <input type="email" placeholder={t.auth_emailPlaceholder} value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required className={inputCls}/>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[13px] font-semibold text-[#1A1A1A]">{t.auth_passwordLabel}</label>
                      <button type="button" className="text-[12px] text-[#E8521A] hover:underline font-medium">{t.auth_forgotPassword}</button>
                    </div>
                    <input type="password" placeholder={t.auth_passwordPlaceholder} value={siPassword} onChange={(e) => setSiPassword(e.target.value)} required className={inputCls}/>
                  </div>
                  {siError && <p className="text-red-500 text-[12px]">{siError}</p>}
                  <button type="submit" disabled={siLoading}
                    className="w-full bg-[#E8521A] text-white rounded-xl py-3 font-bold text-[14px] hover:bg-[#d04415] transition disabled:opacity-60">
                    {siLoading ? <span className="flex items-center justify-center gap-2"><Spinner/>{t.auth_signingIn}</span> : t.auth_signInBtn}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#E5E5E5]"/>
                  <span className="text-[12px] text-[#9CA3AF] font-medium whitespace-nowrap">{t.auth_orContinueWith}</span>
                  <div className="flex-1 h-px bg-[#E5E5E5]"/>
                </div>

                <div className="flex gap-2">
                  {OAUTH_BUTTONS.map((btn) => (
                    <button key={btn.key} type="button"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#E5E5E5] rounded-xl py-2.5 text-[12px] font-medium text-[#374151] hover:bg-[#F5F4F0] transition">
                      {btn.icon}<span>{btn.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-[13px] text-[#6B7280] text-center mt-4">
                  {t.auth_noAccount}{' '}
                  <button type="button" onClick={() => setActiveTab('register')} className="text-[#E8521A] hover:underline font-semibold">
                    {t.auth_createOne}
                  </button>
                </p>
              </div>
            )}

            {/* CREATE ACCOUNT */}
            {activeTab === 'register' && (
              <div>
                <h2 className="text-[22px] font-black text-[#1A1A1A] mb-0.5">{t.auth_createAccount}</h2>
                <p className="text-[13px] text-[#6B7280] mb-4">{t.auth_createSubtitle}</p>

                <form onSubmit={handleRegister} noValidate className="space-y-3">
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{t.auth_fullNameLabel}</label>
                    <input type="text" placeholder={t.auth_fullNamePlaceholder} value={regName} onChange={(e) => setRegName(e.target.value)} required className={inputCls}/>
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{t.auth_emailLabel}</label>
                    <input type="email" placeholder={t.auth_emailPlaceholder} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className={inputCls}/>
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{t.auth_passwordLabel}</label>
                    <input type="password" placeholder={t.auth_confirmPasswordPlaceholder} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className={inputCls}/>
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">{t.auth_confirmPasswordLabel}</label>
                    <input type="password" placeholder={t.auth_confirmPasswordPlaceholder} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required className={inputCls}/>
                  </div>
                  {regError && <p className="text-red-500 text-[12px]">{regError}</p>}
                  <button type="submit" disabled={regLoading}
                    className="w-full bg-[#E8521A] text-white rounded-xl py-3 font-bold text-[14px] hover:bg-[#d04415] transition disabled:opacity-60">
                    {regLoading ? <span className="flex items-center justify-center gap-2"><Spinner/>{t.auth_creating}</span> : t.auth_createBtn}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#E5E5E5]"/>
                  <span className="text-[12px] text-[#9CA3AF] font-medium whitespace-nowrap">{t.auth_orContinueWith}</span>
                  <div className="flex-1 h-px bg-[#E5E5E5]"/>
                </div>

                <div className="flex gap-2">
                  {OAUTH_BUTTONS.map((btn) => (
                    <button key={btn.key} type="button"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#E5E5E5] rounded-xl py-2.5 text-[12px] font-medium text-[#374151] hover:bg-[#F5F4F0] transition">
                      {btn.icon}<span>{btn.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-[13px] text-[#6B7280] text-center mt-4">
                  {t.auth_haveAccount}{' '}
                  <button type="button" onClick={() => setActiveTab('signin')} className="text-[#E8521A] hover:underline font-semibold">
                    {t.auth_signInLink}
                  </button>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
