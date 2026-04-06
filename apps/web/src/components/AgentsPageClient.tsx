'use client';

import { useState } from 'react';
import { AgentCard } from './AgentCard';
import { CreateAgentModal } from './CreateAgentModal';
import Link from 'next/link';

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

/* ── Sign-in modal shown when guest tries to create ── */
function SignInModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl border border-[#E5E5E5] shadow-xl p-8 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1A1A1A] transition text-xl leading-none">✕</button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-[#E8521A] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-black text-[#1A1A1A]">Sign in to create agents</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">Browse templates is free — creating requires an account</p>
        </div>

        {/* Social buttons */}
        <div className="space-y-2.5 mb-5">
          {[
            { icon: '🔵', label: 'Continue with Google',    href: '/auth/login' },
            { icon: '⚫', label: 'Continue with GitHub',    href: '/auth/login' },
            { icon: '🟦', label: 'Continue with Microsoft', href: '/auth/login' },
          ].map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[13px] font-semibold text-[#374151] hover:border-[#1A1A1A] hover:bg-[#F5F4F0] transition"
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        <div className="text-center text-[12px] text-[#9CA3AF]">
          Or{' '}
          <Link href="/auth/login" className="text-[#E8521A] font-semibold hover:underline">sign in with email</Link>
          {' '}·{' '}
          <Link href="/auth/register" className="text-[#E8521A] font-semibold hover:underline">create account</Link>
        </div>
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

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
