'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { NavLinks } from './NavLinks';
import { MobileNav } from './MobileNav';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_OPTIONS, type LangCode } from '@/lib/translations';

function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGE_OPTIONS.find((l) => l.code === lang) ?? LANGUAGE_OPTIONS[0];

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
        className="border border-[#E5E5E5] rounded-full pl-2 pr-2.5 py-1 text-[12px] font-medium text-[#6B7280] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition flex items-center gap-1.5"
        aria-label={t.lang_selectLabel}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-[#9CA3AF]">
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E5E5E5] shadow-xl py-1.5 z-50 overflow-hidden">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 pt-1 pb-1.5">
            {t.lang_selectLabel}
          </p>
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => { setLang(option.code as LangCode); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition hover:bg-[#F5F4F0] ${
                lang === option.code
                  ? 'text-[#E8521A] font-semibold bg-[#FFF8F5]'
                  : 'text-[#374151] font-medium'
              }`}
            >
              <span className="text-base leading-none w-5 flex-shrink-0">{option.flag}</span>
              <span className="flex-1 text-left">{option.label}</span>
              {lang === option.code && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#E8521A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const NAV_LINKS = [
    { href: '/chat-hub',    label: t.nav_chatHub      },
    { href: '/marketplace', label: t.nav_marketplace  },
    { href: '/research',    label: t.nav_discoverNew  },
    { href: '/agents',      label: t.nav_agents       },
  ];

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
