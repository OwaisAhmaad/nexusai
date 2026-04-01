'use client';

import { useState, FormEvent } from 'react';
import { apiFetch } from '@/lib/api';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  tags: string[];
  icon: string;
}

interface CreateAgentModalProps {
  template: AgentTemplate | null;
  onClose: () => void;
}

const MODELS = [
  'GPT-4o', 'Claude Opus 4.6', 'Claude Sonnet 4.6', 'Gemini 2.5 Pro',
  'Gemini 2.0 Flash', 'GPT-4o mini', 'Llama 3.3 70B', 'Mistral Large',
  'DeepSeek R1', 'Claude Haiku 4.5',
];

export function CreateAgentModal({ template, onClose }: CreateAgentModalProps) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [model, setModel] = useState(template?.model || 'GPT-4o');
  const [icon, setIcon] = useState(template?.icon || '🤖');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/)?.[1];
    if (!token) {
      setError('You must be signed in to create an agent.');
      setLoading(false);
      return;
    }

    try {
      await apiFetch('/api/v1/agents/my', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          description,
          model,
          tags: template?.tags || [],
          icon,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface rounded-2xl border border-border w-full max-w-md shadow-xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">
            {template ? `Use "${template.name}" template` : 'Create new agent'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-text-primary transition p-1 rounded-lg hover:bg-background"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-text-primary text-lg mb-1">Agent created!</h3>
            <p className="text-sm text-muted mb-5">Your agent is ready to use.</p>
            <button
              type="button"
              onClick={onClose}
              className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <div className="w-14">
                <label className="block text-xs font-medium text-text-primary mb-1">Icon</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                  className="w-full text-center text-xl px-2 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-primary mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="My Research Agent"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="What does this agent do?"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent bg-background resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">AI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent bg-background"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-text-primary hover:bg-background transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition shadow-accent disabled:opacity-60"
              >
                {loading ? 'Creating...' : 'Create agent'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
