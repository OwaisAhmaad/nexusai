import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { AgentCard } from '@/components/AgentCard';
import type { ApiResponse, AgentTemplate } from '@/types';

async function AgentsList() {
  let agents: AgentTemplate[];
  try {
    const res = await apiFetch<ApiResponse<AgentTemplate[]>>(
      '/api/v1/agents/templates',
      { cache: 'no-store' },
    );
    agents = res.data;
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Failed to load agents. Please try again.</p>
      </div>
    );
  }

  if (!agents.length) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-semibold text-text-primary mb-2">No agents yet</p>
        <p className="text-muted">Agent templates will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">AI Agents</h1>
        <p className="text-muted mt-2">
          Pre-built agent templates powered by the best AI models.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface border border-border h-48 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <AgentsList />
      </Suspense>
    </div>
  );
}
