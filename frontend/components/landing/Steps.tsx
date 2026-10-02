import { Upload, BrainCircuit, Trophy, CircleCheck } from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import { SectionHead, Chip } from '@/components/ui/core';
import CountUp from '@/components/fx/CountUp';

const STEPS = [
  {
    n: '01',
    icon: Upload,
    title: 'Pour in your semester',
    body: 'Syllabus PDFs, lecture slides, scanned notes, past papers, your timetable photo. EduOS parses all of it in under a minute — including handwriting.',
    tags: ['PDF', 'Slides', 'Scans', 'Photos'],
    tone: { ring: 'from-violet-500 to-indigo-600', text: 'text-violet-300', glow: 'bg-violet-600/30' },
  },
  {
    n: '02',
    icon: BrainCircuit,
    title: 'EduOS builds your model',
    body: 'It maps topics to courses, finds prerequisites, estimates how long each topic will take you, and starts tracking every quiz, assignment and study minute.',
    tags: ['Topic graph', 'Difficulty model', 'Spaced repetition'],
    tone: { ring: 'from-cyan-400 to-sky-600', text: 'text-cyan-300', glow: 'bg-cyan-500/30' },
  },
  {
    n: '03',
    icon: Trophy,
    title: 'Walk in ready',
    body: 'Each morning you get one short brief: what to study, what to skip, what is slipping. Each night it re-solves your week. Exam day becomes boring.',
    tags: ['Daily brief', 'Auto-replan', 'Readiness score'],
    tone: { ring: 'from-emerald-400 to-teal-600', text: 'text-emerald-300', glow: 'bg-emerald-500/30' },
  },
];

const STATS = [
  { v: 61400, s: '+', l: 'Students onboarded' },
  { v: 2.4, s: 'M', l: 'Pages indexed', d: 1 },
  { v: 18, s: '%', l: 'Avg. grade lift' },
  { v: 4.3, s: 'M', l: 'Questions answered', d: 1 },
];

export default function Steps() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHead
            eyebrow="How it works"
            title={
              <>
                Set up in one evening.
                <br />
                <span className="grad-text-brand">Compounding for four years.</span>
              </>
            }
            sub="No migration project, no IT ticket, no 40-slide training deck. If you can drag a file, you can run EduOS."
          />
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line */}
          <div aria-hidden className="absolute left-0 right-0 top-[68px] hidden h-px lg:block">
            <div className="mx-auto h-px w-[70%] bg-gradient-to-r from-violet-500/0 via-violet-400/50 to-emerald-400/0" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="panel card-hover group relative h-full overflow-hidden p-6 sm:p-7">
                  <div className={`pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full blur-[80px] transition-opacity duration-500 group-hover:opacity-100 ${s.tone.glow} opacity-60`} />
                  <div className="flex items-center justify-between">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${s.tone.ring}`}>
                      <s.icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-extrabold leading-none text-white/[0.07] transition group-hover:text-white/[0.12]">{s.n}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* metrics band */}
        <Reveal delay={100}>
          <div className="aura-border mt-16 overflow-hidden rounded-[1.6rem] p-[1px]">
            <div className="grid gap-8 rounded-[1.55rem] bg-ink-900/80 px-6 py-10 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
              {STATS.map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-display text-[clamp(2rem,4vw,2.9rem)] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
                    <CountUp to={s.v} decimals={s.d ?? 0} suffix={s.s} />
                  </div>
                  <div className="mt-2 text-[12px] uppercase tracking-[0.2em] text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] text-slate-400">
            {['Works offline first', 'Exports to PDF & ICS', 'No card required', 'Cancel anytime', 'WCAG AA contrast'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-emerald-400" /> {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
