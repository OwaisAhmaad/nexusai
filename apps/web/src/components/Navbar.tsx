import Link from 'next/link';
import { NavLinks } from './NavLinks';
import { MobileNav } from './MobileNav';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-accent">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-text-primary text-[17px] tracking-tight">NexusAI</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/marketplace', label: 'Marketplace' },
            { href: '/agents', label: 'Agents' },
            { href: '/research', label: 'Research' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm text-muted hover:text-text-primary hover:bg-background transition font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <NavLinks />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
