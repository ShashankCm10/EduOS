'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  Flame,
  Trophy,
  Brain,
  Check,
  GraduationCap,
  LayoutDashboard,
  Library,
  ClipboardList,
  ListChecks,
  CalendarDays,
  LineChart,
  Bot,
  Search,
  Quote,
} from 'lucide-react';
import { cn, toneGrad, toneBar } from '@/lib/utils';
import { AreaChart } from '@/components/ui/charts';
import { studyTrend, subjects, student } from '@/lib/data';
import Aurora from '@/components/fx/Aurora';

const ROTATING = [
  'that read every page of your syllabus',
  'that turn 84 pages into 8 flashcards',
  'that tell you what to revise tonight',
  'that predict your exam readiness',
];

function useTypewriter(lines: string[], speed = 42) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = lines[i % lines.length];
    const t = setTimeout(
      () => {
        if (!del) {
          const next = full.slice(0, text.length + 1);
          setText(next);
          if (next === full) setTimeout(() => setDel(true), 1900);
        } else {
          const next = full.slice(0, Math.max(0, text.length - 2));
          setText(next);
          if (next === '') {
            setDel(false);
            setI((v) => v + 1);
          }
        }
      },
      del ? 18 : speed
    );
    return () => clearTimeout(t);
  }, [text, del, i, lines, speed]);

  return text;
}

export default function Hero() {
  const [tab, setTab] = useState<'dashboard' | 'tutor' | 'quiz'>('dashboard');
  const typed = useTypewriter(ROTATING);

  const TABS = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor' as const, label: 'AI Tutor', icon: Bot },
    { id: 'quiz' as const, label: 'Adaptive Quiz', icon: ListChecks },
  ];

  return (
    <section className="relative isolate overflow-hidden pb-16 pt-14 sm:pt-20">
      <Aurora />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/[0.02] top-[-18rem] -z-10 h-[46rem] w-[46rem] -translate-x-1/[0.02] rounded-full bg-grad-ring opacity-[0.14] blur-[120px] animate-spin-slower"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------------- copy ---------------- */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] py-1.5 pl-1.5 pr-4 backdrop-blur-xl animate-fade-up">
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" /> v3.0
            </span>
            <span className="text-[12.5px] font-medium text-slate-300">
              Now with a tutor that has read all <span className="font-bold text-white">2,481</span> pages you uploaded
            </span>
          </div>

          <h1 className="display-xl text-balance text-[clamp(2.5rem,7.2vw,5.1rem)] text-white animate-fade-up" style={{ animationDelay: '80ms' }}>
            Your entire degree,
            <br />
            running on <span className="grad-text">EduOS</span>
          </h1>

          <div className="mx-auto mt-6 flex h-7 max-w-2xl items-center justify-center gap-2 text-[15px] text-slate-400 sm:text-lg animate-fade-up" style={{ animationDelay: '160ms' }}>
            <span className="hidden shrink-0 sm:inline">An academic operating system</span>
            <span className="hidden text-slate-600 sm:inline">·</span>
            <span className="min-w-0 truncate font-semibold text-slate-200">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-cyan-400 animate-blink" />
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-slate-400 animate-fade-up sm:text-base" style={{ animationDelay: '220ms' }}>
            Courses, notes, assignments, quizzes, timetable and analytics in one adaptive workspace — with an AI tutor that answers
            {" "}<span className="text-slate-200">from your own material</span>, with page-level citations.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link href="/dashboard" className="btn btn-lg btn-primary shine w-full sm:w-auto">
              <GraduationCap className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              Enter your workspace
            </Link>
            <Link href="#ai" className="btn btn-lg btn-ghost group w-full sm:w-auto">
              <PlayCircle className="h-4.5 w-4.5 text-cyan-300 transition group-hover:scale-110" style={{ width: 18, height: 18 }} />
              Watch the 90s tour
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] text-slate-500 animate-fade-up" style={{ animationDelay: '380ms' }}>
            <span className="flex items-center gap-2">
              <span className="flex -space-x-2">
                {['Ishita Verma', 'Rahul Nair', 'Sneha Pillai', 'Devansh Gupta'].map((n, i) => (
                  <span
                    key={n}
                    className={cn(
                      'grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold text-white ring-2 ring-ink-950',
                      ['bg-gradient-to-br from-amber-400 to-orange-600', 'bg-gradient-to-br from-violet-500 to-indigo-600', 'bg-gradient-to-br from-cyan-400 to-sky-600', 'bg-gradient-to-br from-fuchsia-500 to-pink-600'][i]
                    )}
                  >
                    {n.split(' ').map((x) => x[0]).join('')}
                  </span>
                ))}
              </span>
              <span>
                <span className="font-bold text-slate-300">61,400+</span> students study here
              </span>
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-1.5">
              <span className="flex text-amber-400">★★★★★</span>
              <span className="font-bold text-slate-300">4.9</span> / 5 from 3.2k reviews
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Free for verified students
            </span>
          </div>
        </div>

        {/* ---------------- product preview ---------------- */}
        <div className="relative mt-16 animate-fade-up" style={{ animationDelay: '460ms' }}>
          {/* glow bed */}
          <div aria-hidden className="absolute inset-x-6 -bottom-8 top-8 -z-10 rounded-[3rem] bg-gradient-to-r from-violet-600/40 via-fuchsia-500/30 to-cyan-500/40 blur-[80px]" />

          {/* floating chips */}
          <FloatChip className="-left-3 top-24 hidden xl:flex" tone="from-orange-400 to-pink-600" icon={<Flame className="h-3.5 w-3.5" />} delay="-2s">
            26-day streak
          </FloatChip>
          <FloatChip className="-right-4 top-40 hidden xl:flex" tone="from-cyan-400 to-sky-600" icon={<Brain className="h-3.5 w-3.5" />} delay="-5s">
            AI flagged 3 weak topics
          </FloatChip>
          <FloatChip className="-left-6 bottom-28 hidden xl:flex" tone="from-amber-400 to-orange-600" icon={<Trophy className="h-3.5 w-3.5" />} delay="-8s">
            Rank #7 of 240
          </FloatChip>

          <div className="aura-border overflow-hidden rounded-[1.75rem] p-[1px] shadow-[0_60px_140px_-50px_rgba(124,58,237,0.9)]">
            <div className="relative overflow-hidden rounded-[1.7rem] bg-ink-900/90 backdrop-blur-2xl">
              {/* window chrome */}
              <div className="flex items-center gap-3 border-b border-white/[0.07] bg-ink-950/60 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-500 sm:flex">
                  <Search className="h-3 w-3" />
                  app.eduos.study/dashboard
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {TABS.map((t) => {
                    const I = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-300',
                          tab === t.id ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_8px_24px_-10px_rgba(124,58,237,0.9)]' : 'text-slate-400 hover:text-white'
                        )}
                      >
                        <I className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* body */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-[marquee_6s_linear_infinite]" />
                {tab === 'dashboard' && <DashPreview />}
                {tab === 'tutor' && <TutorPreview />}
                {tab === 'quiz' && <QuizPreview />}
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            Live product preview · every screen you see here is part of the EduOS workspace
          </p>
        </div>
      </div>
    </section>
  );
}

function FloatChip({
  children,
  className,
  icon,
  tone,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  icon: React.ReactNode;
  tone: string;
  delay?: string;
}) {
  return (
    <div
      className={cn(
        'absolute z-20 items-center gap-2 rounded-2xl border border-white/[0.12] bg-ink-900/85 px-3.5 py-2.5 text-[12px] font-semibold text-white shadow-lift backdrop-blur-xl animate-float',
        className
      )}
      style={{ animationDelay: delay }}
    >
      <span className={cn('grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br', tone)}>{icon}</span>
      {children}
    </div>
  );
}

/* ------------------------- previews ------------------------- */

function MiniSidebar() {
  const items = [
    { i: LayoutDashboard, on: true },
    { i: GraduationCap },
    { i: Library },
    { i: Sparkles },
    { i: ClipboardList },
    { i: ListChecks },
    { i: CalendarDays },
    { i: LineChart },
  ];
  return (
    <div className="hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-ink-950/40 py-4 lg:flex">
      <span className="mb-3 grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
        <GraduationCap className="h-4 w-4 text-white" />
      </span>
      {items.map(({ i: I, on }, k) => (
        <span
          key={k}
          className={cn(
            'grid h-8 w-8 place-items-center rounded-lg transition',
            on ? 'bg-gradient-to-br from-violet-600/90 to-cyan-500/70 text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,1)]' : 'text-slate-600'
          )}
        >
          <I className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}

function DashPreview() {
  return (
    <div className="flex min-h-[440px]">
      <MiniSidebar />
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-500">Wednesday, 1 October</div>
            <div className="font-display text-lg font-bold text-white">Good evening, {student.firstName} 👋</div>
          </div>
          <div className="flex gap-2">
            <span className="chip chip-amber">
              <Flame className="h-3 w-3" /> {student.streak}d
            </span>
            <span className="chip chip-violet">CGPA {student.cgpa}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { l: 'Study today', v: '4.6h', d: '+12%', g: 'from-violet-500 to-indigo-600' },
            { l: 'Tasks done', v: '7/[0.09]', d: '+3', g: 'from-emerald-400 to-teal-600' },
            { l: 'Quiz accuracy', v: '84%', d: '+6%', g: 'from-cyan-400 to-sky-600' },
            { l: 'Exam readiness', v: '66%', d: '+4%', g: 'from-amber-400 to-orange-600' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.l}</div>
              <div className="mt-1.5 flex items-end justify-between">
                <span className="font-display text-xl font-extrabold text-white">{s.v}</span>
                <span className={cn('grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br text-[9px] font-bold text-white', s.g)}>↑</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">Study hours · last 14 days</span>
              <span className="chip chip-cyan">avg 4.3h</span>
            </div>
            <AreaChart
              data={studyTrend}
              height={170}
              unit="h"
              series={[{ key: 'hours', name: 'Hours', from: '#7C3AED', to: '#22D3EE' }]}
              compare="focus"
              compareName="Focus index"
              compareColor="#F59E0B"
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="mb-3 text-[12px] font-bold text-white">Next 3 exams</div>
              {[
                { s: 'DSA', d: '34 days', r: 74, g: 'from-violet-500 to-indigo-500' },
                { s: 'OS', d: '37 days', r: 61, g: 'from-cyan-400 to-sky-500' },
                { s: 'DBMS', d: '40 days', r: 69, g: 'from-emerald-400 to-teal-500' },
              ].map((e) => (
                <div key={e.s} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">{e.s}</span>
                    <span className="text-slate-500">{e.d} · {e.r}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className={cn('h-full rounded-full bg-gradient-to-r', e.g)} style={{ width: `${e.r}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-violet-300">
                <Sparkles className="h-3 w-3" /> AI nudge
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                You are 9 days ahead on DM and 6 days behind on CN. Move <span className="font-semibold text-white">2 hours</span> from Friday to Sunday and you finish both units on time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {subjects.slice(0, 3).map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[10px] font-extrabold text-white', toneGrad(s.tone))}>
                {s.short}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11.5px] font-semibold text-slate-200">{s.title}</div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className={cn('h-full rounded-full bg-gradient-to-r', toneBar(s.tone))} style={{ width: `${s.progress}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400">{s.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TutorPreview() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid min-h-[440px] lg:grid-cols-[220px_1fr]">
      <div className="hidden flex-col gap-3 border-r border-white/[0.06] bg-ink-950/40 p-4 lg:flex">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tutor memory</div>
        {[
          { l: 'Weak topics', n: 3, c: 'from-pink-500 to-rose-600' },
          { l: 'Notes indexed', n: 2481, c: 'from-violet-500 to-indigo-600' },
          { l: 'Flashcard decks', n: 12, c: 'from-cyan-400 to-sky-600' },
          { l: 'Citations used', n: 86, c: 'from-emerald-400 to-teal-600' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className={cn('font-display text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r', s.c)}>{s.n}</div>
            <div className="text-[10px] text-slate-500">{s.l}</div>
          </div>
        ))}
        <div className="mt-auto rounded-xl border border-cyan-400/20 bg-cyan-500/[0.07] p-3 text-[10.5px] leading-relaxed text-cyan-100">
          Tutor is grounded in CS302 Unit 4, CS304 Units 1–5 and 6 past papers.
        </div>
      </div>

      <div className="flex min-w-0 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-3 border-b border-white/[0.07] pb-3">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
            <Bot className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
            <span className="absolute inset-0 rounded-xl bg-violet-500/50 animate-pulse-ring" />
          </span>
          <div>
            <div className="text-[13px] font-bold text-white">EduOS Tutor</div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Grounded in your 9 sources
            </div>
          </div>
          <span className="chip chip-violet ml-auto">Socratic mode</span>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-[12.5px] text-slate-200">
            I keep failing Bellman-Ford questions. Why does it beat Dijkstra?
          </div>
          <div className={cn('max-w-[88%] rounded-2xl rounded-bl-sm border border-violet-400/20 bg-gradient-to-br from-violet-600/[0.18] to-cyan-500/[0.10] px-3.5 py-3 transition-opacity duration-700', step >= 1 ? 'opacity-100' : 'opacity-0')}>
            <p className="text-[12.5px] leading-relaxed text-slate-200">
              Dijkstra locks in the nearest node assuming weights never decrease — one negative edge breaks that. Bellman-Ford relaxes{' '}
              <span className="font-semibold text-white">every edge |V| − 1 times</span>, so negative paths still propagate.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="chip chip-cyan">📄 Unit 4 notes · p.31</span>
              <span className="chip chip-cyan">📄 Worked examples · p.19</span>
            </div>
          </div>
          <div className={cn('max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-3 transition-opacity duration-700', step >= 2 ? 'opacity-100' : 'opacity-0')}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Your gap</div>
            <p className="mt-1 text-[12px] text-slate-300">
              You lost 2 of 3 questions on <span className="font-semibold text-white">negative-cycle detection</span> in the 28 Sep quiz.
            </p>
          </div>
          <div className={cn('flex items-center gap-2 transition-opacity duration-700', step >= 3 ? 'opacity-100' : 'opacity-0')}>
            <span className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
            <span className="text-[11px] text-slate-500">Generating a 6-question drill…</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <span className="text-[12px] text-slate-500">Ask anything about your syllabus…</span>
          <span className="ml-auto rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-2.5 py-1 text-[10px] font-bold text-white">↵</span>
        </div>
      </div>
    </div>
  );
}

function QuizPreview() {
  const [picked, setPicked] = useState<number | null>(1);
  return (
    <div className="grid min-h-[440px] gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="flex items-center justify-between">
          <span className="chip chip-violet">Question 7 of 20 · Adaptive</span>
          <span className="flex items-center gap-2 text-[11px] font-semibold text-amber-300">
            <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-amber-400/60 text-[9px]">18s</span>
            time left
          </span>
        </div>

        <p className="mt-4 text-[15px] font-semibold leading-relaxed text-white">
          A directed graph has one negative edge but no negative cycle. Which algorithm correctly reports the shortest path from a single source in the best worst-case time?
        </p>

        <div className="mt-4 space-y-2">
          {[
            'Dijkstra with a Fibonacci heap — O(E + V log V)',
            'Bellman-Ford — O(V·E), then one extra relaxation pass',
            'Floyd–Warshall on the full adjacency matrix',
            'BFS twice, once forward and once on the reversed graph',
          ].map((o, i) => (
            <button
              key={o}
              onClick={() => setPicked(i)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[12.5px] transition-all duration-300',
                picked === i
                  ? i === 1
                    ? 'border-emerald-400/50 bg-emerald-500/[0.12] text-white'
                    : 'border-pink-400/50 bg-pink-500/[0.12] text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20'
              )}
            >
              <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[10px] font-bold', picked === i ? 'border-white/25 bg-white/10 text-white' : 'border-white/[0.12] text-slate-500')}>
                {String.fromCharCode(65 + i)}
              </span>
              {o}
              {picked === i && i === 1 && <Check className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="btn btn-md btn-primary">Submit answer</button>
          <span className="text-[11px] text-slate-500">Explain why → available after submitting</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live difficulty</div>
          <div className="mt-3 space-y-2.5">
            {[
              { l: 'Correct so far', v: '6', g: 'from-emerald-400 to-teal-600' },
              { l: 'Streak', v: '4', g: 'from-amber-400 to-orange-600' },
              { l: 'Difficulty now', v: 'Hard', g: 'from-pink-500 to-rose-600' },
            ].map((x) => (
              <div key={x.l} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{x.l}</span>
                <span className={cn('rounded-lg bg-gradient-to-r px-2 py-0.5 text-[11px] font-bold text-white', x.g)}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Answer rhythm</div>
          <div className="mt-3 flex h-20 items-end gap-1">
            {[34, 41, 52, 96, 38, 44, 61, 47, 55, 49, 72, 58].map((t, i) => (
              <div
                key={i}
                className={cn('flex-1 rounded-t', i === 3 ? 'bg-gradient-to-t from-pink-500 to-rose-400' : 'bg-gradient-to-t from-violet-600 to-cyan-400')}
                style={{ height: `${(t / 100) * 100}%` }}
                title={`${t}s`}
              />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-slate-500">avg 54s / question · fastest 34s</div>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.10] to-violet-500/[0.10] p-4">
          <Quote className="h-4 w-4 text-cyan-300" />
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-300">
            Getting this right puts you in the <span className="font-bold text-white">top 4%</span> of your cohort today.
          </p>
        </div>
      </div>
    </div>
  );
}
