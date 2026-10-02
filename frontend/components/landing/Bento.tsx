import {
  Sparkles,
  CalendarClock,
  LineChart,
  Library,
  ListChecks,
  ClipboardList,
  Flame,
  ArrowUpRight,
  Quote,
  Target,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/fx/Reveal';
import TiltCard from '@/components/fx/TiltCard';
import { SectionHead, Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { Heatmap, StackedBar, Donut } from '@/components/ui/charts';
import { heatmap, focusSplit, mastery } from '@/lib/data';

export default function Bento() {
  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHead
            eyebrow="One workspace, zero tab chaos"
            title={
              <>
                Eight tools you use daily.
                <br />
                <span className="grad-text-brand">One continuous brain.</span>
              </>
            }
            sub="Most students run 11 tabs, 4 apps and a paper diary. EduOS collapses the whole loop — capture, understand, practise, plan, measure — into a single student-owned workspace."
          />
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-3 lg:grid-rows-3">
          {/* big: knowledge base */}
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <TiltCard intensity={5} className="h-full">
              <div className="panel card-hover relative flex h-full flex-col overflow-hidden p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-600/25 blur-[90px]" />
                <Chip tone="violet">
                  <Library className="h-3 w-3" /> Knowledge base
                </Chip>
                <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-[28px]">
                  Your notes become a searchable, citable second brain
                </h3>
                <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-slate-400">
                  Drop in PDFs, slides, scans and past papers. EduOS chunks, embeds and indexes them, so every answer you get points
                  back to <span className="text-slate-200">page 31 of Unit 4</span> — not a hallucinated blog post.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { l: 'Pages indexed', v: '2,481' },
                    { l: 'Avg. answer time', v: '1.4s' },
                    { l: 'Citation coverage', v: '100%' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5">
                      <div className="font-display text-xl font-extrabold text-white">{s.v}</div>
                      <div className="mt-0.5 text-[10.5px] uppercase tracking-wider text-slate-500">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* chunk → answer visual */}
                <div className="mt-6 flex-1 space-y-2.5">
                  {[
                    { t: 'Unit 4 — Graph Algorithms.pdf · p.31', c: 'from-violet-500 to-indigo-600', w: '78%' },
                    { t: 'Dijkstra worked examples.pdf · p.19', c: 'from-cyan-400 to-sky-600', w: '64%' },
                    { t: '2024 End-Sem paper · Q3(b)', c: 'from-emerald-400 to-teal-600', w: '51%' },
                  ].map((r, i) => (
                    <div key={r.t} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5">
                      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white', r.c)}>
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-300">{r.t}</span>
                      <span className="hidden w-24 sm:block">
                        <ProgressBar value={parseInt(r.w)} height={5} />
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{r.w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* AI tutor */}
          <Reveal delay={80}>
            <TiltCard intensity={7} className="h-full">
              <div className="panel card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/25 blur-[70px]" />
                <Chip tone="cyan">
                  <Sparkles className="h-3 w-3" /> AI Tutor
                </Chip>
                <h3 className="mt-4 font-display text-xl font-bold text-white">Socratic, not spoon-fed</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                  It hints, drills and quizzes you until the idea clicks — then schedules a spaced-repetition check for 3, 7 and 21 days later.
                </p>
                <div className="mt-5 space-y-2">
                  {['Explains with your own notes', 'Generates mock papers', 'Finds your blind spots'].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[12.5px] text-slate-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-cyan-400" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* streak */}
          <Reveal delay={140}>
            <TiltCard intensity={7} className="h-full">
              <div className="panel card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-orange-500/25 blur-[70px]" />
                <div className="flex items-start justify-between">
                  <Chip tone="amber">
                    <Flame className="h-3 w-3" /> Momentum
                  </Chip>
                  <ProgressRing value={63} size={62} stroke={6} from="#F59E0B" to="#EC4899" label={<span className="text-[13px]">26d</span>} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">Streaks that survive exam week</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                  Adaptive daily targets that shrink when you are drowning and stretch when you are flying.
                </p>
              </div>
            </TiltCard>
          </Reveal>

          {/* planner */}
          <Reveal delay={80}>
            <TiltCard intensity={7} className="h-full">
              <div className="panel card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-[70px]" />
                <Chip tone="emerald">
                  <CalendarClock className="h-3 w-3" /> Autonomous planner
                </Chip>
                <h3 className="mt-4 font-display text-xl font-bold text-white">Your week, rebuilt every night</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                  Miss a slot? The plan re-solves itself around deadlines, energy levels and 40+ other constraints.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    { t: '09:00 DSA — Graph proofs', c: 'violet' },
                    { t: '14:00 CN lab catch-up', c: 'pink' },
                    { t: '19:30 DSA flashcards', c: 'cyan' },
                  ].map((x) => (
                    <div key={x.t} className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-slate-300">
                      <span
                        className={cn('h-4 w-1 rounded-full', {
                          violet: 'bg-violet-500',
                          pink: 'bg-pink-500',
                          cyan: 'bg-cyan-400',
                        }[x.c])}
                      />
                      {x.t}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* heatmap */}
          <Reveal delay={140} className="lg:col-span-2">
            <div className="panel card-hover relative h-full overflow-hidden p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Chip tone="violet">
                    <LineChart className="h-3 w-3" /> Consistency
                  </Chip>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">See the 12 weeks nobody else sees</h3>
                  <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-slate-400">
                    Not vanity charts — actual signals: which days you collapse, which subjects you avoid, and what your exam readiness is today.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="font-display text-2xl font-extrabold text-white">82</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">focus score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl font-extrabold text-white">+34%</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">vs last term</div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Heatmap matrix={heatmap} />
              </div>
            </div>
          </Reveal>

          {/* quizzes */}
          <Reveal delay={80}>
            <TiltCard intensity={7} className="h-full">
              <div className="panel card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-pink-500/[0.22] blur-[70px]" />
                <Chip tone="pink">
                  <ListChecks className="h-3 w-3" /> Adaptive testing
                </Chip>
                <h3 className="mt-4 font-display text-xl font-bold text-white">Questions that escalate with you</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                  Difficulty adjusts per answer, so you stop wasting evenings on things you already know.
                </p>
                <div className="mt-5 flex justify-center">
                  <Donut
                    data={[
                      { label: 'Correct', value: 18, tone: '#22D3EE' },
                      { label: 'Wrong', value: 1, tone: '#EC4899' },
                      { label: 'Skipped', value: 1, tone: '#F59E0B' },
                    ]}
                    size={148}
                    thickness={16}
                    center={
                      <span>
                        <span className="block font-display text-2xl font-extrabold text-white">92%</span>
                        <span className="text-[9px] uppercase tracking-widest text-slate-500">best score</span>
                      </span>
                    }
                  />
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* assignments */}
          <Reveal delay={140}>
            <TiltCard intensity={7} className="h-full">
              <div className="panel card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-indigo-500/25 blur-[70px]" />
                <Chip tone="violet">
                  <ClipboardList className="h-3 w-3" /> Deadlines
                </Chip>
                <h3 className="mt-4 font-display text-xl font-bold text-white">Never lose a submission again</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                  Weighted GPA impact, submission checklists and reminders scaled to how much the grade actually matters.
                </p>
                <div className="mt-5 space-y-2.5">
                  {[
                    { t: 'CN socket server lab', d: 'Overdue 4d', c: 'from-pink-500 to-rose-600', w: 20 },
                    { t: 'RB-tree benchmark report', d: 'Due tomorrow', c: 'from-amber-400 to-orange-600', w: 65 },
                    { t: 'Logistic regression project', d: 'Due in 7d', c: 'from-violet-500 to-indigo-600', w: 25 },
                  ].map((a) => (
                    <div key={a.t} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-slate-200">{a.t}</span>
                        <span className="text-[10.5px] text-slate-500">{a.d}</span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={a.w} height={5} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* mastery + focus */}
          <Reveal delay={80} className="lg:col-span-2">
            <div className="panel card-hover relative h-full overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-16 bottom--10 h-48 w-48 rounded-full bg-cyan-500/[0.18] blur-[80px]" />
              <div className="grid gap-6 sm:grid-cols-[1fr_260px]">
                <div>
                  <Chip tone="cyan">
                    <Target className="h-3 w-3" /> Skill radar
                  </Chip>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">Know your shape, not just your marks</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                    Six dimensions tracked per subject and compared against your own cohort — so you can see whether you are slow, shallow, or simply inconsistent.
                  </p>
                  <div className="mt-6">
                    <StackedBar data={focusSplit} height={12} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {mastery.slice(0, 4).map((m) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{m.label}</span>
                          <span className="font-bold text-white">{m.a}%</span>
                        </div>
                        <div className="mt-1.5">
                          <ProgressBar value={m.a} height={5} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative hidden place-items-center sm:grid">
                  {/* mini radar drawn with stacked rings */}
                  <div className="relative grid h-[210px] w-[210px] place-items-center">
                    {[1, 0.74, 0.48, 0.24].map((f, i) => (
                      <span
                        key={i}
                        className="absolute rounded-full border border-white/[0.09]"
                        style={{ width: `${210 * f}px`, height: `${210 * f}px` }}
                      />
                    ))}
                    <span className="absolute h-[150px] w-[150px] rounded-full bg-gradient-to-br from-violet-500/45 to-cyan-400/25 blur-[2px] [clip-path:polygon(50%_0%,93%_25%,93%_75%,50%_100%,7%_75%,7%_25%)]" />
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="absolute h-[105px] w-px origin-bottom bg-white/[0.08]" style={{ transform: `rotate(${i * 60}deg) translateY(-52px)` }} />
                    ))}
                    <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-[11px] font-extrabold text-white shadow-glow">
                      79
                    </span>
                  </div>
                  <ArrowUpRight className="absolute right-2 top-2 h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* quote strip */}
        <Reveal delay={60}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { q: 'I stopped maintaining a notes folder. Everything I need already quotes itself back to me.', n: 'Ishita V.', r: 'BITS · CSE 3rd yr' },
              { q: 'The planner re-solved my week when I lost 6 hours to a hackathon. That alone paid for it.', n: 'Rahul N.', r: 'NIT · ECE' },
              { q: 'Adaptive quizzes found the three topics I had been faking for months.', n: 'Sneha P.', r: 'VIT · IT' },
            ].map((t, i) => (
              <div key={i} className="panel relative overflow-hidden p-5">
                <Quote className="h-4 w-4 text-violet-400/70" />
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300">{t.q}</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span
                    className={cn(
                      'grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white',
                      ['bg-gradient-to-br from-amber-400 to-orange-600', 'bg-gradient-to-br from-violet-500 to-indigo-600', 'bg-gradient-to-br from-cyan-400 to-sky-600'][i]
                    )}
                  >
                    {t.n.split(' ').map((x) => x[0]).join('')}
                  </span>
                  <div>
                    <div className="text-[12px] font-bold text-white">{t.n}</div>
                    <div className="text-[10.5px] text-slate-500">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
