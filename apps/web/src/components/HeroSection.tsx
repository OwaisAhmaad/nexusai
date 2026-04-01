import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-surface border-b border-border py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
          AI Model Marketplace
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 leading-tight">
          Find the perfect AI model
          <br />
          <span className="text-accent">for your use case</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          Compare hundreds of AI models by price, context window, and capabilities.
          Deploy in seconds with a single API.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/auth/register"
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition font-medium"
          >
            Get started free
          </Link>
          <Link
            href="#models"
            className="border border-border bg-surface text-text-primary px-6 py-3 rounded-lg hover:bg-background transition font-medium"
          >
            Browse models
          </Link>
        </div>
      </div>
    </section>
  );
}
