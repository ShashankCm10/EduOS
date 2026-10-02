'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GraduationCap, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* announcement ribbon */}
      <div className="relative z-50 overflow-hidden border-b border-white/[0.07] bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-cyan-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium text-slate-300 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
          <span>
            <span className="font-bold text-white">New —</span> RAG over your own PDFs. Ask your notes a question and get cited answers.
          </span>
          <Link href="/materials" className="hidden font-bold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200 sm:inline">
            Try it →
          </Link>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500 ease-spring',
          scrolled ? 'border-b border-white/[0.08] bg-ink-950/80 backdrop-blur-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,1)]' : 'border-b border-transparent'
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-glow">
              <GraduationCap className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
            </span>
            <span className="font-display text-[19px] font-extrabold tracking-tight text-white">
              Edu<span className="grad-text">OS</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-lg px-3.5 py-2 text-[13.5px] font-medium text-slate-400 transition hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="btn btn-sm btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link href="/dashboard" className="btn btn-sm btn-primary shine">
              Open workspace
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-white/[0.08] bg-ink-950/[0.97] px-4 py-4 backdrop-blur-2xl lg:hidden animate-fade-up">
            <div className="grid gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" className="btn btn-md btn-ghost">
                Sign in
              </Link>
              <Link href="/dashboard" className="btn btn-md btn-primary">
                Open workspace
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
