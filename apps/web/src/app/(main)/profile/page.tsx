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
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F4F0]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-5">

        {/* ── 1. HERO CARD ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          {/* Dark gradient banner */}
          <div className="h-32 bg-gradient-to-br from-[#1C1917] via-[#2C2825] to-[#E8521A]/40" />

          <div className="px-6 pb-6">
            {/* Avatar + role badge row */}
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

            <h1 className="text-xl font-black text-[#1A1A1A]">{user.name}</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">{user.email}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Member since {joinDate}</p>
          </div>
        </div>

        {/* ── 2. STATS ROW ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🧠', value: '12', label: 'Models explored' },
            { icon: '🤖', value: '3',  label: 'Agents created' },
            { icon: '💬', value: '47', label: 'Conversations' },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-2xl font-black text-[#1A1A1A] leading-none">{value}</span>
              <span className="text-[11px] text-[#6B7280] mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* ── 3. EDIT PROFILE CARD ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 bg-[#E8521A] rounded-full" />
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Edit Profile</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px]">
              Profile updated successfully!
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
                className="bg-[#F5F4F0] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#E8521A]/30 transition w-full"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                Email <span className="text-[#9CA3AF] font-normal">(read only)</span>
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="bg-[#F5F4F0] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-[14px] text-[#9CA3AF] cursor-not-allowed w-full"
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

        {/* ── 4. ACCOUNT DETAILS CARD ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 bg-[#E8521A] rounded-full" />
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Account Details</h2>
          </div>
          <div className="space-y-0">
            {[
              { label: 'Account ID', value: user.id },
              { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
              { label: 'Member since', value: joinDate },
              { label: 'Status', value: 'Active', isStatus: true },
            ].map(({ label, value, isStatus }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3 border-b border-[#F5F4F0] last:border-0"
              >
                <span className="text-[13px] text-[#6B7280]">{label}</span>
                {isStatus ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#1A1A1A]">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    {value}
                  </span>
                ) : (
                  <span className="text-[13px] font-medium text-[#1A1A1A] truncate max-w-[200px]">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. QUICK ACCESS CARD ── */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-4 bg-[#E8521A] rounded-full" />
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/marketplace', icon: '🛍️', label: 'Marketplace' },
              { href: '/agents',      icon: '🤖', label: 'Agents' },
              { href: '/research',    icon: '🔬', label: 'Research' },
              { href: '/',            icon: '💬', label: 'AI Advisor' },
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

        {/* ── 6. SIGN OUT CARD ── */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">Sign out of NexusAI</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">You will be redirected to the homepage</p>
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
