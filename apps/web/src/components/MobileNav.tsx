'use client';

import { useState } from 'react';
import Link from 'next/link';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-muted hover:text-text-primary hover:bg-background transition"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-border px-4 py-3 space-y-1 shadow-lg">
          {[
            { href: '/',            label: 'Home' },
            { href: '/chat-hub',    label: 'Chat Hub' },
            { href: '/marketplace', label: 'Marketplace' },
            { href: '/research',    label: 'Discover New' },
            { href: '/agents',      label: 'Agents' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-background transition font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
