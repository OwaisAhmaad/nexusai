'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function AgentsPageClient({ templates }: AgentsPageClientProps) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  function requireAuth(action: () => void) {
    if (!getToken()) {
      router.push('/auth/login');
      return;
    }
    action();
  }

  function handleUseTemplate(template: AgentTemplate) {
    requireAuth(() => {
      setSelectedTemplate(template);
      setShowCreateModal(true);
    });
  }

  function handleCreate() {
    requireAuth(() => {
      setSelectedTemplate(null);
      setShowCreateModal(true);
    });
  }

  return (
    <>
      {/* Agent templates */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Agent Templates</h2>
            <p className="text-sm text-muted mt-0.5">Start fast with a pre-built template — <Link href="/auth/login" className="text-[#E8521A] hover:underline">sign in</Link> to create your own</p>
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
    </>
  );
}
