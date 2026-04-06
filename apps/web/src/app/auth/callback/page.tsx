'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PROVIDER_META: Record<string, { name: string; color: string }> = {
  google:    { name: 'Google',    color: '#4285F4' },
  github:    { name: 'GitHub',    color: '#1A1A1A' },
  microsoft: { name: 'Microsoft', color: '#00A4EF' },
};

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const provider = params.get('provider') ?? '';
  const meta = PROVIDER_META[provider];

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      const label = PROVIDER_META[provider]?.name ?? provider;
      setErrorMsg(
        error?.endsWith('_failed')
          ? `${label} sign-in failed. The OAuth app credentials may not be configured yet.`
          : 'Sign-in was cancelled or an error occurred.',
      );
      setStatus('error');
      setTimeout(() => router.push('/'), 4000);
      return;
    }

    localStorage.setItem('nexusai_token', token);
    localStorage.setItem('nexusai_provider', provider);
    setStatus('success');
    setTimeout(() => router.push('/chat-hub'), 1500);
  }, [params, router, provider]);

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center max-w-sm w-full shadow-sm">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-[#E8521A] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-[15px] font-bold text-[#1A1A1A]">
              {meta ? `Signing in with ${meta.name}…` : 'Signing you in…'}
            </p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">Signed in successfully!</p>
            {meta && <p className="text-[13px] mt-1 font-medium" style={{ color: meta.color }}>via {meta.name}</p>}
            <p className="text-[13px] text-[#6B7280] mt-1">Redirecting to Chat Hub…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">Sign-in failed</p>
            <p className="text-[12px] text-[#6B7280] mt-2 leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-3">Redirecting back in 4s…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
