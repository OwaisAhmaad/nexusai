'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  createdAt?: string;
}

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function Avatar({ user, size = 'lg' }: { user: UserProfile; size?: 'sm' | 'lg' }) {
  const parts = user.name.trim().split(' ');
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  const dim = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${dim} rounded-full object-cover border-4 border-white shadow-md`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-[#E8521A] flex items-center justify-center border-4 border-white shadow-md`}>
      <span className="font-black text-white uppercase">{letters}</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName]       = useState('');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    apiFetch<{ data: UserProfile }>('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    setSaving(true);
    setError('');
    const token = getToken();
    try {
      const res = await apiFetch<{ data: UserProfile }>('/api/v1/users/me', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token ?? ''}` },
        body: JSON.stringify({ name: name.trim() }),
      });
      setUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    const token = getToken();
    if (token) {
      apiFetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/');
    router.refresh();
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#E8521A] border-t-transparent animate-spin" />
          <p className="text-[#6B7280] text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0] py-10 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Back link ── */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition">
          ← Back to home
        </Link>

        {/* ── Profile hero card ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-[#E8521A] to-[#f87c52]" />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <Avatar user={user} size="lg" />
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize border ${
                  user.role === 'admin'
                    ? 'bg-violet-50 text-violet-700 border-violet-200'
                    : 'bg-[#F0FDF4] text-green-700 border-green-200'
                }`}
              >
                {user.role}
              </span>
            </div>

            <h1 className="text-xl font-bold text-[#1A1A1A]">{user.name}</h1>
            <p className="text-[13px] text-[#6B7280]">{user.email}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Member since {joinDate}</p>
          </div>
        </div>

        {/* ── Edit profile form ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-1.5 mb-5">
            <span className="text-[#E8521A] text-sm">✦</span>
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Edit Profile</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
              ⚠️ {error}
            </div>
          )}

          {saved && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px]">
              ✅ Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={50}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#F5F4F0] text-[#1A1A1A] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 focus:border-[#E8521A] transition"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                Email <span className="text-[#9CA3AF] font-normal">(cannot be changed)</span>
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#EDECE8] text-[#9CA3AF] text-[14px] cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving || name.trim() === user.name || !name.trim()}
                className="bg-[#E8521A] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#d04415] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => setName(user.name)}
                className="text-[13px] text-[#6B7280] border border-[#E5E5E5] px-5 py-2.5 rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition"
              >
                Discard
              </button>
            </div>
          </form>
        </div>

        {/* ── Account info ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-1.5 mb-5">
            <span className="text-[#E8521A] text-sm">✦</span>
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Account</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Account ID', value: user.id },
              { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
              { label: 'Member since', value: joinDate },
              { label: 'Status', value: 'Active' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#F0EEE9] last:border-0">
                <span className="text-[13px] text-[#6B7280]">{label}</span>
                <span className="text-[13px] font-medium text-[#1A1A1A] truncate max-w-[200px]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[#E8521A] text-sm">✦</span>
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/marketplace', icon: '🛍️', label: 'Marketplace' },
              { href: '/agents', icon: '🤖', label: 'Agents' },
              { href: '/research', icon: '🔬', label: 'Research' },
              { href: '/', icon: '💬', label: 'AI Advisor' },
            ].map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E5] hover:border-[#E8521A]/40 hover:bg-[#FFF8F5] transition"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[13px] font-medium text-[#374151]">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-red-500 text-sm">⚠</span>
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Session</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#1A1A1A]">Sign out of NexusAI</p>
              <p className="text-[12px] text-[#9CA3AF]">You will be redirected to the homepage</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[13px] font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
