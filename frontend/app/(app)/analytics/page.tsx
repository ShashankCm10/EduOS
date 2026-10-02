'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  Clock,
  Brain,
  Zap,
  Trophy,
  Download,
  Gauge,
  Flame,
  CircleCheck,
  TriangleAlert,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing, StatTile } from '@/components/ui/core';
import { AreaChart, GroupBars, Heatmap, RadarChart, StackedBar } from '@/components/ui/charts';
import { cn, toneBar, toneHex } from '@/lib/utils';
import { student, studyTrend, accuracyTrend, mastery, heatmap, focusSplit, subjects, examCountdown } from '@/lib/data';

type Range = '7d' | '30d' | 'term';

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>('30d');

  const slice = range === '7d' ? studyTrend.slice(-7) : range === '30d' ? studyTrend : studyTrend;
  const avgHours = (slice.reduce((s, d) => s + d.hours, 0) / slice.length).toFixed(1);
  const avgFocus = Math.round(slice.reduce((s, d) => s + d.focus, 0) / slice.length);

  const gpaTrend = [
    { label: 'Sem 1', a: 7.8, b: 7.2 },
    { label: 'Sem 2', a: 8.1, b: 7.3 },
    { label: 'Sem 3', a: 8.3, b: 7.4 },
    { label: 'Sem 4', a: 8.5, b: 7.4 },
    { label: 'Sem 5', a: 8.74, b: 7.5 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <LineChart className="h-3.5 w-3.5" /> Semester {student.semester} · updated 12 minutes ago
          </>
        }
        title={
          <>
            Progress & <span className="grad-text">Performance</span>
          </>
        }
        sub="Not vanity charts — the signals that change decisions. Where your time goes, which topics are actually weak, and what your current trajectory projects."
        actions={
          <>
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {(['7d', '30d', 'term'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-[12px] font-semibold uppercase transition-all duration-300',
                    range === r ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="btn btn-md btn-ghost">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal>
          <StatTile label="Avg. study per day" value={avgHours} suffix="h" delta={18} tone="violet" spark={slice.map((s) => s.hours)} icon={<Clock className="h-4 w-4" />} />
        </Reveal>
        <Reveal delay={60}>
          <StatTile label="Focus index" value={avgFocus} suffix="/100" delta={9} tone="cyan" spark={slice.map((s) => s.focus)} icon={<Gauge className="h-4 w-4" />} />
        </Reveal>
        <Reveal delay={120}>
          <StatTile label="Quiz accuracy" value={87} suffix="%" delta={13} tone="emerald" spark={accuracyTrend.map((a) => a.you)} icon={<Target className="h-4 w-4" />} />
        </Reveal>
        <Reveal delay={180}>
          <StatTile label="Cohort rank" value={`#${student.rank}`} suffix={`/ ${student.cohortSize}`} delta={4} tone="amber" spark={[12, 11, 10, 9, 9, 8, 7]} icon={<Trophy className="h-4 w-4" />} />
        </Reveal>
      </div>

      {/* study trend + focus split */}
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Reveal>
          <div className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">Study hours & focus quality</h3>
                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 14 days' : 'Full semester rolling window'}
                </p>
              </div>
              <div className="flex gap-2">
                <Chip tone="cyan">avg {avgHours}h/day</Chip>
                <Chip tone="emerald">
                  <TrendingUp className="h-3 w-3" /> +18%
                </Chip>
              </div>
            </div>
            <div className="mt-3">
              <AreaChart
                data={slice}
                height={280}
                unit="h"
                series={[{ key: 'hours', name: 'Study hours', from: '#7C3AED', to: '#22D3EE' }]}
                compare="focus"
                compareName="Focus index"
                compareColor="#F59E0B"
              />
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-4">
              {[
                { l: 'Best day', v: '6.1h · 29 Sep' },
                { l: 'Weakest day', v: '1.8h · 23 Sep' },
                { l: 'Deep work share', v: '42%' },
                { l: 'Session length', v: '58 min avg' },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[12px] font-semibold text-white">{x.v}</div>
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="panel flex h-full flex-col p-5">
            <h3 className="font-display text-[15px] font-bold text-white">Where the hours go</h3>
            <p className="mt-0.5 text-[11.5px] text-slate-500">Time composition across activity types</p>
            <div className="mt-5 grid place-items-center">
              <StackedBar data={focusSplit} height={14} />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-300">Subject time share</span>
                <span className="text-[10.5px] text-slate-500">this month</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {subjects.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={cn('h-2 w-2 shrink-0 rounded-full bg-gradient-to-br', toneBar(s.tone))} />
                    <span className="w-12 shrink-0 text-[11px] text-slate-400">{s.short}</span>
                    <span className="flex-1">
                      <ProgressBar value={s.progress} height={5} from={toneHex(s.tone)[0]} to={toneHex(s.tone)[1]} />
                    </span>
                    <span className="w-12 shrink-0 text-right text-[11px] font-semibold text-slate-300">
                      {(3 + s.credits * 1.4).toFixed(1)}h
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-start gap-2.5 rounded-2xl border border-amber-400/25 bg-amber-500/[0.08] p-3.5">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-[11.5px] leading-relaxed text-amber-100">
                  CN gets <span className="font-bold">2.6h/week</span> but carries 20% of your term grade. Shifting one hour from DM
                  (already at 88%) would balance the risk.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* accuracy + radar */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">Accuracy vs cohort</h3>
                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  You crossed the cohort average in June and have not looked back
                </p>
              </div>
              <Chip tone="emerald">
                <TrendingUp className="h-3 w-3" /> +29 pts since March
              </Chip>
            </div>
            <div className="mt-3">
              <AreaChart
                height={250}
                unit="%"
                data={accuracyTrend}
                series={[{ key: 'you', name: 'Your accuracy', from: '#10B981', to: '#22D3EE' }]}
                compare="cohort"
                compareName="Cohort average"
                compareColor="#94A3B8"
              />
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-3">
              {[
                { l: 'Biggest jump', v: 'Jun → Jul (+5)', tone: 'text-emerald-300' },
                { l: 'Current gap vs cohort', v: '+16 pts', tone: 'text-cyan-300' },
                { l: 'Projected Oct', v: '89%', tone: 'text-violet-300' },
              ].map((x) => (
                <div key={x.l}>
                  <div className={cn('font-display text-[15px] font-bold', x.tone)}>{x.v}</div>
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="panel h-full p-5">
            <h3 className="font-display text-[15px] font-bold text-white">Skill shape</h3>
            <p className="mt-0.5 text-[11.5px] text-slate-500">Six dimensions, benchmarked against your cohort</p>
            <div className="mt-3 grid place-items-center">
              <RadarChart axes={mastery} size={320} />
            </div>
            <div className="mt-3 space-y-2 border-t border-white/[0.07] pt-4">
              {[
                { l: 'Strongest', v: 'Problem solving · 88', tone: 'text-emerald-300' },
                { l: 'Weakest', v: 'Depth · 68', tone: 'text-pink-300' },
                { l: 'Fastest improving', v: 'Accuracy · +9', tone: 'text-cyan-300' },
              ].map((x) => (
                <div key={x.l} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-slate-400">{x.l}</span>
                  <span className={cn('font-semibold', x.tone)}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* heatmap + grade table */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">Consistency map</h3>
                <p className="mt-0.5 text-[11.5px] text-slate-500">12 weeks of study intensity</p>
              </div>
              <Chip tone="violet">
                <Flame className="h-3 w-3" /> 26-day streak
              </Chip>
            </div>
            <div className="mt-5">
              <Heatmap matrix={heatmap} />
            </div>
            <div className="mt-5 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-4">
              {[
                { l: 'Active days', v: '72 of 84' },
                { l: 'Longest streak', v: '41 days' },
                { l: 'Rest days taken', v: '6' },
                { l: 'Collapse pattern', v: 'Wed evenings' },
              ].map((x) => (
                <div key={x.l}>
                  <div className="text-[12px] font-semibold text-white">{x.v}</div>
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <GraduationCap className="h-4 w-4 text-violet-300" /> Grade trajectory
              </h3>
              <Chip tone="emerald">CGPA {student.cgpa}</Chip>
            </div>
            <div className="mt-4">
              <GroupBars
                height={170}
                unit=""
                aName="Your GPA"
                bName="Cohort avg"
                data={gpaTrend}
                from="#7C3AED"
                to="#22D3EE"
              />
            </div>

            <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Course forecast</div>
              {subjects.map((s) => {
                const risk = s.score < 75;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={cn('w-11 shrink-0 rounded-md bg-gradient-to-r px-1.5 py-0.5 text-center text-[10px] font-bold text-white', toneBar(s.tone))}>
                      {s.grade}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11.5px] text-slate-300">{s.title}</span>
                    <span className="shrink-0 text-[11px] text-slate-500">{s.credits} cr</span>
                    <span className={cn('shrink-0 text-[11px] font-bold', risk ? 'text-pink-300' : 'text-emerald-300')}>
                      {risk ? 'at risk' : 'safe'}
                    </span>
                    <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-slate-400">{s.score}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
              <ProgressRing value={68} size={54} stroke={6} from="#F59E0B" to="#EC4899" label={<span className="text-[10px]">68</span>} />
              <div className="text-[11.5px] leading-relaxed text-slate-400">
                <span className="font-semibold text-white">Two courses at risk.</span> CN needs +11 points and ML +6 to hold your
                projected 8.91 CGPA.
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* insights */}
      <Reveal>
        <div className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
              <Sparkles className="h-4 w-4 text-violet-300" /> What changed since last month
            </h3>
            <Link href="/tutor" className="btn btn-sm btn-ghost">
              Ask the tutor to explain <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              {
                l: 'Improved',
                tone: 'border-emerald-400/25 bg-emerald-500/[0.08]',
                head: 'text-emerald-300',
                i: TrendingUp,
                items: ['Accuracy +13 pts', 'Study consistency +9%', 'DP mastery 74 → 88', 'Rank 12 → 7'],
              },
              {
                l: 'Declined',
                tone: 'border-pink-400/25 bg-pink-500/[0.08]',
                head: 'text-pink-300',
                i: TrendingDown,
                items: ['Deep work per session −7 min', 'Wed evening slots missed ×3', 'CN accuracy −6 pts'],
              },
              {
                l: 'Watch list',
                tone: 'border-amber-400/25 bg-amber-500/[0.08]',
                head: 'text-amber-300',
                i: Brain,
                items: ['Negative-cycle proofs', 'Attend 5 more CN classes', 'ML project still unstarted'],
              },
            ].map((x) => (
              <div key={x.l} className={cn('rounded-2xl border p-4', x.tone)}>
                <div className={cn('flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider', x.head)}>
                  <x.i className="h-3.5 w-3.5" /> {x.l}
                </div>
                <div className="mt-3 space-y-2">
                  {x.items.map((it) => (
                    <div key={it} className="flex items-center gap-2 text-[12px] text-slate-200">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* goals + exam readiness */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
              <Target className="h-4 w-4 text-cyan-300" /> Term goals
            </h3>
            <div className="mt-4 space-y-4">
              {[
                { t: 'Lift CGPA above 8.9', v: 82, d: 'projected 8.91 with current plan', tone: '#10B981' },
                { t: 'Finish CN syllabus by 20 Oct', v: 48, d: '4 of 7 modules complete', tone: '#EC4899' },
                { t: '100 hours of deep work', v: 66, d: '66h logged this semester', tone: '#7C3AED' },
                { t: 'Zero missed deadlines', v: 91, d: '1 slip in 11 submissions', tone: '#F59E0B' },
              ].map((g) => (
                <div key={g.t}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-slate-200">{g.t}</span>
                    <span className="font-bold text-white">{g.v}%</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={g.v} height={6} from={g.tone} to="#22D3EE" />
                  </div>
                  <div className="mt-1 text-[10.5px] text-slate-500">{g.d}</div>
                </div>
              ))}
            </div>
            <Link href="/profile#goals" className="btn btn-sm btn-ghost mt-4 w-full">
              Edit goals
            </Link>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Zap className="h-4 w-4 text-amber-400" /> Exam readiness model
              </h3>
              <Chip tone="violet">6 exams · 34–48 days out</Chip>
            </div>
            <p className="mt-1.5 text-[11.5px] text-slate-500">
              Weighted by syllabus coverage, quiz accuracy, attendance, revision recency and past-paper performance.
            </p>

            <div className="mt-5 space-y-3.5">
              {examCountdown.map((e) => (
                <div key={e.code}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-slate-300">
                      <span className="font-mono text-[10.5px] text-slate-500">{e.code}</span> · {e.subject}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-slate-500">{e.days}d</span>
                      <span
                        className={cn(
                          'font-bold',
                          e.readiness > 70 ? 'text-emerald-300' : e.readiness > 50 ? 'text-cyan-300' : 'text-pink-300'
                        )}
                      >
                        {e.readiness}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={e.readiness}
                      height={7}
                      from={e.readiness > 70 ? '#10B981' : e.readiness > 50 ? '#7C3AED' : '#EC4899'}
                      to={e.readiness > 70 ? '#84CC16' : e.readiness > 50 ? '#22D3EE' : '#F59E0B'}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-3">
              {[
                { l: 'Overall readiness', v: '66%', tone: 'text-cyan-300' },
                { l: 'Ready exams (70%+)', v: '2 of 6', tone: 'text-emerald-300' },
                { l: 'Needs attention', v: 'CN, ML', tone: 'text-pink-300' },
              ].map((x) => (
                <div key={x.l} className="flex items-center gap-2.5">
                  <CircleCheck className={cn('h-4 w-4 shrink-0', x.tone)} />
                  <div>
                    <div className={cn('font-display text-[15px] font-bold', x.tone)}>{x.v}</div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
