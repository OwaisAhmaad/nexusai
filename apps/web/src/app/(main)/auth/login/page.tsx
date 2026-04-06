'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { ApiResponse, AuthTokens } from '@/types';

const FEATURE_ITEMS = [
  { color: '#E8521A', text: '525+ AI models from 30+ labs'       },
  { color: '#F59E0B', text: 'Custom agent builder with any model' },
  { color: '#8B5CF6', text: 'Connect tools, memory & APIs'       },
  { color: '#10B981', text: 'Real-time analytics & monitoring'   },
];

const OAUTH_BUTTONS = [
  {
    key: 'google', label: 'Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
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
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    key: 'microsoft', label: 'Microsoft',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
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
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
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

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch<ApiResponse<AuthTokens>>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.data.accessToken) {
        localStorage.setItem('nexusai_token', res.data.accessToken);
        document.cookie = `access_token=${encodeURIComponent(res.data.accessToken)}; path=/; max-age=900; samesite=lax`;
      }
      router.push('/marketplace');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F5F4F0] px-4 py-8">
      <div
        className="flex w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: '820px', minHeight: '460px' }}
      >
        {/* LEFT PANEL */}
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
          <h2 className="font-black text-white text-[19px] leading-snug text-center mb-2">
            Build Smarter<br/>with AI Agents
          </h2>
          <p className="text-[#9CA3AF] text-[13px] leading-relaxed text-center mb-6">
            Access 525+ models, create custom agents, and automate your workflow — all in one platform.
          </p>
          <ul className="space-y-2.5">
            {FEATURE_ITEMS.map((item) => (
              <li key={item.text} className="flex items-center gap-2.5 text-[13px] text-[#D1D5DB]">
                <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: item.color + '33' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}/>
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white rounded-r-2xl sm:rounded-l-none rounded-2xl p-7 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#E5E5E5] mb-5">
            <span className="pb-3 text-[14px] font-semibold text-[#1A1A1A] border-b-2 border-[#E8521A] -mb-px">
              Sign In
            </span>
            <Link href="/auth/register" className="pb-3 text-[14px] font-semibold text-[#9CA3AF] hover:text-[#6B7280] transition -mb-px border-b-2 border-transparent">
              Create Account
            </Link>
          </div>

          <h2 className="text-[22px] font-black text-[#1A1A1A] mb-0.5">Welcome back</h2>
          <p className="text-[13px] text-[#6B7280] mb-5">Sign in to your NexusAI account to continue.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div>
              <label className="text-[13px] font-semibold text-[#1A1A1A] mb-1 block">Email address</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                className="w-full bg-[#F5F4F0] border-0 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 transition"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[13px] font-semibold text-[#1A1A1A]">Password</label>
                <button type="button" className="text-[12px] text-[#E8521A] hover:underline font-medium">Forgot password?</button>
              </div>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className="w-full bg-[#F5F4F0] border-0 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 transition"/>
            </div>
            {error && <p className="text-red-500 text-[12px]">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#E8521A] text-white rounded-xl py-3 font-bold text-[14px] hover:bg-[#d04415] transition disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#E5E5E5]"/>
            <span className="text-[12px] text-[#9CA3AF] font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-[#E5E5E5]"/>
          </div>

          <div className="flex gap-2">
            {OAUTH_BUTTONS.map((btn) => (
              <button key={btn.key} type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] rounded-xl py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F5F4F0] transition">
                {btn.icon}<span>{btn.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[13px] text-[#6B7280] text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-[#E8521A] hover:underline font-semibold">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
