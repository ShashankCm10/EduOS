import Link from 'next/link';
import { GraduationCap, ArrowRight, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import Aurora from '@/components/fx/Aurora';

export function FinalCTA() {
  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal from="scale">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] px-6 py-16 text-center sm:px-14 sm:py-20">
            <Aurora variant="violet" grid={false} />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-700/25 via-ink-900/60 to-cyan-600/20" />

            {/* orbit decor */}
            <div aria-hidden className="pointer-events-none absolute left-1/[0.02] top-1/[0.02] -z-10 h-[38rem] w-[38rem] -translate-x-1/[0.02] -translate-y-1/[0.02]">
              {[1, 0.72, 0.46].map((f, i) => (
                <span
                  key={i}
                  className="absolute left-1/[0.02] top-1/[0.02] rounded-full border border-white/[0.08]"
                  style={{ width: `${38 * f}rem`, height: `${38 * f}rem`, transform: 'translate(-50%,-50%)' }}
                />
              ))}
              <span className="absolute left-1/[0.02] top-0 h-2.5 w-2.5 -translate-x-1/[0.02] rounded-full bg-cyan-300 shadow-glow-cyan animate-spin-slower origin-[50%_19rem]" />
            </div>

            <span className="chip chip-violet mx-auto">
              <Sparkles className="h-3 w-3" /> Your semester starts now
            </span>

            <h2 className="display-xl mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.1rem,5.4vw,4rem)] text-white">
              Stop studying harder.
              <br />
              Start studying <span className="grad-text">on purpose</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-slate-300">
              Import your semester tonight, wake up to a plan you can actually follow. Free forever for one semester, no card, no
              institution required.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn btn-lg btn-primary shine w-full sm:w-auto">
                Create your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="btn btn-lg btn-ghost w-full sm:w-auto">
                Explore the live demo
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-slate-400">
              <span>No credit card</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span>2-minute setup</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span>Import from PDF or photo</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { h: 'Product', l: ['Dashboard', 'Study Materials', 'AI Tutor', 'Quizzes', 'Study Planner', 'Analytics'] },
    { h: 'Students', l: ['GATE prep', 'Semester survival kit', 'Flashcard templates', 'Past-paper vault', 'Study playlists'] },
    { h: 'Company', l: ['About', 'Careers', 'Privacy', 'Terms', 'Security', 'Status'] },
    { h: 'Resources', l: ['Docs', 'Changelog', 'Community', 'Help centre', 'Contact'] },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-ink-950/80 px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-glow">
                <GraduationCap className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Edu<span className="grad-text">OS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-slate-400">
              The academic operating system for students. Courses, notes, deadlines, practice and an AI tutor that cites your sources —
              in one workspace that answers only to you.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Github, Linkedin, Mail].map((I, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-white/[0.09] bg-white/[0.03] text-slate-400 transition hover:-translate-y-1 hover:border-violet-400/50 hover:text-white"
                >
                  <I className="h-4 w-4" />
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] px-3.5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ticker-pulse" />
              <span className="text-[11.5px] text-emerald-200">All systems operational · 99.98% uptime</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.h}>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{c.h}</h4>
                <ul className="mt-4 space-y-2.5">
                  {c.l.map((l) => (
                    <li key={l}>
                      <span className="cursor-pointer text-[13px] text-slate-400 transition hover:text-white">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 divider-grad" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-[11.5px] text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} EduOS Labs. Built for students, by people who clearly took too many notes.</span>
          <span className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-slate-300">Privacy</span>
            <span className="cursor-pointer hover:text-slate-300">Terms</span>
            <span className="cursor-pointer hover:text-slate-300">Cookies</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-violet-400" /> Made in India
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
