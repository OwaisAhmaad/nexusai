'use client';
import { useState, useEffect } from 'react';

interface ResearchPaper {
  id: string;
  date: string | number;
  month?: string;
  lab: string;
  category: string;
  categoryColor: string;
  title: string;
  desc: string;
  authors?: string;
  fullDesc?: string;
  metrics?: { value: string; label: string }[];
  findings?: string[];
  models?: string[];
  impact?: string;
  citation?: string;
  arxiv?: string;
}

/* Raw shape returned by /api/v1/research */
interface ApiPaper {
  _id?: string;
  id?: string;
  title: string;
  summary: string;
  source: string;
  date: number;
  month: string;
  status?: string;
}

const SOURCE_META: Record<string, { category: string; categoryColor: string }> = {
  'Anthropic Blog': { category: 'ALIGNMENT', categoryColor: 'bg-green-100 text-green-700' },
  arXiv: { category: 'ALIGNMENT', categoryColor: 'bg-green-100 text-green-700' },
  'DeepSeek Research': { category: 'OPEN WEIGHTS', categoryColor: 'bg-indigo-100 text-indigo-700' },
  'Google Research': { category: 'REASONING', categoryColor: 'bg-blue-100 text-blue-700' },
  'Meta AI': { category: 'OPEN WEIGHTS', categoryColor: 'bg-sky-100 text-sky-700' },
  'OpenAI Blog': { category: 'EFFICIENCY', categoryColor: 'bg-amber-100 text-amber-700' },
};

function mapApiPaper(p: ApiPaper, i: number): ResearchPaper {
  const meta = SOURCE_META[p.source] ?? {
    category: 'RESEARCH',
    categoryColor: 'bg-gray-100 text-gray-700',
  };
  return {
    id: p._id ?? p.id ?? String(i + 1),
    date: p.date,
    month: p.month,
    lab: p.source,
    category: meta.category,
    categoryColor: meta.categoryColor,
    title: p.title,
    desc: p.summary,
    fullDesc: p.summary,
  };
}

const PAPERS: ResearchPaper[] = [
  {
    id: '1',
    date: 'MAR 26',
    lab: 'Google DeepMind',
    category: 'REASONING',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks',
    desc: 'Scores 83.2% on AIME 2025 math competition and sets new records across 10+ reasoning benchmarks.',
    authors: 'Anil, R., Borgeaud, S., Wu, Y., et al.',
    fullDesc:
      'Google DeepMind releases Gemini 2.5 Pro with breakthrough performance on mathematical and logical reasoning tasks. The model achieves 83.2% on AIME 2025, surpassing all previous frontier models by a significant margin. Key innovations include improved chain-of-thought prompting, extended thinking mode, and a 5M context window enabling unprecedented long-document reasoning.',
    metrics: [
      { value: '83.2%', label: 'AIME 2025 score' },
      { value: '+6.4%', label: 'vs prior SOTA' },
      { value: '5M ctx', label: 'Context window' },
    ],
    findings: [
      'Achieves 83.2% on AIME 2025, a 6.4% improvement over previous best',
      'Sets new SOTA on MATH-500, GPQA Diamond, and LiveCodeBench',
      'Extended Thinking mode enables step-by-step verification of complex proofs',
      '5M token context window enables full-codebase and full-document reasoning',
    ],
    models: ['Gemini 2.5 Pro', 'GPT-5', 'Claude Opus 4.6', 'o3'],
    impact: 'High — sets new benchmark baseline for all future frontier model evaluations.',
    citation:
      'Anil, R. et al. (2026). Gemini 2.5 Pro: Advanced Reasoning at Scale. Google DeepMind Technical Report.',
    arxiv: 'arXiv:2603.08821',
  },
  {
    id: '2',
    date: 'MAR 22',
    lab: 'MIT CSAIL',
    category: 'MULTIMODAL',
    categoryColor: 'bg-purple-100 text-purple-700',
    title: 'Scaling laws for multimodal models: new empirical findings',
    desc: 'Research reveals unexpected scaling dynamics when combining vision and language modalities at scale.',
    authors: 'Zhang, L., Chen, M., Kumar, A., et al.',
    fullDesc:
      'MIT CSAIL researchers publish comprehensive scaling law analysis covering 50+ multimodal model checkpoints. The study reveals that vision-language models follow different scaling curves than pure language models, with emergent capabilities appearing at lower parameter counts when trained on diverse multimodal data.',
    metrics: [
      { value: '50+', label: 'Models studied' },
      { value: '3.2×', label: 'Efficiency gain' },
      { value: '12B', label: 'Emergence threshold' },
    ],
    findings: [
      'Multimodal scaling diverges from Chinchilla laws beyond 70B parameters',
      'Vision tokens require 2.3× more compute budget for optimal training',
      'Emergent cross-modal reasoning appears at lower thresholds than expected',
      'Data quality outweighs quantity above the 12B parameter threshold',
    ],
    models: ['GPT-5', 'Gemini 2.5 Pro', 'Claude Opus 4.6', 'LLaVA-Next'],
    impact: 'Medium — provides actionable guidance for teams training multimodal models.',
    citation:
      'Zhang, L. et al. (2026). Multimodal Scaling Laws: An Empirical Study. MIT CSAIL Technical Report.',
    arxiv: 'arXiv:2603.07234',
  },
  {
    id: '3',
    date: 'MAR 18',
    lab: 'Anthropic',
    category: 'ALIGNMENT',
    categoryColor: 'bg-green-100 text-green-700',
    title: 'Constitutional AI v2: improved alignment through iterative refinement',
    desc: 'New methodology achieves 40% reduction in harmful outputs while maintaining 98% helpfulness scores.',
    authors: 'Bai, Y., Jones, A., Ndousse, K., et al.',
    fullDesc:
      'Anthropic introduces Constitutional AI v2, a significantly improved alignment methodology that combines RLHF with constitutional self-critique. The new approach achieves a 40% reduction in harmful outputs across all test categories while maintaining 98% helpfulness on standard benchmarks.',
    metrics: [
      { value: '-40%', label: 'Harmful outputs' },
      { value: '98%', label: 'Helpfulness score' },
      { value: '2.5×', label: 'Faster training' },
    ],
    findings: [
      '40% reduction in harmful outputs without helpfulness degradation',
      'Constitutional self-critique enables models to identify their own misalignments',
      'Iterative refinement converges 2.5× faster than standard RLHF',
      'Technique generalizes across model sizes from 7B to 200B parameters',
    ],
    models: ['Claude Opus 4.6', 'Claude Sonnet 4.6', 'Claude Haiku 4.5'],
    impact: 'High — represents significant progress toward scalable AI alignment.',
    citation:
      'Bai, Y. et al. (2026). Constitutional AI v2: Scalable Alignment via Self-Critique. Anthropic Research.',
    arxiv: 'arXiv:2603.05891',
  },
  {
    id: '4',
    date: 'MAR 15',
    lab: 'Meta AI',
    category: 'OPEN WEIGHTS',
    categoryColor: 'bg-sky-100 text-sky-700',
    title: 'Llama 4 Scout & Maverick: natively multimodal from the ground up',
    desc: '1TB MoE architecture trained on 40 trillion tokens with native vision and audio understanding.',
    authors: 'Touvron, H., Martin, L., Stone, K., et al.',
    fullDesc:
      'Meta AI releases Llama 4 Scout and Maverick as fully open-weight models with native multimodal capabilities. The Mixture-of-Experts architecture enables efficient inference despite the massive 1TB total parameter count. Both models support text, images, video frames, and audio inputs natively.',
    metrics: [
      { value: '1TB', label: 'MoE parameters' },
      { value: '40T', label: 'Training tokens' },
      { value: '4', label: 'Modalities' },
    ],
    findings: [
      'First open-weight model to natively support all four modalities simultaneously',
      'MoE architecture activates only 17B parameters per forward pass',
      'Matches GPT-5 on coding benchmarks while being fully open-source',
      'Full fine-tuning enabled on 8× A100 cluster with gradient checkpointing',
    ],
    models: ['Llama 4 Scout', 'Llama 4 Maverick', 'GPT-5', 'Gemini 2.5 Pro'],
    impact: 'Very High — democratizes frontier multimodal capabilities for the open-source community.',
    citation:
      'Touvron, H. et al. (2026). Llama 4: Natively Multimodal Open Foundation Models. Meta AI Research.',
    arxiv: 'arXiv:2603.04127',
  },
  {
    id: '5',
    date: 'MAR 10',
    lab: 'Stanford NLP',
    category: 'EFFICIENCY',
    categoryColor: 'bg-amber-100 text-amber-700',
    title: 'Long-context recall: how models handle 1M+ token windows',
    desc: 'Comprehensive evaluation shows sharp recall degradation beyond 200K tokens in most frontier models.',
    authors: 'Liang, P., Bommasani, R., Lee, T., et al.',
    fullDesc:
      'Stanford NLP Group publishes the most comprehensive long-context evaluation to date, testing 15 frontier models on tasks requiring recall across 100K to 2M token contexts. The study reveals systematic performance degradation and identifies architectural factors that predict long-context success.',
    metrics: [
      { value: '15', label: 'Models tested' },
      { value: '200K', label: 'Degradation point' },
      { value: '2M', label: 'Max context tested' },
    ],
    findings: [
      'All tested models show >20% recall degradation beyond 200K tokens',
      'Sliding window attention outperforms full attention beyond 500K tokens',
      'Gemini 2.5 Pro shows least degradation due to ring-attention architecture',
      'Task type significantly impacts long-context performance — retrieval vs. reasoning',
    ],
    models: ['Gemini 2.5 Pro', 'Claude Opus 4.6', 'GPT-5', 'Llama 4'],
    impact: 'Medium — essential reading for teams building long-document RAG systems.',
    citation:
      'Liang, P. et al. (2026). HELMET: How to Evaluate Long-context Models Effectively and Thoroughly. Stanford NLP.',
    arxiv: 'arXiv:2603.02847',
  },
  {
    id: '6',
    date: 'MAR 5',
    lab: 'DeepSeek',
    category: 'OPEN WEIGHTS',
    categoryColor: 'bg-indigo-100 text-indigo-700',
    title: 'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost',
    desc: 'Full weight release enables fine-tuning of GPT-4-level reasoning models for under $100.',
    authors: 'DeepSeek-AI Team',
    fullDesc:
      'DeepSeek releases full weights for DeepSeek-R1, their frontier reasoning model, under an open license permitting commercial use. The release includes training code, dataset recipes, and detailed ablation studies. The model achieves GPT-4-level performance on math and coding tasks at 10× lower inference cost.',
    metrics: [
      { value: '10×', label: 'Cost reduction' },
      { value: '$100', label: 'Fine-tuning cost' },
      { value: '97%', label: 'vs GPT-4 on MATH' },
    ],
    findings: [
      'Full commercial-use weights released for 7B, 14B, 32B, and 70B variants',
      'Reinforcement learning from scratch (without SFT warm-up) achieves frontier math',
      'Knowledge distillation from R1-Zero enables 7B models to perform like 70B',
      'Inference cost ~$0.14/M tokens vs $15/M for comparable OpenAI models',
    ],
    models: ['DeepSeek-R1', 'DeepSeek-R1-Zero', 'GPT-4', 'o1'],
    impact: 'Very High — fundamentally changes the economics of deploying reasoning models.',
    citation:
      'DeepSeek-AI. (2026). DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning.',
    arxiv: 'arXiv:2603.01234',
  },
];

/** Format the left-sidebar date chip */
function sidebarDate(paper: ResearchPaper): string {
  if (typeof paper.date === 'number') {
    return paper.month ? `${paper.month.toUpperCase()} ${paper.date}` : String(paper.date);
  }
  return paper.date;
}

const MONTH_FULL: Record<string, string> = {
  JAN: 'January', FEB: 'February', MAR: 'March', APR: 'April',
  MAY: 'May',     JUN: 'June',     JUL: 'July',  AUG: 'August',
  SEP: 'September', OCT: 'October', NOV: 'November', DEC: 'December',
};

/** Format the right-panel header date — locale-independent to avoid SSR/client mismatch */
function headerDate(paper: ResearchPaper): string {
  if (typeof paper.date === 'number') {
    const monthName = paper.month
      ? (MONTH_FULL[paper.month.toUpperCase()] ?? paper.month)
      : 'March';
    return `${monthName} ${paper.date}, 2026`;
  }
  // string like "MAR 26" → "March 26, 2026"
  const parts = paper.date.split(' ');
  if (parts.length === 2) {
    const monthName = MONTH_FULL[parts[0].toUpperCase()] ?? parts[0];
    return `${monthName} ${parts[1]}, 2026`;
  }
  return `March ${paper.date}, 2026`;
}

const FILTER_TABS = [
  { label: 'All', match: 'all' },
  { label: '🧠 Reasoning', match: 'reasoning' },
  { label: '🌐 Multimodal', match: 'multimodal' },
  { label: '🛡️ Alignment', match: 'alignment' },
  { label: '⚡ Efficiency', match: 'efficiency' },
  { label: '🔓 Open Weights', match: 'openweights' },
];

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>(PAPERS);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper>(PAPERS[0]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPapers() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/v1/research?limit=10`);
        if (res.ok) {
          const json = (await res.json()) as { data?: ApiPaper[] };
          const fetched = Array.isArray(json?.data) ? json.data : [];
          if (fetched.length > 0) {
            const mapped = fetched.map(mapApiPaper);
            setPapers(mapped);
            setSelectedPaper(mapped[0]);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to static data
      }
      setPapers(PAPERS);
      setSelectedPaper(PAPERS[0]);
      setLoading(false);
    }
    void loadPapers();
  }, []);

  const filteredPapers =
    activeFilter === 'all'
      ? papers
      : papers.filter((p) => normalize(p.category).includes(activeFilter));

  return (
    <div className="bg-[#F5F4F0] flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Top section */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-5 flex justify-between items-start flex-shrink-0">
        <div>
          <div className="border-l-4 border-[#E8521A] pl-3">
            <h1 className="text-[22px] font-black text-[#1A1A1A]">AI Research Feed</h1>
          </div>
          <p className="text-[#6B7280] text-sm mt-1">Curated breakthroughs · Updated daily</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#FFF8F5] border border-[#E8521A]/20 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#E8521A]">
            + 6 papers this week
          </span>
          <button
            type="button"
            className="border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] font-medium text-[#6B7280] hover:border-[#1A1A1A] transition"
          >
            🔔 Subscribe
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex gap-1 overflow-x-auto flex-shrink-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.match}
            type="button"
            onClick={() => setActiveFilter(tab.match)}
            className={
              activeFilter === tab.match
                ? 'bg-[#E8521A] text-white rounded-full px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap'
                : 'text-[#6B7280] px-3 py-1.5 rounded-full text-[13px] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] whitespace-nowrap transition'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left list */}
        <div className="w-[280px] flex-shrink-0 bg-white border-r border-[#E5E5E5] overflow-y-auto">
          {loading && (
            <div className="p-6 text-center text-[#6B7280] text-[13px]">Loading…</div>
          )}
          {!loading && filteredPapers.length === 0 && (
            <div className="p-6 text-center text-[#6B7280] text-[13px]">
              No papers match this filter.
            </div>
          )}
          {!loading &&
            filteredPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className={`px-4 py-3.5 border-b border-[#F0EEE9] cursor-pointer transition-all ${
                  selectedPaper?.id === paper.id
                    ? 'border-l-[3px] border-l-[#E8521A] bg-[#FFF8F5]'
                    : 'border-l-[3px] border-l-transparent hover:bg-[#F9F8F5]'
                }`}
              >
                {/* Date + Lab row */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                    {sidebarDate(paper)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paper.categoryColor}`}>
                    {paper.category}
                  </span>
                </div>
                {/* Lab */}
                <p className="text-[11px] text-[#6B7280] font-medium mb-1">{paper.lab}</p>
                {/* Title */}
                <p className="text-[13px] font-bold text-[#1A1A1A] leading-snug mb-1.5 line-clamp-2">
                  {paper.title}
                </p>
                {/* Description */}
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed line-clamp-2">
                  {paper.desc}
                </p>
              </div>
            ))}
        </div>

        {/* Right detail */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-3xl">
              {/* Header — lab · date + category badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[13px] font-semibold text-[#1A1A1A]">{selectedPaper.lab}</span>
                <span className="text-[#9CA3AF] text-[13px]">·</span>
                <span className="text-[#6B7280] text-[13px]">{headerDate(selectedPaper)}</span>
                <span className={`ml-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${selectedPaper.categoryColor}`}>
                  {selectedPaper.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-[24px] font-black text-[#1A1A1A] leading-tight mb-2">
                {selectedPaper.title}
              </h2>

              {/* arXiv + authors */}
              {(selectedPaper.arxiv || selectedPaper.authors) && (
                <p className="text-[12px] text-[#6B7280] mb-5">
                  {selectedPaper.arxiv && <span className="text-[#1D4ED8]">{selectedPaper.arxiv}</span>}
                  {selectedPaper.arxiv && selectedPaper.authors && <span> · </span>}
                  {selectedPaper.authors && <span>{selectedPaper.authors}</span>}
                </p>
              )}

              {/* Overview */}
              <p className="text-[14px] text-[#374151] leading-relaxed mb-8">
                {selectedPaper.fullDesc ?? selectedPaper.desc}
              </p>

              {/* Metrics */}
              {selectedPaper.metrics && selectedPaper.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {selectedPaper.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="bg-[#F5F4F0] rounded-xl border border-[#E5E5E5] p-5 text-center"
                    >
                      <p className="text-[22px] font-black text-[#1A1A1A]">{m.value}</p>
                      <p className="text-[11px] text-[#6B7280] mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Key findings */}
              {selectedPaper.findings && selectedPaper.findings.length > 0 && (
                <section className="mb-8">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">KEY FINDINGS</p>
                  <div className="space-y-2">
                    {selectedPaper.findings.map((f, i) => (
                      <div key={i} className="flex gap-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-4 py-3">
                        <span className="text-[#E8521A] font-bold text-[13px] flex-shrink-0 w-4">{i + 1}.</span>
                        <span className="text-[13px] text-[#374151] leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Models referenced */}
              {selectedPaper.models && selectedPaper.models.length > 0 && (
                <section className="mb-8">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">MODELS REFERENCED</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.models.map((m) => (
                      <span
                        key={m}
                        className="bg-white border border-[#E5E5E5] text-[#374151] text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#F5F4F0] flex items-center justify-center text-[9px]">🤖</span>
                        {m}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Impact */}
              {selectedPaper.impact && (
                <section className="mb-8">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">IMPACT ASSESSMENT</p>
                  <div className="bg-[#FFF8F5] border border-[#FDDCCA] rounded-lg px-4 py-3 flex gap-3 items-start">
                    <span className="text-[#E8521A] text-[14px] flex-shrink-0">⚡</span>
                    <p className="text-[13px] text-[#374151]">{selectedPaper.impact}</p>
                  </div>
                </section>
              )}

              {/* Citation */}
              {selectedPaper.citation && (
                <section className="mb-4">
                  <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">CITATION</p>
                  <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4 relative">
                    <p className="text-[12px] text-[#6B7280] leading-relaxed pr-16">
                      {selectedPaper.citation}
                    </p>
                    <button
                      type="button"
                      className="absolute top-3 right-3 text-[11px] border border-[#E5E5E5] bg-white px-3 py-1 rounded-md font-medium text-[#6B7280] hover:bg-[#F5F4F0] transition"
                    >
                      Copy
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Sticky bottom bar */}
          <div className="flex-shrink-0 border-t border-[#E5E5E5] bg-white px-6 py-3 flex items-center gap-3">
            <button
              type="button"
              className="flex-1 bg-[#E8521A] hover:bg-[#d04415] text-white font-semibold text-[14px] py-3 rounded-full flex items-center justify-center gap-2 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Discuss in Chat Hub
            </button>
            <button
              type="button"
              className="border border-[#E5E5E5] text-[#374151] font-semibold text-[13px] px-4 py-3 rounded-full hover:bg-[#F5F4F0] transition flex items-center gap-1.5"
            >
              🔖 Save
            </button>
            <button
              type="button"
              className="border border-[#E5E5E5] text-[#374151] font-semibold text-[13px] px-4 py-3 rounded-full hover:bg-[#F5F4F0] transition flex items-center gap-1.5"
            >
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
