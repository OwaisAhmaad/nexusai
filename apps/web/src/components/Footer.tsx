import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-text-primary text-sm">NexusAI</span>
            <span className="text-muted text-xs">— AI Model Marketplace</span>
          </div>

          <nav className="flex items-center gap-5 text-xs text-muted">
            <Link href="/marketplace" className="hover:text-text-primary transition">Marketplace</Link>
            <Link href="/agents" className="hover:text-text-primary transition">Agents</Link>
            <Link href="/research" className="hover:text-text-primary transition">Research</Link>
          </nav>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} NexusAI
          </p>
        </div>
      </div>
    </footer>
  );
}
