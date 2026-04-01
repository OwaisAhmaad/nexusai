import type { AgentTemplate } from '@/types';

interface AgentCardProps {
  agent: AgentTemplate;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:shadow-md transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 text-xl">
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm">{agent.name}</h3>
          <p className="text-xs text-muted">{agent.model}</p>
        </div>
      </div>

      <p className="text-xs text-muted line-clamp-2 mb-4">{agent.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {agent.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-full text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition text-sm font-medium"
      >
        Use Agent
      </button>
    </div>
  );
}
