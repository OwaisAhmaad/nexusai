interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

interface AgentCardProps {
  agent: AgentTemplate;
  onUse: () => void;
}

export function AgentCard({ agent, onUse }: AgentCardProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:shadow-card-hover transition-all duration-150 card-hover flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center flex-shrink-0 text-xl">
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm">{agent.name}</h3>
          <p className="text-[11px] text-muted mt-0.5">{agent.model}</p>
        </div>
      </div>

      <p className="text-xs text-muted line-clamp-3 mb-4 leading-relaxed flex-1">
        {agent.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {agent.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-full text-muted font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onUse}
        className="w-full bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent-hover transition text-xs font-semibold shadow-accent"
      >
        Use this template →
      </button>
    </div>
  );
}
