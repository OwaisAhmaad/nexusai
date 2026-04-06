'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { NavLinks } from './NavLinks';
import { MobileNav } from './MobileNav';

const NAV_LINKS = [
  { href: '/chat-hub',    label: 'Chat Hub' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/research',    label: 'Discover New' },
  { href: '/agents',      label: 'Agents' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'ES', label: 'Español' },
];

function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('EN');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border border-[#E5E5E5] rounded-full px-2.5 py-1 text-[12px] font-medium text-[#6B7280] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition flex items-center gap-1"
        aria-label="Select language"
      >
        {selected} <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-32 bg-white rounded-xl border border-[#E5E5E5] shadow-lg py-1 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { setSelected(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[12px] font-medium transition hover:bg-[#F5F4F0] ${
                selected === lang.code ? 'text-[#E8521A]' : 'text-[#374151]'
              }`}
            >
              {lang.code} — {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();

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
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'border-b-2 border-[#E8521A] text-[#1A1A1A] rounded-b-none'
                    : 'text-muted hover:text-text-primary hover:bg-background'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <NavLinks />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
