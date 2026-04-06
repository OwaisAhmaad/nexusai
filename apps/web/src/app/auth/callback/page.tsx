'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = params.get('token');
    const provider = params.get('provider');
    const error = params.get('error');

    if (error || !token) {
      setStatus('error');
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    // Store token
    localStorage.setItem('nexusai_token', token);
    localStorage.setItem('nexusai_provider', provider ?? '');
    setStatus('success');
    setTimeout(() => router.push('/chat-hub'), 1500);
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center max-w-sm w-full shadow-sm">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-[#E8521A] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-[15px] font-bold text-[#1A1A1A]">Signing you in&hellip;</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-2xl">&#10003;</div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">Signed in successfully!</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Redirecting to Chat Hub&hellip;</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-2xl">&#10005;</div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">Sign-in failed</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Redirecting back&hellip;</p>
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
