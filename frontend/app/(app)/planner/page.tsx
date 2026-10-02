'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Zap,
  Target,
  Coffee,
  ListTodo,
  RefreshCw,
  Brain,
  TrendingUp,
  CircleCheck,
  Wand2,
  Layers,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import TaskList from '@/components/app/TaskList';
import FocusTimer from '@/components/app/FocusTimer';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { StackedBar } from '@/components/ui/charts';
import { cn, toneGrad, toneHex, toneBar } from '@/lib/utils';
import { timetable, subjects, examCountdown, student } from '@/lib/data';

const START = 8;
const END = 20;
const ROWS = END - START;

const KIND: Record<string, string> = {
  Lecture: 'Solid block',
  Lab: 'Hands-on',
  Tutorial: 'Discussion',
  Focus: 'Self-study',
  Exam: 'Assessment',
};

function toHour(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

const TODAY_IDX = 2; // Wednesday — matches the demo "today"

export default function PlannerPage() {
  const [view, setView] = useState<'week' | 'agenda'>('week');
  const [selected, setSelected] = useState<{ day: string; t: string; title: string; room: string; kind: string; subjectId: string } | null>(
    null
  );

  const totalHours = timetable.flatMap((d) => d.slots).reduce((s, x) => s + (x.kind === 'Lab' ? 2 : 1), 0) + 8;
  const focusSlots = timetable.flatMap((d) => d.slots).filter((s) => s.kind === 'Focus').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <CalendarDays className="h-3.5 w-3.5" /> Week 6 · 29 Sep – 5 Oct · replanned 04:12 today
          </>
        }
        title={
          <>
            Study <span className="grad-text">Planner</span>
          </>
        }
        sub="Your timetable, your deadlines and your energy curve solved together. Miss a slot and the whole week re-solves around it — usually before you notice."
        actions={
          <>
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(['week', 'agenda'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-[12px] font-semibold capitalize transition-all duration-300',
                    view === v ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="btn btn-md btn-ghost">
              <RefreshCw className="h-4 w-4" /> Auto-replan
            </button>
            <button className="btn btn-md btn-primary shine">
              <Plus className="h-4 w-4" /> Add task
            </button>
          </>
        }
      />

      {/* stats */}
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { l: 'Scheduled this week', v: `${totalHours}h`, s: `${focusSlots} self-study blocks`, i: Clock, tone: 'from-violet-500 to-indigo-600' },
            { l: 'Plan adherence', v: '87%', s: '+9% vs last week', i: CircleCheck, tone: 'from-emerald-400 to-teal-600' },
            { l: 'Buffer remaining', v: '6.5h', s: 'unscheduled recovery time', i: Coffee, tone: 'from-cyan-400 to-sky-600' },
            { l: 'Next exam', v: `${examCountdown[0].days}d`, s: `${examCountdown[0].subject} · readiness ${examCountdown[0].readiness}%`, i: Target, tone: 'from-amber-400 to-orange-600' },
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

      {/* ---------------- week grid ---------------- */}
      {view === 'week' && (
        <Reveal>
          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] p-4">
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-display text-[14px] font-bold text-white">29 Sep – 5 Oct 2026</span>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </button>
              <Chip tone="violet" className="ml-2">
                Today is highlighted
              </Chip>

              <div className="ml-auto flex flex-wrap gap-1.5">
                {Object.entries(KIND).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                    <span className={cn('h-2 w-2 rounded-full', {
                      Lecture: 'bg-violet-500',
                      Lab: 'bg-cyan-400',
                      Tutorial: 'bg-emerald-400',
                      Focus: 'bg-amber-400',
                      Exam: 'bg-pink-500',
                    }[k])} />
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto thin-scroll">
              <div className="min-w-[900px] p-4">
                {/* day headers */}
                <div className="grid grid-cols-[56px_repeat(7,1fr)] gap-2">
                  <div />
                  {timetable.map((d, i) => (
                    <div
                      key={d.day}
                      className={cn(
                        'rounded-xl py-2 text-center transition',
                        i === TODAY_IDX ? 'bg-gradient-to-br from-violet-600/30 to-cyan-500/15 ring-1 ring-violet-400/40' : 'bg-white/[0.025]'
                      )}
                    >
                      <div className={cn('text-[11px] font-bold uppercase tracking-wider', i === TODAY_IDX ? 'text-cyan-200' : 'text-slate-400')}>{d.day}</div>
                      <div className={cn('text-[10px]', i === TODAY_IDX ? 'text-slate-300' : 'text-slate-600')}>
                        {29 + i <= 30 ? `${29 + i} Sep` : `${29 + i - 30} Oct`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* grid body */}
                <div className="mt-2 grid grid-cols-[56px_repeat(7,1fr)] gap-2">
                  {/* hour rail */}
                  <div className="relative">
                    {Array.from({ length: ROWS }).map((_, i) => (
                      <div key={i} className="h-[52px] pr-2 text-right">
                        <span className="font-mono text-[10px] text-slate-600">{String(START + i).padStart(2, '0')}:00</span>
                      </div>
                    ))}
                  </div>

                  {/* day columns */}
                  {timetable.map((d, di) => (
                    <div
                      key={d.day}
                      className={cn('relative rounded-xl', di === TODAY_IDX ? 'bg-violet-500/[0.05] ring-1 ring-violet-400/20' : 'bg-white/[0.015]')}
                                    style={{ height: ROWS * 52 }}
                    >
                      {/* hour lines */}
                      {Array.from({ length: ROWS }).map((_, i) => (
                        <div key={i} className="absolute inset-x-0 border-t border-white/[0.045]" style={{ top: i * 52 }} />
                      ))}

                      {/* blocks */}
                      {d.slots.map((slot) => {
                        const s = subjects.find((x) => x.id === slot.subjectId)!;
                        const [c1, c2] = toneHex(s.tone);
                        const top = (toHour(slot.t) - START) * 52;
                        const dur = slot.kind === 'Lab' ? 2 : 1;
                        const on = selected?.title === slot.title && selected?.day === d.day;
                        return (
                          <button
                            key={slot.title + slot.t}
                            onClick={() => setSelected({ ...slot, day: d.day })}
                            className={cn(
                              'absolute left-1 right-1 overflow-hidden rounded-xl border p-2 text-left transition-all duration-300 ease-spring hover:z-10 hover:scale-[1.03]',
                              on ? 'z-10 scale-[1.03] shadow-lift' : ''
                            )}
                            style={{
                              top,
                              height: dur * 52 - 6,
                              background: `linear-gradient(140deg, ${c1}${on ? '66' : '33'}, ${c2}22)`,
                              borderColor: on ? c2 : `${c1}55`,
                              boxShadow: on ? `0 16px 40px -14px ${c1}` : undefined,
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c2 }} />
                              <span className="font-mono text-[9.5px] text-white/70">{slot.t}</span>
                              {slot.kind === 'Exam' && <span className="rounded bg-pink-500/40 px-1 text-[8px] font-bold text-white">EXAM</span>}
                            </div>
                            <div className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight text-white">{slot.title}</div>
                            {dur > 1 && <div className="mt-1 text-[9.5px] text-white/60">{slot.room}</div>}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* now line */}
                <div className="pointer-events-none relative -mt-[calc(100%-0px)]" style={{ top: 0 }} />
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ---------------- agenda view ---------------- */}
      {view === 'agenda' && (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {timetable.map((d, di) => (
            <Reveal key={d.day} delay={di * 50}>
              <div className={cn('panel h-full p-4', di === TODAY_IDX && 'ring-1 ring-violet-400/30')}>
                <div className="flex items-center justify-between">
                  <h3 className={cn('font-display text-[14px] font-bold', di === TODAY_IDX ? 'grad-text' : 'text-white')}>
                    {d.day} · {29 + di <= 30 ? `${29 + di} Sep` : `${29 + di - 30} Oct`}
                  </h3>
                  <Chip tone={di === TODAY_IDX ? 'violet' : 'default'}>{d.slots.length} blocks</Chip>
                </div>
                <div className="mt-3.5 space-y-2">
                  {d.slots.map((slot) => {
                    const s = subjects.find((x) => x.id === slot.subjectId)!;
                    return (
                      <button
                        key={slot.title + slot.t}
                        onClick={() => setSelected({ ...slot, day: d.day })}
                        className="flex w-full items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                      >
                        <span className={cn('h-full min-h-[36px] w-1 shrink-0 rounded-full bg-gradient-to-b', toneBar(s.tone))} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-500">{slot.t}</span>
                            <span className="rounded-full border border-white/[0.08] px-1.5 py-0.5 text-[9px] text-slate-400">{slot.kind}</span>
                          </span>
                          <span className="mt-1 block truncate text-[12.5px] font-semibold text-slate-200">{slot.title}</span>
                          <span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                            <MapPin className="h-2.5 w-2.5" /> {slot.room}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* ---------------- lower row ---------------- */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Reveal>
          <TaskList />
        </Reveal>

        <Reveal delay={70}>
          <FocusTimer />
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={140}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Layers className="h-4 w-4 text-cyan-300" /> Workload balance
              </h3>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Deep work, revision and recovery across the week</p>
              <div className="mt-4">
                <StackedBar
                  height={12}
                  data={[
                    { label: 'Lectures', value: 18, tone: '#7C3AED' },
                    { label: 'Labs', value: 8, tone: '#22D3EE' },
                    { label: 'Self-study', value: 14, tone: '#10B981' },
                    { label: 'Revision', value: 6, tone: '#F59E0B' },
                  ]}
                />
              </div>
              <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4">
                {[
                  { l: 'Deep-work blocks ≥ 90 min', v: 7 },
                  { l: 'Subjects touched this week', v: 6 },
                  { l: 'Recovery days', v: 1 },
                ].map((x) => (
                  <div key={x.l} className="flex items-center justify-between text-[11.5px]">
                    <span className="text-slate-400">{x.l}</span>
                    <span className="font-bold text-white">{x.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={190}>
            <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
              <div className="rounded-3xl bg-ink-900/85 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-violet-300" />
                  <h3 className="font-display text-[14px] font-bold text-white">Tonight&apos;s auto-replan</h3>
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    { t: 'Move CN lab catch-up to 17:00', s: 'highest weight at risk', tone: 'text-pink-300' },
                    { t: 'Push ML reading to Sunday', s: 'lowest marginal gain', tone: 'text-amber-300' },
                    { t: 'Add 25-min Bellman-Ford drill at 19:30', s: 'fixes weakest topic', tone: 'text-cyan-300' },
                  ].map((x) => (
                    <div key={x.t} className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                      <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current', x.tone)} />
                      <span className="min-w-0">
                        <span className="block text-[12px] font-semibold text-slate-200">{x.t}</span>
                        <span className={cn('text-[10.5px]', x.tone)}>{x.s}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm btn-primary mt-3.5 w-full">
                  <Sparkles className="h-3.5 w-3.5" /> Accept all 3 changes
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------------- selected block + exams ---------------- */}
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Brain className="h-4 w-4 text-violet-300" /> Block detail
              </h3>
              {selected && <Chip tone="violet">{selected.day} · {selected.t}</Chip>}
            </div>

            {selected ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-start gap-4">
                  <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-[11px] font-extrabold text-white', toneGrad(subjects.find((s) => s.id === selected.subjectId)!.tone))}>
                    {subjects.find((s) => s.id === selected.subjectId)!.short}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-[16px] font-bold text-white">{selected.title}</h4>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-cyan-300" /> {selected.room}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-violet-300" /> {selected.t} · {selected.kind === 'Lab' ? '2 hours' : '1 hour'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-300" /> {KIND[selected.kind]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Prep checklist</div>
                    <div className="mt-3 space-y-2">
                      {['Read the assigned section beforehand', 'Bring formula sheet', 'Prepare 2 doubts to ask', 'Review last lecture notes'].map((x) => (
                        <label key={x} className="flex items-start gap-2.5">
                          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.06] accent-violet-500" />
                          <span className="text-[12px] leading-snug text-slate-300">{x}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Context</div>
                    <div className="mt-3 space-y-2.5 text-[11.5px]">
                      {[
                        { l: 'Course progress', v: `${subjects.find((s) => s.id === selected.subjectId)!.progress}%` },
                        { l: 'Your attendance', v: `${subjects.find((s) => s.id === selected.subjectId)!.attendance}%` },
                        { l: 'Last quiz score', v: `${subjects.find((s) => s.id === selected.subjectId)!.score}%` },
                        { l: 'Linked material', v: '3 documents' },
                      ].map((x) => (
                        <div key={x.l} className="flex items-center justify-between">
                          <span className="text-slate-400">{x.l}</span>
                          <span className="font-semibold text-white">{x.v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3.5">
                      <ProgressBar value={subjects.find((s) => s.id === selected.subjectId)!.progress} height={5} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/subjects/${selected.subjectId}`} className="btn btn-sm btn-ghost">
                    Open course
                  </Link>
                  <Link href="/materials" className="btn btn-sm btn-ghost">
                    Open material
                  </Link>
                  <Link href="/tutor" className="btn btn-sm btn-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Prep with AI
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-white/12 py-14 text-center">
                <ListTodo className="mb-3 h-7 w-7 text-slate-600" />
                <p className="text-[13px] font-semibold text-white">Pick any block in the week</p>
                <p className="mt-1 max-w-xs text-[11.5px] text-slate-500">
                  You will see the prep checklist, your course context and one-tap links to the matching notes.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Target className="h-4 w-4 text-pink-300" /> Exam runway
              </h3>
              <Chip tone="amber">Nov 2026</Chip>
            </div>
            <div className="mt-4 space-y-3.5">
              {examCountdown.map((e) => (
                <div key={e.code} className="flex items-center gap-4">
                  <ProgressRing
                    value={e.readiness}
                    size={54}
                    stroke={5}
                    from={e.readiness > 70 ? '#10B981' : e.readiness > 50 ? '#7C3AED' : '#EC4899'}
                    to={e.readiness > 70 ? '#84CC16' : e.readiness > 50 ? '#22D3EE' : '#F59E0B'}
                    label={<span className="text-[10px]">{e.readiness}</span>}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-slate-200">
                        {e.code} · {e.subject}
                      </span>
                      <span className="text-slate-500">{e.days} days</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        value={e.readiness}
                        height={5}
                        from={e.readiness > 70 ? '#10B981' : e.readiness > 50 ? '#7C3AED' : '#EC4899'}
                        to={e.readiness > 70 ? '#84CC16' : e.readiness > 50 ? '#22D3EE' : '#F59E0B'}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      {e.readiness > 70 ? 'On track — keep the weekly revision slot' : e.readiness > 50 ? 'Needs 2 more deep-work blocks' : 'At risk — prioritise this week'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-3.5">
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-[11.5px] leading-relaxed text-emerald-100">
                Following this plan as-is projects a <span className="font-bold">+0.17 CGPA</span> lift and keeps all six exams above 60%
                readiness.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
              <span className="text-[11.5px] text-slate-400">Weekly plan streak</span>
              <span className="flex items-center gap-2 text-[12px] font-bold text-white">
                <CircleCheck className="h-4 w-4 text-emerald-400" /> 4 weeks on plan
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
