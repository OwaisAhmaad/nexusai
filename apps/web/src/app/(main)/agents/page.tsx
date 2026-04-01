import { AgentsPageClient } from '@/components/AgentsPageClient';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getTemplates(): Promise<AgentTemplate[]> {
  try {
    const res = await fetch(`${API}/api/v1/agents/templates`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json() as { data: AgentTemplate[] };
    return Array.isArray(json?.data) ? json.data : [];
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

      <AgentsPageClient templates={templates} />
    </div>
  );
}
