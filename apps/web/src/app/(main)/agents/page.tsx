import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { AgentsPageClient } from '@/components/AgentsPageClient';
import type { ApiResponse } from '@/types';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

async function getTemplates(): Promise<AgentTemplate[]> {
  try {
    const res = await apiFetch<ApiResponse<AgentTemplate[]>>(
      '/api/v1/agents/templates',
      { cache: 'no-store' },
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function AgentsPage() {
  const templates = await getTemplates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary">AI Agents</h1>
        <p className="text-muted mt-2">
          Pre-built agent templates or create your own custom AI agent
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border h-52 skeleton" />
            ))}
          </div>
        }
      >
        <AgentsPageClient templates={templates} />
      </Suspense>
    </div>
  );
}
