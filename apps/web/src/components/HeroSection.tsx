import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-[#F5F4F0] pt-20 pb-16 px-4 sm:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#E8521A]/10 text-[#E8521A] text-[11px] font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-[#E8521A]/20">
          <span className="w-1.5 h-1.5 bg-[#E8521A] rounded-full animate-pulse" />
          AI Model Marketplace
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#1A1A1A] mb-5 leading-tight tracking-tight">
          Find the perfect AI model
          <br className="hidden sm:block" />
          {' '}for your use case
        </h1>

        {/* Sub */}
        <p className="text-[#6B7280] text-[17px] mb-9 max-w-2xl mx-auto leading-relaxed">
          Compare 12+ AI models by price, context window, and capabilities.
          Get personalized recommendations in seconds with our AI advisor.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/register"
            className="bg-[#E8521A] text-white px-7 py-3 rounded-full font-bold text-[15px] hover:bg-[#d04415] transition shadow-md w-full sm:w-auto text-center"
          >
            Get started free
          </Link>
          <a
            href="#advisor"
            className="border border-[#E5E5E5] bg-white text-[#374151] px-7 py-3 rounded-full font-bold text-[15px] hover:border-[#E8521A] hover:text-[#E8521A] transition w-full sm:w-auto text-center"
          >
            Talk to AI Advisor ✦
          </a>
          <Link
            href="/marketplace"
            className="text-[#E8521A] font-semibold text-[15px] hover:underline underline-offset-2 w-full sm:w-auto text-center"
          >
            Browse models →
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
          {[
            { value: '12+', label: 'AI Models' },
            { value: '6',   label: 'AI Labs' },
            { value: 'Free', label: 'To explore' },
            { value: '< 60s', label: 'To recommend' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-[#1A1A1A]">{value}</p>
              <p className="text-[12px] text-[#9CA3AF] font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
