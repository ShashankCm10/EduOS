'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Plus,
  Search,
  ChevronDown,
  Paperclip,
  Upload,
  Sparkles,
  Clock,
  TriangleAlert,
  CircleCheck,
  CalendarDays,
  Target,
  TrendingUp,
  FileText,
  Check,
  Timer,
  Gauge,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { Donut } from '@/components/ui/charts';
import { cn, toneGrad, toneHex, daysUntil, fmtDate } from '@/lib/utils';
import { assignments, subjects, assignmentStatusMeta, type Assignment } from '@/lib/data';

type Filter = 'all' | 'open' | 'due-soon' | 'graded';

const CHECKLIST: Record<string, string[]> = {
  a1: ['Implement RB-tree with rotation accounting', 'Implement AVL insert/delete', 'Benchmark 1e6 keys, capture p99', 'Plot rebalance counts + latency', 'Write the 2-page comparison'],
  a2: ['Model 4 processes + 1 resource', 'Demonstrate priority inversion', 'Implement inheritance protocol', 'Capture trace logs', 'Writeup with timing table'],
  a4: ['Threaded server baseline', 'select()/epoll server', 'Load-test harness to 5k clients', 'Measure throughput + p99', 'Report + graphs'],
  a5: ['Derive log-loss gradient', 'Implement batch GD from scratch', 'Add L2 + early stopping', 'Convergence curves', 'Compare against sklearn'],
};

const TONE_BAR: Record<string, string> = {
  violet: 'from-violet-500 to-indigo-400',
  cyan: 'from-cyan-400 to-sky-400',
  emerald: 'from-emerald-400 to-teal-400',
  amber: 'from-amber-400 to-orange-400',
  pink: 'from-fuchsia-500 to-pink-400',
  rose: 'from-rose-400 to-red-400',
};

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<Filter>('open');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>('a1');
  const [done, setDone] = useState<Record<string, string[]>>({});

  const list = useMemo(
    () =>
      assignments
        .filter((a) => {
          if (!a.title.toLowerCase().includes(q.toLowerCase())) return false;
          if (filter === 'open') return ['due-soon', 'in-progress', 'overdue'].includes(a.status);
          if (filter === 'due-soon') return ['due-soon', 'overdue'].includes(a.status);
          if (filter === 'graded') return a.status === 'graded';
          return true;
        })
        .sort((a, b) => daysUntil(a.due) - daysUntil(b.due)),
    [filter, q]
  );

  const openList = assignments.filter((a) => ['due-soon', 'in-progress', 'overdue'].includes(a.status));
  const graded = assignments.filter((a) => a.status === 'graded');
  const avgGraded = Math.round(graded.reduce((s, a) => s + (a.score ?? 0), 0) / graded.length);
  const weightAtRisk = assignments.filter((a) => ['overdue', 'due-soon'].includes(a.status)).reduce((s, a) => s + a.weight, 0);

  const FILTERS: { id: Filter; label: string; n: number }[] = [
    { id: 'open', label: 'Open', n: openList.length },
    { id: 'due-soon', label: 'Urgent', n: assignments.filter((a) => ['due-soon', 'overdue'].includes(a.status)).length },
    { id: 'graded', label: 'Graded', n: graded.length },
    { id: 'all', label: 'All', n: assignments.length },
  ];

  const toggle = (aid: string, item: string) =>
    setDone((p) => {
      const cur = p[aid] ?? [];
      return { ...p, [aid]: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] };
    });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <ClipboardList className="h-3.5 w-3.5" /> {openList.length} open · {weightAtRisk}% of term weight at risk
          </>
        }
        title={
          <>
            Assignments & <span className="grad-text">Submissions</span>
          </>
        }
        sub="Ranked by real grade impact, not by whatever shouts loudest. Every brief is broken into tickable steps, with reminders scaled to how much it actually matters."
        actions={
          <>
            <button className="btn btn-md btn-ghost">
              <CalendarDays className="h-4 w-4" /> Sync to calendar
            </button>
            <button className="btn btn-md btn-primary shine">
              <Plus className="h-4 w-4" /> Add assignment
            </button>
          </>
        }
      />

      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { l: 'Open now', v: openList.length, s: `${openList.filter((a) => a.status === 'overdue').length} overdue`, i: ClipboardList, tone: 'from-violet-500 to-indigo-600' },
            { l: 'Due within 7 days', v: assignments.filter((a) => daysUntil(a.due) <= 7 && daysUntil(a.due) >= 0).length, s: 'next: RB-tree report', i: Timer, tone: 'from-amber-400 to-orange-600' },
            { l: 'Graded average', v: `${avgGraded}%`, s: `${graded.length} submissions returned`, i: TrendingUp, tone: 'from-emerald-400 to-teal-600' },
            { l: 'Weight at risk', v: `${weightAtRisk}%`, s: 'if nothing changes this week', i: TriangleAlert, tone: 'from-pink-500 to-rose-600' },
          ].map((x) => (
            <div key={x.l} className="panel flex items-center gap-4 p-4">
              <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white', x.tone)}>
                <x.i className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-xl font-extrabold text-white">{x.v}</div>
                <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                <div className="text-[10.5px] text-slate-500">{x.s}</div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300',
                    filter === f.id
                      ? 'border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_10px_28px_-12px_rgba(124,58,237,1)]'
                      : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white'
                  )}
                >
                  {f.label}
                  <span className={cn('rounded-full px-1.5 text-[10px]', filter === f.id ? 'bg-white/25' : 'bg-white/10')}>{f.n}</span>
                </button>
              ))}
              <div className="relative ml-auto">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search assignments…"
                  className="h-10 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-3 text-[13px] text-white focus:border-violet-400/60 sm:w-64"
                />
              </div>
            </div>
          </Reveal>

          {list.map((a, i) => (
            <Reveal key={a.id} delay={i * 50}>
              <AssignmentCard
                a={a}
                open={open === a.id}
                onToggle={() => setOpen(open === a.id ? null : a.id)}
                done={done[a.id] ?? []}
                onCheck={(item) => toggle(a.id, item)}
              />
            </Reveal>
          ))}

          {list.length === 0 && (
            <div className="panel grid place-items-center py-16 text-center">
              <CircleCheck className="mb-3 h-8 w-8 text-emerald-400" />
              <p className="text-[14px] font-semibold text-white">Nothing here — you are clear</p>
              <p className="mt-1 text-[12.5px] text-slate-500">Switch to “All” to see graded and submitted work.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Reveal delay={60}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Target className="h-4 w-4 text-pink-300" /> Next deadline
              </h3>
              <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/[0.08] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-white">{assignments[0].title}</div>
                    <div className="mt-1 text-[11px] text-amber-200">
                      Due {fmtDate(assignments[0].due)} · {daysUntil(assignments[0].due)} day left
                    </div>
                  </div>
                  <Chip tone="amber" className="shrink-0">
                    {assignments[0].weight}%
                  </Chip>
                </div>
                <div className="mt-3">
                  <ProgressBar value={assignments[0].progress} height={6} from="#F59E0B" to="#EC4899" />
                  <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>{assignments[0].progress}% complete</span>
                    <span>est. 3h 20m left</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {(CHECKLIST[assignments[0].id] ?? []).map((c) => {
                    const on = (done[assignments[0].id] ?? []).includes(c);
                    return (
                      <button key={c} onClick={() => toggle(assignments[0].id, c)} className="flex w-full items-start gap-2.5 text-left">
                        <span className={cn('mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border', on ? 'border-emerald-400/60 bg-emerald-500/25 text-emerald-300' : 'border-white/20')}>
                          {on && <Check className="h-2.5 w-2.5" />}
                        </span>
                        <span className={cn('text-[11.5px] leading-snug', on ? 'text-slate-500 line-through' : 'text-slate-300')}>{c}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-sm btn-primary flex-1">
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </button>
                  <Link href="/tutor" className="btn btn-sm btn-ghost">
                    <Sparkles className="h-3.5 w-3.5" /> Help
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Gauge className="h-4 w-4 text-cyan-300" /> Submission health
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <Donut
                  size={128}
                  thickness={16}
                  data={[
                    { label: 'Graded', value: graded.length, tone: '#10B981' },
                    { label: 'In progress', value: openList.filter((a) => a.status === 'in-progress').length, tone: '#22D3EE' },
                    { label: 'At risk', value: openList.filter((a) => a.status !== 'in-progress').length, tone: '#EC4899' },
                  ]}
                  center={
                    <span>
                      <span className="block font-display text-xl font-extrabold text-white">{Math.round((graded.length / assignments.length) * 100)}%</span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">submitted</span>
                    </span>
                  }
                />
                <div className="space-y-2 text-[11.5px]">
                  {[
                    { l: 'Graded', n: graded.length, c: '#10B981' },
                    { l: 'In progress', n: openList.filter((a) => a.status === 'in-progress').length, c: '#22D3EE' },
                    { l: 'At risk', n: openList.filter((a) => a.status !== 'in-progress').length, c: '#EC4899' },
                  ].map((x) => (
                    <div key={x.l} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-bold text-white">{x.n}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4">
                {[
                  { l: 'On-time submission rate', v: 94 },
                  { l: 'Avg. score vs cohort', v: 81 },
                  { l: 'Rewrites after feedback', v: 62 },
                ].map((x) => (
                  <div key={x.l}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-bold text-white">{x.v}%</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={x.v} height={5} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <CalendarDays className="h-4 w-4 text-violet-300" /> This week
              </h3>
              <div className="mt-4 space-y-2">
                {assignments
                  .filter((a) => daysUntil(a.due) >= -3 && daysUntil(a.due) <= 12)
                  .slice(0, 5)
                  .map((a) => {
                    const s = subjects.find((x) => x.id === a.subjectId)!;
                    return (
                      <div key={a.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                        <span className={cn('h-8 w-1 shrink-0 rounded-full bg-gradient-to-b', TONE_BAR[s.tone])} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[11.5px] font-semibold text-slate-200">{a.title}</div>
                          <div className="text-[10px] text-slate-500">
                            {fmtDate(a.due)} · {s.short} · {a.weight}%
                          </div>
                        </div>
                        <Chip tone="cyan" className="shrink-0">
                          {daysUntil(a.due)}d
                        </Chip>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
              <div className="rounded-3xl bg-ink-900/85 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  <h3 className="font-display text-[14px] font-bold text-white">AI sequencing</h3>
                </div>
                <p className="mt-2.5 text-[12px] leading-relaxed text-slate-400">
                  Do the CN lab first — it is overdue and worth 15%. The RB-tree report is due sooner but only 10%, and you are already 65%
                  through, so it survives a two-hour slip.
                </p>
                <Link href="/planner" className="btn btn-sm btn-primary mt-3.5 w-full">
                  Apply to my week
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function AssignmentCard({
  a,
  open,
  onToggle,
  done,
  onCheck,
}: {
  a: Assignment;
  open: boolean;
  onToggle: () => void;
  done: string[];
  onCheck: (item: string) => void;
}) {
  const s = subjects.find((x) => x.id === a.subjectId)!;
  const meta = assignmentStatusMeta[a.status];
  const d = daysUntil(a.due);
  const items = CHECKLIST[a.id] ?? ['Read the brief', 'Plan the approach', 'Draft', 'Review against rubric', 'Submit'];
  const [c1, c2] = toneHex(s.tone);

  return (
    <div className={cn('overflow-hidden rounded-2xl border transition-all duration-500', open ? 'border-violet-400/35 bg-gradient-to-br from-violet-600/[0.09] to-cyan-500/[0.03]' : 'border-white/[0.08] bg-white/[0.028] hover:border-white/20')}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-4 text-left sm:p-5">
        <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-[10.5px] font-extrabold text-white', toneGrad(s.tone))}>
          {s.short}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-white">{a.title}</span>
            <span className={cn('chip shrink-0', meta.chip)}>{meta.label}</span>
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span>
              {s.code} · {a.type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'due today' : `due in ${d}d`}
            </span>
            <span>weight {a.weight}%</span>
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" /> {a.attachments} files
            </span>
          </span>
          <span className="mt-3 block">
            <ProgressBar value={a.progress} height={5} from={a.status === 'overdue' ? '#EC4899' : c1} to={a.status === 'overdue' ? '#F59E0B' : c2} />
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2">
          {a.score !== undefined ? (
            <span className="font-display text-lg font-extrabold text-emerald-300">{a.score}</span>
          ) : (
            <span className="font-display text-lg font-extrabold text-white">{a.progress}%</span>
          )}
          <ChevronDown className={cn('h-4 w-4 text-slate-500 transition-transform duration-500', open && 'rotate-180')} />
        </span>
      </button>

      <div className="grid transition-all duration-500 ease-spring" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="border-t border-white/[0.07] p-4 sm:p-5">
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Brief</div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">{a.brief}</p>

                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Steps</div>
                <div className="mt-2.5 space-y-2">
                  {items.map((it) => {
                    const on = done.includes(it);
                    return (
                      <button key={it} onClick={() => onCheck(it)} className="flex w-full items-start gap-2.5 text-left">
                        <span className={cn('mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition', on ? 'border-emerald-400/60 bg-emerald-500/25 text-emerald-300' : 'border-white/20')}>
                          {on && <Check className="h-2.5 w-2.5" />}
                        </span>
                        <span className={cn('text-[12px] leading-snug', on ? 'text-slate-500 line-through' : 'text-slate-300')}>{it}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Submission</div>
                  <div className="mt-2.5 space-y-2 text-[11.5px]">
                    {[
                      { l: 'Deadline', v: fmtDate(a.due, { day: 'numeric', month: 'short', year: 'numeric' }) },
                      { l: 'Weight', v: `${a.weight}% of course` },
                      { l: 'Max marks', v: `${a.max}` },
                      { l: 'Attempt', v: a.score !== undefined ? 'graded' : 'not submitted' },
                    ].map((x) => (
                      <div key={x.l} className="flex items-center justify-between">
                        <span className="text-slate-400">{x.l}</span>
                        <span className="font-semibold text-white">{x.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-sm btn-primary">
                    <Upload className="h-3.5 w-3.5" /> Submit files
                  </button>
                  <button className="btn btn-sm btn-ghost">
                    <FileText className="h-3.5 w-3.5" /> Brief
                  </button>
                  <Link href="/tutor" className="btn btn-sm btn-ghost">
                    <Sparkles className="h-3.5 w-3.5" /> Ask AI
                  </Link>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
                  <ProgressRing value={a.score ?? a.progress} size={46} stroke={5} from={c1} to={c2} label={<span className="text-[10px]">{a.score ?? a.progress}</span>} />
                  <div className="text-[11px] text-slate-400">
                    {a.score !== undefined ? (
                      <>
                        <div className="font-semibold text-emerald-300">
                          Graded {a.score}/{a.max}
                        </div>
                        <div>Top 22% of the class</div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-slate-200">{a.progress}% ready</div>
                        <div>Rubric risk: {a.progress < 40 ? 'high' : a.progress < 70 ? 'medium' : 'low'}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
