'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Zap, Phone, Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/data';

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services & Rates' },
    { href: '/book', label: 'Book Online' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
            <Zap className="h-5 w-5 text-electric-400" fill="currentColor" />
          </div>
          <div>
            <span className="block text-base font-bold leading-none text-navy-900">DeluxePower</span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Electrical · Canberra
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 sm:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {BUSINESS_INFO.phone}
          </a>
          <Link href="/book" className="btn-primary py-2 text-sm">
            Book Now
          </Link>
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS_INFO.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
