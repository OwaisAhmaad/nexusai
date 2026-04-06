'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return <span className="text-[13px] font-bold text-white uppercase">{letters}</span>;
}

export function NavLinks() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiFetch<{ data: UserProfile }>('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    const token = getToken();
    if (token) {
      try {
        await apiFetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* proceed */ }
    }
    document.cookie = 'access_token=; path=/; max-age=0';
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  /* ── Logged in — avatar + dropdown ── */
  if (user) {
    return (
      <div className="hidden md:flex items-center gap-2 relative" ref={dropRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F5F4F0] transition"
          aria-label="Profile menu"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#E8521A]/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E8521A] flex items-center justify-center flex-shrink-0">
              <Initials name={user.name} />
            </div>
          )}
          <div className="text-left">
            <p className="text-[12px] font-semibold text-[#1A1A1A] leading-tight">{user.name.split(' ')[0]}</p>
            <p className="text-[10px] text-[#9CA3AF] leading-tight capitalize">{user.role}</p>
          </div>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`text-[#9CA3AF] transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E5E5E5] shadow-lg py-1 z-50">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-[#F0EEE9]">
              <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{user.name}</p>
              <p className="text-[11px] text-[#9CA3AF] truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F5F4F0] transition"
              >
                <span className="text-base">👤</span> My Profile
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F5F4F0] transition"
              >
                <span className="text-base">🛍️</span> Marketplace
              </Link>
            </div>

            <div className="border-t border-[#F0EEE9] py-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition text-left"
              >
                <span className="text-base">🚪</span> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Logged out — sign in / get started ── */
  return (
    <div className="hidden md:flex items-center gap-2">
      <Link
        href="/auth/login"
        className="px-3 py-2 rounded-lg text-sm text-muted hover:text-text-primary hover:bg-background transition font-medium"
      >
        Sign in
      </Link>
      <Link
        href="/auth/register"
        className="bg-[#E8521A] text-white px-4 py-2 rounded-full hover:bg-[#d04415] transition text-sm font-semibold"
      >
        Try free →
      </Link>
    </div>
  );
}
