import Link from 'next/link';
import { NavLinks } from './NavLinks';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-text-primary text-lg">NexusAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted hover:text-text-primary transition font-medium"
          >
            Models
          </Link>
          <Link
            href="/agents"
            className="text-sm text-muted hover:text-text-primary transition font-medium"
          >
            Agents
          </Link>
          <Link
            href="/research"
            className="text-sm text-muted hover:text-text-primary transition font-medium"
          >
            Research
          </Link>
        </nav>

        <NavLinks />
      </div>
    </header>
  );
}
