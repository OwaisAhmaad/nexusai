'use client';
import { useState, useEffect } from 'react';

interface ResearchPaper {
  id: string;
  date: string;
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

const FILTER_TABS = [
  'All',
  '🧠 Reasoning',
  '🌐 Multimodal',
  '🛡️ Alignment',
  '⚡ Efficiency',
  '🔓 Open Weights',
];

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>(PAPERS);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPapers() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/v1/research?limit=10`);
        if (res.ok) {
          const json = (await res.json()) as { data?: ResearchPaper[] };
          const fetched = Array.isArray(json?.data) ? json.data : [];
          if (fetched.length > 0) {
            setPapers(fetched);
            setSelectedPaper(fetched[0]);
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

  useEffect(() => {
    async function loadDetail() {
      if (!selectedPaper) return;
      try {
        const res = await fetch(`${API}/api/v1/research/${selectedPaper.id}`);
        if (res.ok) {
          const json = (await res.json()) as { data?: ResearchPaper };
          if (json?.data) {
            setSelectedPaper(json.data);
          }
        }
      } catch {
        // keep current selectedPaper from static data
      }
    }
    void loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaper?.id]);

  const filteredPapers =
    activeFilter === 'All'
      ? papers
      : papers.filter((p) =>
          p.category
            .toLowerCase()
            .includes(activeFilter.toLowerCase().replace(/[^a-z]/g, '')),
        );

  return (
    <div className="bg-[#F5F4F0] flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Top section */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-5 flex justify-between items-start flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">AI Research Feed</h1>
          <p className="text-[#6B7280] text-sm mt-1">Curated breakthroughs · Updated daily</p>
        </div>
        <div className="flex items-center">
          <span className="bg-[#F5F4F0] border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#374151]">
            + 6 papers this week
          </span>
          <button
            type="button"
            className="border border-[#E5E5E5] rounded-full px-3 py-1.5 text-[12px] font-medium text-[#6B7280] ml-2 hover:border-[#1A1A1A] transition"
          >
            🔔 Subscribe
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={
              activeFilter === tab
                ? 'bg-[#E8521A] text-white rounded-full px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap'
                : 'text-[#6B7280] px-4 py-1.5 text-[13px] hover:text-[#1A1A1A] whitespace-nowrap transition'
            }
          >
            {tab}
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
            <div className="p-6 text-center text-[#6B7280] text-[13px]">No papers match this filter.</div>
          )}
          {!loading &&
            filteredPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className={`p-4 border-b border-[#F0EEE9] cursor-pointer transition ${
                  selectedPaper?.id === paper.id
                    ? 'border-l-4 border-l-[#E8521A] bg-[#FFF8F5]'
                    : 'border-l-4 border-l-transparent hover:bg-[#F5F4F0]'
                }`}
              >
                <div className="text-[20px] font-black text-[#D1D5DB] mb-1">{paper.date}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-[#6B7280] font-medium">{paper.lab}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paper.categoryColor}`}
                  >
                    {paper.category}
                  </span>
                </div>
                <p className="text-[13px] font-bold text-[#1A1A1A] leading-snug mb-1">
                  {paper.title}
                </p>
                <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">
                  {paper.desc}
                </p>
              </div>
            ))}
        </div>

        {/* Right detail */}
        <div className="flex-1 overflow-y-auto bg-[#F5F4F0]">
          {!selectedPaper ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">🔬</div>
              <p className="text-[#6B7280] text-[15px]">
                Select a paper to read the full details
              </p>
            </div>
          ) : (
            <div className="p-8 max-w-3xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${selectedPaper.categoryColor}`}
                >
                  {selectedPaper.category}
                </span>
                <span className="text-[#6B7280] text-[13px]">{selectedPaper.lab}</span>
                <span className="text-[#9CA3AF] text-[13px] ml-auto">
                  March {selectedPaper.date.split(' ')[1]}, 2026
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#1A1A1A] leading-tight mb-2">
                {selectedPaper.title}
              </h2>
              <p className="text-[13px] text-[#6B7280] mb-6">
                Authors: {selectedPaper.authors}
              </p>

              {/* Overview */}
              <section className="mb-8">
                <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
                  OVERVIEW
                </h3>
                <p className="text-[14px] text-[#374151] leading-relaxed">
                  {selectedPaper.fullDesc}
                </p>
              </section>

              {/* Metrics */}
              {selectedPaper.metrics && selectedPaper.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {selectedPaper.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="bg-white rounded-xl border border-[#E5E5E5] p-4 text-center"
                    >
                      <p className="text-2xl font-black text-[#1A1A1A]">{m.value}</p>
                      <p className="text-[11px] text-[#6B7280] mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Key findings */}
              {selectedPaper.findings && selectedPaper.findings.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
                    KEY FINDINGS
                  </h3>
                  <ol className="space-y-2">
                    {selectedPaper.findings.map((f, i) => (
                      <li key={i} className="flex gap-3 text-[14px] text-[#374151]">
                        <span className="text-[#E8521A] font-bold flex-shrink-0">{i + 1}.</span>
                        {f}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Models referenced */}
              {selectedPaper.models && selectedPaper.models.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
                    MODELS REFERENCED
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.models.map((m) => (
                      <span
                        key={m}
                        className="bg-[#F5F4F0] border border-[#E5E5E5] text-[#374151] text-[12px] font-semibold px-3 py-1.5 rounded-full"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Impact */}
              {selectedPaper.impact && (
                <div className="bg-[#FFF8F5] border-l-4 border-[#E8521A] rounded-r-xl p-4 mb-8">
                  <p className="text-[13px] font-bold text-[#E8521A] mb-1">
                    ⚡ IMPACT ASSESSMENT
                  </p>
                  <p className="text-[13px] text-[#374151]">{selectedPaper.impact}</p>
                </div>
              )}

              {/* Citation */}
              {selectedPaper.citation && (
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
                  <p className="text-[12px] text-[#6B7280] mb-2">{selectedPaper.citation}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#E8521A] text-[12px] font-semibold">
                      {selectedPaper.arxiv} ↗
                    </span>
                    <button
                      type="button"
                      className="text-[11px] border border-[#E5E5E5] px-3 py-1.5 rounded-lg font-medium text-[#6B7280] hover:bg-[#F5F4F0]"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
