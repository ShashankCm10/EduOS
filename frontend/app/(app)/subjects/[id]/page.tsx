'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  Users,
  MapPin,
  Award,
  Clock,
  CalendarDays,
  Sparkles,
  Check,
  ChevronDown,
  FileText,
  ClipboardList,
  ListChecks,
  PlayCircle,
  Download,
  TrendingUp,
  TriangleAlert,
  CircleCheck,
  BookOpen,
} from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { Donut, GroupBars, RadarChart } from '@/components/ui/charts';
import { cn, toneGrad, toneBar, toneHex, clamp } from '@/lib/utils';
import { subjects, materials, assignments, quizzes, mastery, assignmentStatusMeta } from '@/lib/data';

const MODULES = [
  { n: 1, t: 'Foundations & complexity analysis', l: 8, done: true, topics: ['Big-O', 'Amortised analysis', 'Recurrences'] },
  { n: 2, t: 'Linear structures', l: 10, done: true, topics: ['Arrays', 'Linked lists', 'Stacks', 'Queues'] },
  { n: 3, t: 'Trees & heaps', l: 12, done: true, topics: ['BST', 'AVL', 'Heaps', 'Tries'] },
  { n: 4, t: 'Graph algorithms', l: 14, done: true, topics: ['BFS/DFS', 'Dijkstra', 'Bellman-Ford', 'MST'] },
  { n: 5, t: 'Hashing & string matching', l: 9, done: true, topics: ['Hash maps', 'KMP', 'Rabin-Karp'] },
  { n: 6, t: 'Greedy algorithms', l: 8, done: true, topics: ['Interval scheduling', 'Huffman', 'Matroids'] },
  { n: 7, t: 'Dynamic programming I', l: 11, done: true, topics: ['Memoisation', 'LCS', 'Knapsack'] },
  { n: 8, t: 'Dynamic programming II', l: 10, done: false, topics: ['Bitmask DP', 'Tree DP', 'Digit DP'], current: true },
  { n: 9, t: 'Advanced & exam revision', l: 12, done: false, topics: ['NP-hardness', 'Past papers', 'Mock tests'] },
];

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const subject = subjects.find((s) => s.id === id) ?? subjects[0];

  const [tab, setTab] = useState<
    'overview' | 'curriculum' | 'materials' | 'assessments' | 'attendance'
  >('overview');
  const [openModule, setOpenModule] = useState<number | null>(8);

  const [c1, c2] = toneHex(subject.tone);
  const subjMaterials = materials.filter((m) => m.subjectId === subject.id);
  const subjAssignments = assignments.filter((a) => a.subjectId === subject.id);
  const subjQuizzes = quizzes.filter((q) => q.subjectId === subject.id);

  const TABS = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'curriculum' as const, label: `Curriculum · ${subject.modules} modules` },
    { id: 'materials' as const, label: `Materials · ${subjMaterials.length}` },
    { id: 'assessments' as const, label: `Assessments · ${subjAssignments.length + subjQuizzes.length}` },
    { id: 'attendance' as const, label: `Attendance · ${subject.attendance}%` },
  ];

  return (
    <div className="space-y-6">
      <Link href="/subjects" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      {/* hero */}
      <Reveal>
        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-[90px]" style={{ background: `linear-gradient(135deg,${c1},${c2})` }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 dot-bg opacity-[0.15]" />

          <div className="relative flex flex-wrap items-start gap-6">
            <span className={cn('grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br font-display text-base font-extrabold text-white shadow-lift', toneGrad(subject.tone))}>
              {subject.short}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="chip font-mono">{subject.code}</span>
                <Chip tone="violet">{subject.credits} credits</Chip>
                <Chip tone="emerald">Grade {subject.grade}</Chip>
                {subject.attendance < 82 && (
                  <Chip tone="pink">
                    <TriangleAlert className="h-3 w-3" /> Attendance risk
                  </Chip>
                )}
              </div>
              <h1 className="display-xl mt-3.5 text-[clamp(1.6rem,3.6vw,2.5rem)] text-white">{subject.title}</h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-400">{subject.blurb}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-violet-300" /> {subject.faculty}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-300" /> {subject.room}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-emerald-300" /> Next class {subject.next}
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-300" /> {subject.credits} credits · 3-0-0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <ProgressRing value={subject.progress} size={110} stroke={9} from={c1} to={c2} sub="syllabus" label={<span className="text-xl">{subject.progress}%</span>} />
              <div className="flex flex-col gap-2">
                <button className="btn btn-md btn-primary">
                  <PlayCircle className="h-4 w-4" /> Resume studying
                </button>
                <button className="btn btn-md btn-ghost">
                  <Download className="h-4 w-4" /> Export notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'relative shrink-0 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold transition-all duration-300',
              tab === t.id ? 'text-white' : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
            )}
          >
            {tab === t.id && <span className="absolute inset-0 rounded-xl border border-white/15 bg-gradient-to-r from-violet-600/80 to-cyan-500/40" />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- OVERVIEW ---------------- */}
      {tab === 'overview' && (
        <div className="space-y-4 animate-fade-up">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { l: 'Current score', v: `${subject.score}%`, s: `Grade ${subject.grade} · top 18% of class`, i: Award },
              { l: 'Attendance', v: `${subject.attendance}%`, s: 'Minimum 75% required to sit the exam', i: CalendarDays },
              { l: 'Modules done', v: `${subject.modulesDone}/${subject.modules}`, s: '1 module in progress right now', i: BookOpen },
            ].map((x) => (
              <div key={x.l} className="panel p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{x.l}</span>
                  <x.i className="h-4 w-4 text-slate-500" />
                </div>
                <div className="mt-2 font-display text-2xl font-extrabold text-white">{x.v}</div>
                <div className="mt-1 text-[11.5px] text-slate-500">{x.s}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Assessment scores across the semester</h3>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Continuous assessment vs your cohort average</p>
              <div className="mt-5">
                <GroupBars
                  height={210}
                  unit="%"
                  aName="You"
                  bName="Cohort avg"
                  from={c1}
                  to={c2}
                  data={[
                    { label: 'Quiz 1', a: 72, b: 64 },
                    { label: 'Assign 1', a: 85, b: 70 },
                    { label: 'Quiz 2', a: 78, b: 66 },
                    { label: 'Mid-sem', a: 81, b: 63 },
                    { label: 'Assign 2', a: 92, b: 71 },
                    { label: 'Quiz 3', a: 92, b: 69 },
                  ]}
                />
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Skill shape in this course</h3>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Six tracked dimensions</p>
              <div className="mt-2 grid place-items-center">
                <RadarChart axes={mastery} size={300} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="panel p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-300" />
                <h3 className="font-display text-[15px] font-bold text-white">AI read on this course</h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-3.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">Strength</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-200">
                    Dynamic programming accuracy is 94% — you can safely drop DP drills and reinvest that time.
                  </p>
                </div>
                <div className="rounded-2xl border border-pink-400/25 bg-pink-500/[0.08] p-3.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-pink-300">Gap</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-200">
                    Negative-cycle detection is your only sub-70% topic. It has appeared in 6 of the last 8 papers.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/[0.08] p-3.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-cyan-300">Next 7 days</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-200">
                    Finish Module 8, then attempt the 2019–2024 graph section under timed conditions.
                  </p>
                </div>
              </div>
              <Link href="/tutor" className="btn btn-sm btn-primary mt-4 w-full">
                <Sparkles className="h-3.5 w-3.5" /> Drill this now
              </Link>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Topic mastery</h3>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Weighted by how often each topic appears in past papers</p>
              <div className="mt-4 space-y-3.5">
                {[
                  { t: 'Graphs & traversal', v: 94, w: 'High weight' },
                  { t: 'Dynamic programming', v: 88, w: 'High weight' },
                  { t: 'Trees & heaps', v: 86, w: 'Medium' },
                  { t: 'Hashing & strings', v: 79, w: 'Medium' },
                  { t: 'Greedy algorithms', v: 74, w: 'Low' },
                  { t: 'Complexity analysis', v: 68, w: 'High weight' },
                ].map((x) => (
                  <div key={x.t}>
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-slate-300">{x.t}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">{x.w}</span>
                        <span className={cn('font-bold', x.v > 85 ? 'text-emerald-300' : x.v > 75 ? 'text-cyan-300' : 'text-pink-300')}>{x.v}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={x.v} height={6} from={x.v > 85 ? '#10B981' : x.v > 75 ? c1 : '#EC4899'} to={x.v > 85 ? '#84CC16' : x.v > 75 ? c2 : '#F59E0B'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CURRICULUM ---------------- */}
      {tab === 'curriculum' && (
        <div className="space-y-3 animate-fade-up">
          <div className="panel flex flex-wrap items-center gap-4 p-5">
            <ProgressRing value={(subject.modulesDone / subject.modules) * 100} size={72} stroke={7} from={c1} to={c2} label={<span className="text-sm">{subject.modulesDone}/{subject.modules}</span>} />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[15px] font-bold text-white">Syllabus progress</h3>
              <p className="mt-0.5 text-[12px] text-slate-400">
                {subject.modules - subject.modulesDone} modules left · estimated {14 + (subject.modules - subject.modulesDone) * 3} study hours at your current pace
              </p>
            </div>
            <Chip tone="violet">On track for week 12</Chip>
          </div>

          {MODULES.map((m, i) => {
            const on = openModule === m.n;
            return (
              <Reveal key={m.n} delay={i * 40}>
                <div className={cn('overflow-hidden rounded-2xl border transition-all duration-500', on ? 'border-violet-400/35 bg-gradient-to-br from-violet-600/[0.10] to-cyan-500/[0.04]' : 'border-white/[0.08] bg-white/[0.028] hover:border-white/20')}>
                  <button onClick={() => setOpenModule(on ? null : m.n)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                    <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold transition', m.done ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white' : m.current ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white' : 'border border-white/12 bg-white/[0.04] text-slate-500')}>
                      {m.done ? <Check className="h-4 w-4" /> : m.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-[14px] font-semibold', on ? 'text-white' : 'text-slate-200')}>{m.t}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {m.l} lectures · {m.topics.length} topics
                        {m.current && <span className="ml-2 font-semibold text-cyan-300">in progress</span>}
                      </span>
                    </span>
                    <span className="hidden gap-1.5 sm:flex">
                      {m.topics.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-400">
                          {t}
                        </span>
                      ))}
                    </span>
                    <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-500 transition-transform duration-500', on && 'rotate-180')} />
                  </button>

                  <div className="grid transition-all duration-500 ease-spring" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <div className="border-t border-white/[0.07] px-5 py-4">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Array.from({ length: Math.min(6, m.l) }).map((_, k) => (
                            <div key={k} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                              <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[10px] font-bold', m.done ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.06] text-slate-400')}>
                                {k + 1}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[12px] text-slate-300">
                                Lecture {m.n}.{k + 1} — {m.topics[k % m.topics.length]}
                              </span>
                              {m.done ? <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> : <PlayCircle className="h-3.5 w-3.5 shrink-0 text-slate-500" />}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href="/materials" className="btn btn-sm btn-ghost">
                            <FileText className="h-3.5 w-3.5" /> Module notes
                          </Link>
                          <Link href="/quizzes" className="btn btn-sm btn-ghost">
                            <ListChecks className="h-3.5 w-3.5" /> Take module quiz
                          </Link>
                          {m.current && (
                            <Link href="/tutor" className="btn btn-sm btn-primary">
                              <Sparkles className="h-3.5 w-3.5" /> Study with AI
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* ---------------- MATERIALS ---------------- */}
      {tab === 'materials' && (
        <div className="space-y-3 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="violet">{subjMaterials.length} documents</Chip>
            <Chip tone="cyan">{subjMaterials.reduce((s, m) => s + m.pages, 0)} pages indexed</Chip>
            <Link href="/materials" className="btn btn-sm btn-primary ml-auto">
              <Sparkles className="h-3.5 w-3.5" /> Ask across all of them
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {subjMaterials.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div className="panel card-hover flex h-full gap-4 p-5">
                  <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white', toneGrad(subject.tone))}>
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13.5px] font-semibold leading-snug text-white">{m.title}</h4>
                      {m.starred && <span className="shrink-0 text-amber-400">★</span>}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[10.5px] text-slate-500">
                      <span className="chip chip-violet">{m.kind}</span>
                      <span>{m.pages} pages</span>
                      <span>{m.size}</span>
                      <span>updated {m.updated}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={m.read} height={5} from={c1} to={c2} className="flex-1" />
                      <span className="shrink-0 text-[10.5px] font-bold text-slate-400">{m.read}% read</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="btn btn-sm btn-ghost">Open</button>
                      <Link href="/materials" className="btn btn-sm btn-ghost">
                        <Sparkles className="h-3.5 w-3.5" /> Ask AI
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- ASSESSMENTS ---------------- */}
      {tab === 'assessments' && (
        <div className="grid gap-4 xl:grid-cols-2 animate-fade-up">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-violet-300" />
              <h3 className="font-display text-[15px] font-bold text-white">Assignments</h3>
              <span className="chip ml-auto">{subjAssignments.length}</span>
            </div>
            {subjAssignments.map((a) => {
              const meta = assignmentStatusMeta[a.status];
              return (
                <div key={a.id} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-[13.5px] font-semibold leading-snug text-white">{a.title}</h4>
                    <span className={cn('chip shrink-0', meta.chip)}>{meta.label}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>{a.type}</span>
                    <span>Weight {a.weight}%</span>
                    <span>
                      {a.score !== undefined ? `Scored ${a.score}/${a.max}` : `Due ${a.due}`}
                    </span>
                  </div>
                  {a.score !== undefined ? (
                    <div className="mt-3">
                      <ProgressBar value={(a.score / a.max) * 100} height={5} from="#10B981" to="#84CC16" />
                    </div>
                  ) : (
                    <div className="mt-3">
                      <ProgressBar value={a.progress} height={5} from={c1} to={c2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-cyan-300" />
              <h3 className="font-display text-[15px] font-bold text-white">Quizzes</h3>
              <span className="chip ml-auto">{subjQuizzes.length}</span>
            </div>
            {subjQuizzes.map((q) => (
              <div key={q.id} className="panel flex items-center gap-4 p-4">
                <ProgressRing
                  value={q.best ?? 0}
                  size={58}
                  stroke={6}
                  from={q.best && q.best > 80 ? '#10B981' : c1}
                  to={q.best && q.best > 80 ? '#84CC16' : c2}
                  label={<span className="text-[11px]">{q.best ?? '—'}</span>}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[13.5px] font-semibold text-white">{q.title}</h4>
                  <div className="mt-1 flex flex-wrap gap-2 text-[10.5px] text-slate-500">
                    <span className="chip chip-cyan">{q.difficulty}</span>
                    <span>
                      {q.questions}Q · {q.minutes}m
                    </span>
                    <span>{q.attempts} attempts</span>
                  </div>
                </div>
                <Link href="/quizzes" className="btn btn-sm btn-ghost shrink-0">
                  {q.status === 'completed' ? 'Retake' : 'Start'}
                </Link>
              </div>
            ))}

            <div className="panel relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-violet-600/25 blur-[70px]" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-300" />
                <h3 className="font-display text-[14px] font-bold text-white">Weighted grade forecast</h3>
              </div>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing value={subject.score} size={92} stroke={8} from="#F59E0B" to="#EC4899" label={<span className="text-lg">{subject.score}</span>} sub={subject.grade} />
                <div className="space-y-2 text-[11.5px]">
                  {[
                    { l: 'Internals (40%)', v: '88 / 100' },
                    { l: 'Mid-sem (20%)', v: '81 / 100' },
                    { l: 'End-sem projection', v: '76 / 100' },
                    { l: 'Projected final', v: 'A (8.6)' },
                  ].map((x) => (
                    <div key={x.l} className="flex items-center justify-between gap-6">
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-bold text-white">{x.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ATTENDANCE ---------------- */}
      {tab === 'attendance' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr] animate-fade-up">
          <div className="panel p-5">
            <h3 className="font-display text-[15px] font-bold text-white">Attendance so far</h3>
            <p className="mt-0.5 text-[11.5px] text-slate-500">Minimum 75% required to sit the end-semester exam</p>
            <div className="mt-5 grid place-items-center">
              <Donut
                size={210}
                thickness={24}
                data={[
                  { label: 'Present', value: subject.attendance, tone: '#22D3EE' },
                  { label: 'Absent', value: 100 - subject.attendance, tone: '#EC4899' },
                ]}
                center={
                  <span>
                    <span className="block font-display text-3xl font-extrabold text-white">{subject.attendance}%</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">attended</span>
                  </span>
                }
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4 text-center">
              {[
                { l: 'Classes held', v: 48 },
                { l: 'Attended', v: Math.round((subject.attendance / 100) * 48) },
                { l: 'Can still skip', v: Math.max(0, Math.round((subject.attendance / 100) * 48 - 0.75 * 48)) },
              ].map((x) => (
                <div key={x.l}>
                  <div className="font-display text-lg font-extrabold text-white">{x.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">{x.l}</div>
                </div>
              ))}
            </div>
            <div className={cn('mt-4 flex items-start gap-2.5 rounded-xl border p-3.5', subject.attendance >= 82 ? 'border-emerald-400/25 bg-emerald-500/[0.08]' : 'border-pink-400/25 bg-pink-500/[0.08]')}>
              {subject.attendance >= 82 ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />}
              <p className="text-[11.5px] leading-relaxed text-slate-300">
                {subject.attendance >= 82
                  ? `You are comfortably above the threshold. At this rate you can miss 3 more classes without risking your exam eligibility.`
                  : `You are close to the 75% threshold. Attending the next 6 classes in a row restores a safe margin.`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Weekly breakdown</h3>
              <div className="mt-5">
                <GroupBars
                  height={190}
                  unit="%"
                  aName="This course"
                  bName="Your average"
                  from={c1}
                  to={c2}
                  data={[
                    { label: 'Week 1', a: 100, b: 96 },
                    { label: 'Week 2', a: 100, b: 92 },
                    { label: 'Week 3', a: 75, b: 88 },
                    { label: 'Week 4', a: 100, b: 94 },
                    { label: 'Week 5', a: 67, b: 90 },
                    { label: 'Week 6', a: 100, b: 91 },
                  ]}
                />
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="font-display text-[15px] font-bold text-white">Recent classes</h3>
              <div className="mt-4 space-y-2">
                {[
                  { d: 'Mon 29 Sep', t: 'DP II — bitmask', s: 'present', note: 'Took notes' },
                  { d: 'Fri 26 Sep', t: 'Tutorial — DP I', s: 'present', note: 'Asked 2 doubts' },
                  { d: 'Wed 24 Sep', t: 'DP I — LCS', s: 'absent', note: 'Medical' },
                  { d: 'Mon 22 Sep', t: 'Greedy — Huffman', s: 'present', note: '—' },
                ].map((x) => (
                  <div key={x.d} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.028] px-3.5 py-2.5">
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', x.s === 'present' ? 'bg-emerald-400' : 'bg-pink-500')} />
                    <span className="w-20 shrink-0 text-[11px] text-slate-500">{x.d}</span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-200">{x.t}</span>
                    <span className="hidden shrink-0 text-[11px] text-slate-500 sm:block">{x.note}</span>
                    <span className={cn('chip shrink-0', x.s === 'present' ? 'chip-emerald' : 'chip-pink')}>{x.s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                <TriangleAlert className="h-3.5 w-3.5" />
                Attendance is synced from your timetable; you can correct any entry manually.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
