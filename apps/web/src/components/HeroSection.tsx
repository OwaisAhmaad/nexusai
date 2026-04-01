import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-surface border-b border-border py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-accent/20">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          AI Model Marketplace
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4 leading-tight tracking-tight">
          Find the perfect AI model
          <br />
          <span className="text-gradient">for your use case</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          Compare hundreds of AI models by price, context window, and capabilities.
          Deploy in seconds with a single API.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/auth/register"
            className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent-hover transition font-semibold shadow-accent text-sm"
          >
            Get started free
          </Link>
          <Link
            href="/marketplace"
            className="border border-border bg-surface text-text-primary px-6 py-3 rounded-xl hover:bg-background transition font-semibold text-sm"
          >
            Browse models →
          </Link>
        </div>
      </div>
    </section>
  );
}
