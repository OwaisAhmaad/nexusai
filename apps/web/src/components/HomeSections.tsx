'use client';

import Link from 'next/link';

interface ModelItem {
  _id?: string;
  id?: string;
  name: string;
  lab: string;
  category: string;
  tags: string[];
  speed: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow?: number;
  rating: number;
  reviews?: number;
  description?: string;
  isFeatured?: boolean;
  bestFor?: string;
}

/* ── Design data ─────────────────────────────────────────── */
const LAB_META: Record<string, { bg: string; text: string; border: string; desc: string }> = {
  OpenAI:       { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', desc: 'GPT series, Whisper, DALL·E' },
  Anthropic:    { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE', desc: 'Claude family models' },
  Google:       { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', desc: 'Gemini series models' },
  Meta:         { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD', desc: 'Open-source Llama models' },
  'Mistral AI': { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', desc: 'European efficiency models' },
  DeepSeek:     { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE', desc: 'Reasoning & math specialist' },
};

const SPEED_LABEL: Record<string, string> = {
  'very-fast': '⚡ Very Fast',
  fast:        '⚡ Fast',
  medium:      '◆ Balanced',
  slow:        '● Deep',
};

const USE_CASE_CARDS = [
  { label: 'Coding & Dev',     icon: '👨‍💻', sub: 'Code generation, review, debug', href: '/marketplace?useCase=coding' },
  { label: 'Writing',          icon: '✍️',  sub: 'Blogs, copy, creative content',  href: '/marketplace?useCase=writing' },
  { label: 'Data Analysis',    icon: '📊',  sub: 'Insights, reports, dashboards',  href: '/marketplace?useCase=analysis' },
  { label: 'Customer Support', icon: '🎧',  sub: 'Chatbots, helpdesk automation',  href: '/marketplace?useCase=customer-support' },
  { label: 'Research',         icon: '🔬',  sub: 'Literature review, summaries',   href: '/marketplace?useCase=research' },
  { label: 'Vision & Images',  icon: '🖼️',  sub: 'Image analysis & generation',   href: '/marketplace?category=vision' },
  { label: 'Math & Science',   icon: '🧮',  sub: 'Complex reasoning & proofs',     href: '/marketplace?useCase=math' },
  { label: 'Real-time Apps',   icon: '⚡',  sub: 'Low latency, high throughput',   href: '/marketplace?useCase=real-time' },
];

/* ── Helpers ─────────────────────────────────────────────── */
function fmtPrice(p: number) {
  if (!p || p === 0) return 'Free';
  if (p < 0.001) return `$${(p * 1000).toFixed(2)}/1M`;
  return `$${(p * 1000).toFixed(1)}/1M`;
}

function mid(m: ModelItem) {
  return m._id ?? m.id ?? '';
}

/* ── Sub-components ──────────────────────────────────────── */
function SectionHeader({
  label, title, subtitle,
}: { label: string; title: string; subtitle?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[#E8521A] text-sm">✦</span>
        <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest">{label}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{title}</h2>
      {subtitle && <p className="text-[#6B7280] mt-1.5 text-[15px]">{subtitle}</p>}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export function HomeSections({ models }: { models: ModelItem[] }) {
  /* Derived sets */
  const featured = [
    ...models.filter((m) => m.isFeatured),
    ...models.filter((m) => !m.isFeatured),
  ].slice(0, 6);

  const trending = [...models].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const labCounts = models.reduce<Record<string, number>>((acc, m) => {
    acc[m.lab] = (acc[m.lab] ?? 0) + 1;
    return acc;
  }, {});

  const flagships = ['GPT-4o', 'Claude Opus 4.6', 'Gemini 2.5 Pro', 'Mistral Large']
    .map((name) => models.find((m) => m.name === name))
    .filter(Boolean) as ModelItem[];

  return (
    <div className="bg-[#F5F4F0]">

      {/* ── 1. Featured Models ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              label="Curated"
              title="Featured Models"
              subtitle="Hand-picked by the NexusAI team for quality and performance"
            />
            <Link href="/marketplace" className="text-sm font-semibold text-[#E8521A] hover:underline whitespace-nowrap mb-1">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((m) => {
              const lab = LAB_META[m.lab] ?? { bg: '#F5F4F0', text: '#374151', border: '#E5E5E5', desc: '' };
              return (
                <Link
                  key={mid(m)}
                  href={`/models/${mid(m)}`}
                  className="group bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:border-[#E8521A]/40 hover:shadow-md transition flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                      style={{ backgroundColor: lab.bg, color: lab.text, borderColor: lab.border }}
                    >
                      {m.lab}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{m.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-1 group-hover:text-[#E8521A] transition">
                    {m.name}
                  </h3>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed mb-3 flex-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {m.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {m.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] bg-[#F5F4F0] text-[#6B7280] px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0EEE9]">
                    <span className="text-[11px] text-[#6B7280]">In: {fmtPrice(m.inputPrice)}</span>
                    <span className="text-[11px] font-medium text-[#374151]">{SPEED_LABEL[m.speed] ?? m.speed}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. Built for every builder ─────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[#E8521A]">✦</span>
              <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest">Use Cases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Built for every builder</h2>
            <p className="text-[#6B7280] mt-2 text-[15px]">Whatever you&apos;re building, there&apos;s a model built for it</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {USE_CASE_CARDS.map((uc) => (
              <Link
                key={uc.label}
                href={uc.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#E5E5E5] bg-[#FAFAF9] text-center hover:border-[#E8521A] hover:bg-white hover:shadow-sm transition"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-2xl shadow-sm group-hover:border-[#E8521A]/30 transition">
                  {uc.icon}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] group-hover:text-[#E8521A] transition">
                    {uc.label}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{uc.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Browse by AI Lab ────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Providers"
            title="Browse by AI Lab"
            subtitle="Explore models from the world's leading AI research labs"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            {Object.entries(LAB_META).map(([lab, meta]) => (
              <Link
                key={lab}
                href={`/marketplace?lab=${encodeURIComponent(lab)}`}
                className="group flex flex-col gap-3 p-4 rounded-2xl border bg-white hover:shadow-md transition"
                style={{ borderColor: meta.border }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black border"
                  style={{ backgroundColor: meta.bg, color: meta.text, borderColor: meta.border }}
                >
                  {lab.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] group-hover:text-[#E8521A] transition leading-tight">
                    {lab}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{labCounts[lab] ?? 0} models</p>
                </div>
                <p className="text-[10px] text-[#9CA3AF] leading-tight">{meta.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Flagship Comparison ─────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              label="Compare"
              title="Flagship Model Comparison"
              subtitle="Side-by-side specs for the top frontier models"
            />
            <Link href="/marketplace" className="text-sm font-semibold text-[#E8521A] hover:underline whitespace-nowrap mb-1">
              Full comparison →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E5E5E5]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F4F0] border-b border-[#E5E5E5]">
                  {['Model', 'Context', 'Input', 'Output', 'Speed', 'Rating'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold text-[#374151] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flagships.map((m, i) => {
                  const lab = LAB_META[m.lab] ?? { bg: '#F5F4F0', text: '#374151', border: '#E5E5E5', desc: '' };
                  const ctx = m.contextWindow
                    ? m.contextWindow >= 1_000_000
                      ? `${m.contextWindow / 1_000_000}M`
                      : `${m.contextWindow / 1_000}K`
                    : '—';
                  return (
                    <tr
                      key={mid(m)}
                      className={`border-b border-[#F0EEE9] hover:bg-[#FAFAF9] transition ${i === 0 ? 'bg-[#FFFBF8]' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black border flex-shrink-0"
                            style={{ backgroundColor: lab.bg, color: lab.text, borderColor: lab.border }}
                          >
                            {m.lab.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A] text-[13px] whitespace-nowrap">{m.name}</p>
                            <p className="text-[10px] text-[#9CA3AF]">{m.lab}</p>
                          </div>
                          {i === 0 && (
                            <span className="text-[9px] bg-[#E8521A] text-white px-1.5 py-0.5 rounded-full font-bold">TOP</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#374151]">{ctx}</td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">{fmtPrice(m.inputPrice)}</td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">{fmtPrice(m.outputPrice)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                          m.speed === 'very-fast' || m.speed === 'fast'
                            ? 'bg-green-50 text-green-700'
                            : m.speed === 'medium'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {SPEED_LABEL[m.speed] ?? m.speed}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-[13px] font-bold text-[#1A1A1A]">{m.rating}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 5. Trending This Week ──────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              label="Hot right now"
              title="Trending This Week"
              subtitle="Most-used models by the NexusAI community"
            />
            <Link href="/marketplace" className="text-sm font-semibold text-[#E8521A] hover:underline whitespace-nowrap mb-1">
              Explore all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
            {trending.map((m, i) => {
              const lab = LAB_META[m.lab] ?? { bg: '#F5F4F0', text: '#374151', border: '#E5E5E5', desc: '' };
              return (
                <Link
                  key={mid(m)}
                  href={`/models/${mid(m)}`}
                  className="group flex-shrink-0 snap-start w-52 bg-white rounded-2xl border border-[#E5E5E5] p-4 hover:border-[#E8521A]/40 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-black text-[#D1D5DB]">#{i + 1}</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                      ↑ Trending
                    </span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black border mb-3"
                    style={{ backgroundColor: lab.bg, color: lab.text, borderColor: lab.border }}
                  >
                    {m.lab.charAt(0)}
                  </div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] group-hover:text-[#E8521A] transition mb-0.5">
                    {m.name}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mb-3">{m.lab}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F0EEE9]">
                    <div className="flex items-center gap-0.5">
                      <span className="text-yellow-400">★</span>
                      <span className="text-[12px] font-bold text-[#1A1A1A]">{m.rating}</span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF]">{fmtPrice(m.inputPrice)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Find Models by Budget ───────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[#E8521A]">✦</span>
              <span className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest">Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Find Models by Budget</h2>
            <p className="text-[#6B7280] mt-2 text-[15px]">
              From free open-source to enterprise-grade — there&apos;s a model for every budget
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Free / Open Source */}
            <div className="bg-[#F0FDF4] border border-green-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl mb-4">🆓</div>
              <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">Free / Open Source</h3>
              <p className="text-[13px] text-[#6B7280] mb-5">
                Self-hostable models with no per-token cost. Great for privacy and budget control.
              </p>
              <div className="space-y-2 mb-5">
                {models
                  .filter((m) => ['Llama 3.3 70B', 'DeepSeek R1'].includes(m.name))
                  .map((m) => (
                    <div
                      key={mid(m)}
                      className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-green-100"
                    >
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{m.name}</span>
                      <span className="text-[11px] text-green-700 font-medium">{fmtPrice(m.inputPrice)}</span>
                    </div>
                  ))}
              </div>
              <Link
                href="/marketplace?budget=low"
                className="block text-center text-[13px] font-bold text-green-700 border border-green-300 rounded-full py-2 hover:bg-green-50 transition"
              >
                Browse free models →
              </Link>
            </div>

            {/* Pay Per Token */}
            <div className="bg-white border-2 border-[#E8521A]/30 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8521A] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="w-10 h-10 bg-[#FFF3F0] rounded-xl flex items-center justify-center text-xl mb-4">⚡</div>
              <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">Pay Per Token</h3>
              <p className="text-[13px] text-[#6B7280] mb-5">
                API-billed by usage. No subscription — scale up and down as needed.
              </p>
              <div className="space-y-2 mb-5">
                {models
                  .filter((m) => ['GPT-4o mini', 'Claude Haiku 4.5', 'Gemini 2.0 Flash'].includes(m.name))
                  .map((m) => (
                    <div
                      key={mid(m)}
                      className="flex items-center justify-between bg-[#FAFAF9] rounded-xl px-3 py-2 border border-[#E5E5E5]"
                    >
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{m.name}</span>
                      <span className="text-[11px] text-[#E8521A] font-medium">{fmtPrice(m.inputPrice)}</span>
                    </div>
                  ))}
              </div>
              <Link
                href="/marketplace?budget=medium"
                className="block text-center text-[13px] font-bold text-white bg-[#E8521A] rounded-full py-2 hover:bg-[#d04415] transition"
              >
                Browse pay-per-token →
              </Link>
            </div>

            {/* Premium / Frontier */}
            <div className="bg-[#F5F3FF] border border-violet-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl mb-4">🏆</div>
              <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">Premium / Frontier</h3>
              <p className="text-[13px] text-[#6B7280] mb-5">
                Top-tier intelligence for the most demanding tasks. Best performance money can buy.
              </p>
              <div className="space-y-2 mb-5">
                {models
                  .filter((m) => ['Claude Opus 4.6', 'GPT-4o', 'Gemini 2.5 Pro'].includes(m.name))
                  .map((m) => (
                    <div
                      key={mid(m)}
                      className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-violet-100"
                    >
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{m.name}</span>
                      <span className="text-[11px] text-violet-700 font-medium">{fmtPrice(m.inputPrice)}</span>
                    </div>
                  ))}
              </div>
              <Link
                href="/marketplace?budget=high"
                className="block text-center text-[13px] font-bold text-violet-700 border border-violet-300 rounded-full py-2 hover:bg-violet-50 transition"
              >
                Browse premium models →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-bold text-[#E8521A] uppercase tracking-widest mb-3">✦ NexusAI Hub</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
            Still not sure which model to pick?
          </h2>
          <p className="text-[#6B7280] mb-7 text-[15px]">
            Let our AI advisor guide you to the perfect model in under 60 seconds.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#E8521A] text-white font-bold px-8 py-3 rounded-full hover:bg-[#d04415] transition shadow-md"
          >
            Talk to NexusAI Hub ✦
          </button>
        </div>
      </section>

    </div>
  );
}
