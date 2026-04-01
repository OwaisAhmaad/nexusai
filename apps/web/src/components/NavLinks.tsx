'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function NavLinks() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? getAccessToken() : null;

  async function handleLogout() {
    const currentToken = getAccessToken();
    if (currentToken) {
      try {
        await apiFetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      } catch {
        // continue even if API call fails
      }
    }
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/auth/login');
    router.refresh();
  }

  if (token) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-muted hover:text-text-primary transition font-medium"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-sm text-muted hover:text-text-primary transition font-medium"
      >
        Sign in
      </Link>
      <Link
        href="/auth/register"
        className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition text-sm font-medium"
      >
        Get started
      </Link>
    </div>
  );
}
