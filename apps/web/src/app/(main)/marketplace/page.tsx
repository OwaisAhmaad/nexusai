'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { AIModel } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/* ── Static data ────────────────────────────────────────────── */

const CATEGORIES = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Open Source'];

const AI_LABS_BAR = [
  { name: 'All Labs', count: 525 },
  { name: 'OpenAI', count: 9 },
  { name: 'Anthropic', count: 8 },
  { name: 'GoogleDeepMind', count: 9 },
  { name: 'Meta', count: 8 },
  { name: 'DeepSeek', count: 5 },
  { name: 'Alibaba (Qwen)', count: 5 },
  { name: 'xAI / Grok', count: 4 },
  { name: 'Mistral AI', count: 5 },
  { name: 'Cohere', count: 3 },
  { name: 'Microsoft', count: 3 },
  { name: 'Amazon', count: 2 },
  { name: 'Baidu', count: 4 },
  { name: 'Zhipu AI', count: 3 },
  { name: 'Moonshot AI', count: 3 },
  { name: 'AI21 Labs', count: 4 },
  { name: 'NVIDIA', count: 2 },
];

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere'];
const USE_CASE_TAGS = ['All', 'Coding', 'Writing', 'Analysis', 'Vision', 'Agents'];

const FALLBACK_MODELS: AIModel[] = [
  { id: '1',  name: 'GPT-5',            lab: 'OpenAI',    description: 'OpenAI flagship. Native agent use, advanced reasoning, 2M context.',                                   tags: ['Flagship', 'Agents', 'Multimodal', 'Reasoning'],  contextWindow: 2000000, inputPrice: 3.00,  outputPrice: 15.00, rating: 4.9, reviews: 4210, isNew: false, isFeatured: true,  category: 'language' },
  { id: '2',  name: 'GPT-5.2',          lab: 'OpenAI',    description: 'Mid-tier GPT-5 variant with improved instruction-following and multimodal support.',                  tags: ['Multimodal', 'Balanced', 'Instruction'],          contextWindow: 1000000, inputPrice: 2.50,  outputPrice: 10.00, rating: 4.8, reviews: 3560, isNew: true,  isFeatured: false, category: 'language' },
  { id: '3',  name: 'GPT-5 Turbo',      lab: 'OpenAI',    description: 'Fast, cost-effective GPT-5 for high-volume deployments.',                                             tags: ['Fast', 'Cost-Effective', 'High-Volume'],          contextWindow: 128000,  inputPrice: 1.00,  outputPrice: 4.00,  rating: 4.8, reviews: 2180, isNew: false, isFeatured: false, category: 'language' },
  { id: '4',  name: 'Claude Opus 4.6',  lab: 'Anthropic', description: 'Most intelligent Claude. Adaptive thinking, 1M context, 128K max output, Extended Thinking.',        tags: ['Reasoning', 'Compact', 'Best Value'],             contextWindow: 1000000, inputPrice: 2.00,  outputPrice: 10.00, rating: 4.9, reviews: 2240, isNew: false, isFeatured: true,  category: 'language' },
  { id: '5',  name: 'Claude Sonnet 4.6',lab: 'Anthropic', description: 'Best speed/intelligence balance. Adaptive Thinking, 1M context, 64K max output.',                    tags: ['Balanced', 'Fast', 'Code'],                      contextWindow: 1000000, inputPrice: 0.60,  outputPrice: 3.00,  rating: 4.7, reviews: 3180, isNew: true,  isFeatured: false, category: 'language' },
  { id: '6',  name: 'Claude Haiku 4.5', lab: 'Anthropic', description: 'Fastest near-frontier model. Extended Thinking, 200K context, lowest cost at $1/5 M/Tk.',            tags: ['Fastest', 'Low Cost', 'Real-time'],               contextWindow: 200000,  inputPrice: 0.08,  outputPrice: 0.40,  rating: 4.6, reviews: 1870, isNew: false, isFeatured: false, category: 'language' },
  { id: '7',  name: 'Gemini 3.1 Pro',   lab: 'Google',    description: 'Deep reasoning on up to 5M context and Thought Signatures. Best for long-context analysis.',          tags: ['Deep Reasoning', '5M Context'],                  contextWindow: 5000000, inputPrice: 1.25,  outputPrice: 5.00,  rating: 4.6, reviews: 1120, isNew: true,  isFeatured: false, category: 'multimodal' },
  { id: '8',  name: 'Gemini 2.5 Pro',   lab: 'Google',    description: 'State-of-the-art efficiency with thinking mode. Adaptive reasoning on math, science, and coding.',    tags: ['SOTA', 'Reasoning', '1M Context'],                contextWindow: 1000000, inputPrice: 1.00,  outputPrice: 4.00,  rating: 4.6, reviews: 980,  isNew: false, isFeatured: false, category: 'multimodal' },
  { id: '9',  name: 'Gemini 3 Flash',   lab: 'Google',    description: 'Best-in-class efficiency with thinking mode. Adaptive reasoning at low cost.',                         tags: ['Efficient', 'Thinking Mode', 'Adaptive'],        contextWindow: 1000000, inputPrice: 0.10,  outputPrice: 0.40,  rating: 4.5, reviews: 870,  isNew: false, isFeatured: false, category: 'multimodal' },
  { id: '10', name: 'Llama 4 Maverick', lab: 'Meta',      description: '400B MoE architecture with multimodal capabilities. Top open-source for high-throughput use cases.',  tags: ['Open Source', '400B MoE', 'Multimodal', 'Agentic'], contextWindow: 128000, inputPrice: 0.00, outputPrice: 0.00,  rating: 4.4, reviews: 1200, isNew: true,  isFeatured: false, category: 'language' },
  { id: '11', name: 'DeepSeek R2',      lab: 'DeepSeek',  description: 'GPT-4-level reasoning at 10× lower cost. Best open-source math and coding model.',                    tags: ['Reasoning', 'Math', 'Open Source'],              contextWindow: 64000,   inputPrice: 0.14,  outputPrice: 0.28,  rating: 4.5, reviews: 890,  isNew: false, isFeatured: false, category: 'language' },
  { id: '12', name: 'Mistral Large',    lab: 'Mistral AI',description: 'European AI champion. Strong multilingual support and instruction following.',                          tags: ['Multilingual', 'Instructions', 'EU'],            contextWindow: 128000,  inputPrice: 2.00,  outputPrice: 6.00,  rating: 4.5, reviews: 760,  isNew: false, isFeatured: false, category: 'language' },
];

/* ── Lab color dot ──────────────────────────────────────────── */
const LAB_DOT: Record<string, string> = {
  OpenAI:    'bg-green-500',
  Anthropic: 'bg-violet-500',
  Google:    'bg-blue-500',
  Meta:      'bg-sky-500',
  DeepSeek:  'bg-indigo-500',
  'Mistral AI': 'bg-amber-500',
};
function labDot(lab: string) {
  return LAB_DOT[lab] ?? 'bg-gray-400';
}

/* ── HOW TO USE steps ───────────────────────────────────────── */
const HOW_TO_STEPS = [
  'Get your API key from the provider\'s developer dashboard.',
  'Install the SDK: npm install openai (or the relevant SDK for this model).',
  'Initialize the client with your API key and model endpoint.',
  'Make your first API call, passing the model name and your prompt.',
  'Handle the response, implement error handling, and iterate on your prompt.',
];

/* ── Page ───────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [models, setModels] = useState<AIModel[]>(FALLBACK_MODELS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLab, setActiveLab] = useState('All Labs');
  const [activeUseCase, setActiveUseCase] = useState('All');
  const [selectedProviders, setSelectedProviders] = useState<string[]>(PROVIDERS);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState<'any' | '4' | '4.5'>('any');
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [detailTab, setDetailTab] = useState('Overview');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchModels = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50', page: '1' });
      if (q) params.set('search', q);
      const res = await fetch(`${API}/api/v1/models?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const json = (await res.json()) as { data: AIModel[] };
      if (Array.isArray(json?.data) && json.data.length > 0) setModels(json.data);
      else setModels(FALLBACK_MODELS);
    } catch {
      setModels(FALLBACK_MODELS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchModels(''); }, [fetchModels]);

  function handleSearch(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchModels(val), 300);
  }

  function toggleProvider(p: string) {
    setSelectedProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  /* filtered models */
  const displayed = models.filter((m) => {
    if (selectedProviders.length > 0 && !selectedProviders.some((p) => m.lab.includes(p))) return false;
    if (activeCategory !== 'All' && !m.category.toLowerCase().includes(activeCategory.toLowerCase())) return false;
    if (activeLab !== 'All Labs' && !m.lab.toLowerCase().includes(activeLab.toLowerCase().replace(' / ', '').replace(' (qwen)', ''))) return false;
    if (m.inputPrice > maxPrice && m.inputPrice !== 0) return false;
    if (minRating === '4' && m.rating < 4) return false;
    if (minRating === '4.5' && m.rating < 4.5) return false;
    return true;
  });

  const DETAIL_TABS = ['Overview', 'How to Use', 'Pricing', 'Prompt Guide', 'Agent Creation', 'Reviews'];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F4F0]">

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-black text-[#1A1A1A] flex-shrink-0">Model Marketplace</h1>

        {/* Search */}
        <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-xl px-3 py-2 bg-[#F5F4F0] w-64">
          <svg className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search models, capabilities..."
            className="bg-transparent text-[13px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none flex-1"
          />
        </div>

        {/* Toolbar icons */}
        {['📎', '⚙', '✦'].map((ic) => (
          <button key={ic} type="button" className="w-8 h-8 border border-[#E5E5E5] rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] transition text-sm">
            {ic}
          </button>
        ))}

        {/* Category tabs */}
        <div className="flex items-center gap-1 ml-auto flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition ${
                activeCategory === cat
                  ? 'bg-[#E8521A] text-white'
                  : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F4F0]'
              }`}
            >
              {cat === 'All' ? `${cat} ●` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── AI LABS BAR ── */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[12px] font-bold text-[#374151] flex-shrink-0 mr-1">🏛 AI Labs ▼</span>
        {AI_LABS_BAR.map((lab) => (
          <button
            key={lab.name}
            type="button"
            onClick={() => setActiveLab(lab.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition ${
              activeLab === lab.name
                ? 'bg-[#E8521A] text-white'
                : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#E8521A] hover:text-[#E8521A]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${labDot(lab.name)}`} />
            {lab.name} ({lab.count})
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-[#E5E5E5] overflow-y-auto p-4">

          {/* Need help banner */}
          <div className="bg-[#FFF8F5] border border-[#E8521A]/20 rounded-xl p-3 mb-5">
            <p className="text-[#E8521A] text-[13px] font-bold">+ Need help choosing?</p>
            <p className="text-[12px] text-[#6B7280] mt-1">Chat with our AI guide for a personalised recommendation in 60 seconds.</p>
            <Link href="/chat-hub" className="inline-block mt-2 text-[#E8521A] border border-[#E8521A] rounded-lg px-3 py-1.5 text-[12px] font-semibold hover:bg-[#FFF8F5] transition">
              Chat with AI →
            </Link>
          </div>

          {/* Provider */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Provider</p>
            {PROVIDERS.map((p) => (
              <label key={p} className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(p)}
                  onChange={() => toggleProvider(p)}
                  className="rounded accent-[#E8521A]"
                />
                <span className="text-[13px] text-[#374151]">{p}</span>
              </label>
            ))}
          </div>

          {/* Pricing model */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Pricing Model</p>
            {['Pay-per-use', 'Subscription', 'Free tier', 'Enterprise'].map((p, i) => (
              <label key={p} className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked={i < 2} className="rounded accent-[#E8521A]" />
                <span className="text-[13px] text-[#374151]">{p}</span>
              </label>
            ))}
          </div>

          {/* Max price */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Max Price /1M Tokens</p>
            <input
              type="range" min={0} max={100} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#E8521A]"
            />
            <p className="text-[12px] text-[#6B7280] mt-1">Up to ${maxPrice}</p>
          </div>

          {/* Min rating */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Min Rating</p>
            {([['any', 'Any'], ['4', '4+ ⭐'], ['4.5', '4.5+ ⭐']] as const).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="radio" name="rating" value={v}
                  checked={minRating === v}
                  onChange={() => setMinRating(v)}
                  className="accent-[#E8521A]"
                />
                <span className="text-[13px] text-[#374151]">{label}</span>
              </label>
            ))}
          </div>

          {/* Licence */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Licence</p>
            {['Commercial', 'Open source', 'Research only'].map((l, i) => (
              <label key={l} className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked={i < 2} className="rounded accent-[#E8521A]" />
                <span className="text-[13px] text-[#374151]">{l}</span>
              </label>
            ))}
          </div>

          {/* Quick guides */}
          <div className="mb-5">
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Quick Guides</p>
            {[['📐', 'Prompt engineering tips'], ['🤖', 'Agent creation guide'], ['💰', 'Pricing comparison']].map(([ic, label]) => (
              <button key={label} type="button" className="flex items-center gap-2 py-1.5 text-[13px] text-[#374151] hover:text-[#E8521A] transition w-full text-left">
                <span>{ic}</span>{label}
              </button>
            ))}
          </div>

          {/* Use case */}
          <div>
            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Use Case</p>
            <div className="flex flex-wrap gap-1.5">
              {USE_CASE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveUseCase(tag)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                    activeUseCase === tag ? 'bg-[#E8521A] text-white' : 'bg-[#F5F4F0] text-[#374151] hover:bg-[#E8521A]/10'
                  }`}
                >
                  {tag === 'All' ? 'All ●' : tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MODEL GRID ── */}
        <main className="flex-1 overflow-y-auto p-6">
          <p className="text-[12px] text-[#9CA3AF] mb-4">
            Showing <span className="font-semibold text-[#1A1A1A]">{displayed.length}</span> of{' '}
            <span className="font-semibold text-[#1A1A1A]">{models.length}</span> models
            {loading && <span className="ml-2 text-[#E8521A]">Loading…</span>}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => { setSelectedModel(model); setDetailTab('Overview'); }}
                className="rounded-xl bg-white border border-[#E5E5E5] p-4 hover:shadow-md transition text-left group"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0 ${labDot(model.lab)}`}>
                      {model.name[0]}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight group-hover:text-[#E8521A] transition">{model.name}</p>
                      <p className="text-[11px] text-[#6B7280]">{model.lab}</p>
                    </div>
                  </div>
                  {model.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex-shrink-0">Hot</span>
                  )}
                  {model.isNew && !model.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">New</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[12px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">{model.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {model.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F4F0] text-[#374151]">{tag}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[#F59E0B] text-[11px]">{'★'.repeat(Math.round(model.rating))}</span>
                    <span className="text-[11px] text-[#9CA3AF]">{model.rating} ({model.reviews.toLocaleString()})</span>
                  </div>
                  <span className="text-[12px] font-semibold text-[#374151]">
                    {model.inputPrice === 0 ? 'Free' : `$${model.inputPrice.toFixed(2)}/1M tk`}
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-[#E8521A] mt-2 group-hover:underline">How to Use →</p>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* ── MODEL DETAIL MODAL ── */}
      {selectedModel && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedModel(null); }}
        >
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${labDot(selectedModel.lab)}`}>
                  {selectedModel.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1A1A1A]">{selectedModel.name}</h2>
                  <p className="text-[13px] text-[#6B7280]">{selectedModel.lab}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">Live</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="w-8 h-8 rounded-full bg-[#F5F4F0] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E5E5] transition"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E5E5] px-6 overflow-x-auto">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
                    detailTab === tab
                      ? 'border-[#E8521A] text-[#E8521A]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">

              {detailTab === 'Overview' && (
                <div className="space-y-5">
                  <p className="text-[14px] text-[#374151] leading-relaxed">{selectedModel.description}</p>
                  <div>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.tags.map((tag) => (
                        <span key={tag} className="bg-[#F5F4F0] border border-[#E5E5E5] text-[#374151] text-[12px] font-semibold px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Context Window', value: `${(selectedModel.contextWindow / 1000).toFixed(0)}K` },
                      { label: 'Input /1M', value: selectedModel.inputPrice === 0 ? 'Free' : `$${selectedModel.inputPrice.toFixed(2)}` },
                      { label: 'Output /1M', value: selectedModel.outputPrice === 0 ? 'Free' : `$${selectedModel.outputPrice.toFixed(2)}` },
                    ].map((m) => (
                      <div key={m.label} className="bg-[#F5F4F0] rounded-xl p-4 text-center">
                        <p className="text-xl font-black text-[#1A1A1A]">{m.value}</p>
                        <p className="text-[11px] text-[#6B7280] mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#F5F4F0] rounded-xl p-4">
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Example Prompt</p>
                    <p className="text-[13px] text-[#374151] font-mono">Summarise this research paper in 5 bullet points, focusing on the key findings and their implications.</p>
                  </div>
                </div>
              )}

              {detailTab === 'How to Use' && (
                <div className="space-y-4">
                  <ol className="space-y-3">
                    {HOW_TO_STEPS.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#E8521A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-[14px] text-[#374151] leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <div className="bg-[#1A1A1A] rounded-xl p-4 mt-4">
                    <p className="text-[12px] text-[#9CA3AF] mb-2 font-mono">Python</p>
                    <pre className="text-[12px] text-[#E5E5E5] font-mono leading-relaxed overflow-x-auto">{`import openai

client = openai.OpenAI(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="${selectedModel.name.toLowerCase().replace(/ /g, '-')}",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`}</pre>
                  </div>
                </div>
              )}

              {detailTab === 'Pricing' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { plan: 'Pay-per-use', price: `$${selectedModel.inputPrice.toFixed(2)}/1M`, desc: 'Input tokens. No subscription required.', color: 'border-[#E5E5E5]' },
                    { plan: 'Pro', price: '$49/mo', desc: '5M tokens/month included. Priority support.', color: 'border-[#E8521A]' },
                    { plan: 'Enterprise', price: 'Custom', desc: 'Dedicated capacity, SLA, volume discounts.', color: 'border-[#E5E5E5]' },
                  ].map((p) => (
                    <div key={p.plan} className={`border-2 ${p.color} rounded-xl p-4`}>
                      <p className="text-[13px] font-bold text-[#1A1A1A]">{p.plan}</p>
                      <p className="text-2xl font-black text-[#E8521A] my-2">{p.price}</p>
                      <p className="text-[12px] text-[#6B7280]">{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === 'Prompt Guide' && (
                <div className="space-y-4">
                  {[
                    { title: 'Be specific about format', tip: 'Tell the model exactly what format you want: "Reply in JSON", "Use bullet points", "Write 3 paragraphs".' },
                    { title: 'Set the context', tip: 'Start with role context: "You are an expert in X. Your job is to…" — this dramatically improves output quality.' },
                    { title: 'Give examples', tip: 'Include 1–2 examples of the output you want. Few-shot prompting is one of the most reliable techniques.' },
                    { title: 'Iterate and refine', tip: 'Treat prompting as a conversation. If the first answer isn\'t right, follow up with: "That\'s close, but please also…"' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 p-4 bg-[#F5F4F0] rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-[#E8521A] text-white flex items-center justify-center text-[14px] flex-shrink-0">✦</div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">{item.title}</p>
                        <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === 'Agent Creation' && (
                <div className="space-y-4">
                  {[
                    'Define your agent\'s purpose and target audience clearly.',
                    'Write a system prompt that establishes role, tone, and constraints.',
                    'Choose tools your agent needs: web search, code execution, APIs.',
                    'Set memory settings — short-term context and long-term user preferences.',
                    'Test with real-world scenarios before deploying.',
                    'Monitor outputs and iterate on the system prompt based on results.',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#E8521A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-[14px] text-[#374151] leading-relaxed">{step}</p>
                    </div>
                  ))}
                  <Link
                    href="/agents"
                    className="inline-flex items-center gap-2 mt-4 bg-[#E8521A] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#d04415] transition"
                  >
                    Open Agent Builder →
                  </Link>
                </div>
              )}

              {detailTab === 'Reviews' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-black text-[#1A1A1A]">{selectedModel.rating}</p>
                      <p className="text-[#F59E0B] text-xl">{'★'.repeat(Math.round(selectedModel.rating))}</p>
                      <p className="text-[12px] text-[#6B7280]">{selectedModel.reviews.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[12px] text-[#6B7280] w-4">{star}</span>
                          <div className="flex-1 bg-[#F5F4F0] rounded-full h-2">
                            <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: `${star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : 3}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { name: 'Alex M.', stars: 5, text: 'Incredibly fast and accurate. Best model for my coding use case by far.' },
                    { name: 'Priya K.', stars: 5, text: 'The context window is a game-changer for document analysis workflows.' },
                    { name: 'James T.', stars: 4, text: 'Excellent results on complex reasoning tasks. Pricing is fair for the quality.' },
                  ].map((r) => (
                    <div key={r.name} className="bg-[#F5F4F0] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[13px] font-bold text-[#1A1A1A]">{r.name}</p>
                        <span className="text-[#F59E0B] text-[12px]">{'★'.repeat(r.stars)}</span>
                      </div>
                      <p className="text-[13px] text-[#374151]">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
