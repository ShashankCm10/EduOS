import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Timer,
  Zap,
  TrendingUp,
  Sparkles,
  Target,
  Download,
  Share2,
  RefreshCw,
  Check,
  X,
  SkipForward,
  CircleAlert,
  Brain,
  ChevronRight,
  ListChecks,
  Gauge,
} from 'lucide-react';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { AreaChart, Donut, GroupBars } from '@/components/ui/charts';
import { cn } from '@/lib/utils';
import { lastQuizResult, leaderboard } from '@/lib/data';

export const metadata = { title: 'Quiz Result' };

export default function QuizResultPage() {
  const r = lastQuizResult;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/quizzes" className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
        </Link>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-sm btn-ghost">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button className="btn btn-sm btn-ghost">
            <Download className="h-3.5 w-3.5" /> Download report
          </button>
          <button className="btn btn-sm btn-primary">
            <RefreshCw className="h-3.5 w-3.5" /> Retake
          </button>
        </div>
      </div>

      {/* ---------------- score hero ---------------- */}
      <Reveal>
        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -left-20 bottom-[-30%] h-64 w-64 rounded-full bg-violet-600/25 blur-[90px]" />

          <div className="relative flex flex-wrap items-center gap-8">
            <ProgressRing value={r.score} size={148} stroke={12} from="#10B981" to="#22D3EE" label={<span className="text-3xl">{r.score}%</span>} sub="score" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="violet">{r.subject}</Chip>
                <Chip tone="emerald">
                  <Trophy className="h-3 w-3" /> Top {100 - r.percentile}% of cohort
                </Chip>
                <Chip tone="amber">
                  <TrendingUp className="h-3 w-3" /> +{r.rankDelta} rank
                </Chip>
              </div>
              <h1 className="display-xl mt-3.5 text-[clamp(1.6rem,3.4vw,2.4rem)] text-white">{r.title}</h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-400">
                Your best run yet — 92% with a 96th percentile finish. One topic ({'\u201c'}Bellman-Ford{'\u201d'}) is doing almost all the damage,
                and the tutor has already queued a drill for it.
              </p>

              <div className="mt-5 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { l: 'Correct', v: r.correct, tone: 'text-emerald-300' },
                  { l: 'Wrong', v: r.wrong, tone: 'text-pink-300' },
                  { l: 'Skipped', v: r.skipped, tone: 'text-amber-300' },
                  { l: 'XP earned', v: `+${r.xpEarned}`, tone: 'text-cyan-300' },
                ].map((x) => (
                  <div key={x.l}>
                    <div className={cn('font-display text-xl font-extrabold', x.tone)}>{x.v}</div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {[
                { l: 'Your score', v: `${r.score}%`, s: 'personal best' },
                { l: 'Cohort average', v: `${r.cohortAvg}%`, s: '+21 above' },
                { l: 'Time taken', v: r.duration, s: `avg ${r.avgTimePerQ}s / question` },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                  <div className="font-display text-lg font-extrabold text-white">{x.v}</div>
                  <div className="text-[10.5px] text-slate-500">{x.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------------- breakdown ---------------- */}
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Target className="h-4 w-4 text-cyan-300" /> Accuracy by topic
              </h3>
              <Chip tone="cyan">5 topics tested</Chip>
            </div>

            <div className="mt-5 space-y-4">
              {r.topics.map((t) => (
                <div key={t.name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-slate-200">{t.name}</span>
                    <span className="flex items-center gap-2.5">
                      <span className="text-[10.5px] text-slate-500">{t.questions} questions</span>
                      <span className={cn('font-bold', t.accuracy >= 90 ? 'text-emerald-300' : t.accuracy >= 75 ? 'text-cyan-300' : 'text-pink-300')}>
                        {t.accuracy}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar
                      value={t.accuracy}
                      height={7}
                      from={t.accuracy >= 90 ? '#10B981' : t.accuracy >= 75 ? '#22D3EE' : '#EC4899'}
                      to={t.accuracy >= 90 ? '#84CC16' : t.accuracy >= 75 ? '#7C3AED' : '#F59E0B'}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <h4 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                <Timer className="h-3.5 w-3.5" /> Answer rhythm
              </h4>
              <p className="mt-1 text-[11.5px] text-slate-500">Seconds per question — the spike is where you hesitated</p>
              <div className="mt-3">
                <AreaChart
                  height={180}
                  unit="s"
                  data={r.timeline.map((t) => ({ label: t.q, time: t.time }))}
                  series={[{ key: 'time', name: 'Seconds', from: '#7C3AED', to: '#22D3EE' }]}
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={70}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Gauge className="h-4 w-4 text-violet-300" /> Attempt composition
              </h3>
              <div className="mt-4 flex items-center gap-6">
                <Donut
                  size={160}
                  thickness={20}
                  data={[
                    { label: 'Correct', value: r.correct, tone: '#10B981' },
                    { label: 'Wrong', value: r.wrong, tone: '#EC4899' },
                    { label: 'Skipped', value: r.skipped, tone: '#F59E0B' },
                  ]}
                  center={
                    <span>
                      <span className="block font-display text-2xl font-extrabold text-white">{r.percentile}</span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">percentile</span>
                    </span>
                  }
                />
                <div className="space-y-3 text-[12px]">
                  {[
                    { l: 'Correct', v: r.correct, i: Check, c: 'text-emerald-400' },
                    { l: 'Incorrect', v: r.wrong, i: X, c: 'text-pink-400' },
                    { l: 'Skipped', v: r.skipped, i: SkipForward, c: 'text-amber-400' },
                  ].map((x) => (
                    <div key={x.l} className="flex items-center gap-2.5">
                      <x.i className={cn('h-3.5 w-3.5', x.c)} />
                      <span className="text-slate-400">{x.l}</span>
                      <span className="font-bold text-white">{x.v}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/[0.07] pt-3 text-slate-400">
                    Accuracy on attempted:{' '}
                    <span className="font-bold text-white">
                      {Math.round((r.correct / (r.correct + r.wrong)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="panel p-5">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <TrendingUp className="h-4 w-4 text-emerald-300" /> You vs cohort
              </h3>
              <div className="mt-4">
                <GroupBars
                  height={180}
                  unit="%"
                  aName="You"
                  bName="Cohort avg"
                  data={r.topics.map((t) => ({ label: t.name.split(' ')[0], a: t.accuracy, b: Math.max(38, t.accuracy - 22) }))}
                />
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-3.5">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                  <Trophy className="h-3.5 w-3.5" /> Position
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-200">
                  You are <span className="font-semibold text-white">#{leaderboard.find((u) => u.you)?.rank}</span> of 240 on this topic set, and
                  4th among students who attempted it this week.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------------- AI post-mortem ---------------- */}
      <Reveal>
        <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
          <div className="rounded-3xl bg-ink-900/85 p-6 backdrop-blur-xl sm:p-7">
            <div className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="absolute inset-0 rounded-2xl bg-violet-500/40 animate-pulse-ring" />
              </span>
              <div>
                <h3 className="font-display text-[16px] font-bold text-white">AI post-mortem</h3>
                <p className="text-[11.5px] text-slate-500">Derived from this attempt, your last 3 quizzes and 84 pages of notes</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                {
                  t: 'Root cause',
                  i: Brain,
                  tone: 'border-pink-400/25 bg-pink-500/[0.08]',
                  head: 'text-pink-300',
                  body: 'You lost the Bellman-Ford question because you stopped after |V|−1 rounds. This is the same error as 28 Sep — a pattern, not a slip.',
                },
                {
                  t: 'What worked',
                  i: Check,
                  tone: 'border-emerald-400/25 bg-emerald-500/[0.08]',
                  head: 'text-emerald-300',
                  body: 'MST questions were perfect in 40s each. Your greedy intuition is now faster than your recursive reasoning — use it as a bridge for DP-graph hybrids.',
                },
                {
                  t: 'Do this next',
                  i: Target,
                  tone: 'border-cyan-400/25 bg-cyan-500/[0.08]',
                  head: 'text-cyan-300',
                  body: 'A 12-minute negative-cycle drill, then two past-paper questions on 4.7. That should close the topic before Friday.',
                },
              ].map((x) => (
                <div key={x.t} className={cn('rounded-2xl border p-4', x.tone)}>
                  <div className={cn('flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider', x.head)}>
                    <x.i className="h-3.5 w-3.5" /> {x.t}
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-slate-200">{x.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/tutor" className="btn btn-md btn-primary shine">
                <Sparkles className="h-4 w-4" /> Start the 12-minute drill
              </Link>
              <Link href="/materials" className="btn btn-md btn-ghost">
                Re-read Unit 4.7 · p.31
              </Link>
              <Link href="/planner" className="btn btn-md btn-ghost">
                Add to study plan
              </Link>
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/[0.07] pt-5 sm:grid-cols-3">
              {[
                { l: 'Readiness impact', v: '+3.4%', s: 'DSA exam readiness now 74%' },
                { l: 'Mastery delta', v: '+7 pts', s: 'problem solving 88 (+7)' },
                { l: 'Recommended retake', v: 'In 6 days', s: 'after the drill + 2 paper questions' },
              ].map((x) => (
                <div key={x.l} className="flex items-center gap-3">
                  <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-display text-[15px] font-bold text-white">{x.v}</div>
                    <div className="text-[10.5px] text-slate-500">
                      {x.l} · {x.s}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------------- question log ---------------- */}
      <Reveal>
        <div className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
              <ListChecks className="h-4 w-4 text-violet-300" /> Question log
            </h3>
            <div className="flex gap-2">
              <Chip tone="emerald">18 correct</Chip>
              <Chip tone="pink">1 wrong</Chip>
              <Chip tone="amber">1 skipped</Chip>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {r.timeline.map((t, i) => {
              const wrong = t.correct === 0;
              const skipped = i === 11;
              return (
                <div
                  key={t.q}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3.5 py-2.5',
                    skipped ? 'border-amber-400/25 bg-amber-500/[0.07]' : wrong ? 'border-pink-400/25 bg-pink-500/[0.07]' : 'border-white/[0.07] bg-white/[0.028]'
                  )}
                >
                  <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold', skipped ? 'bg-amber-500/20 text-amber-300' : wrong ? 'bg-pink-500/20 text-pink-300' : 'bg-emerald-500/20 text-emerald-300')}>
                    {t.q}
                  </span>
                  <span className="min-w-0 flex-1 text-[11.5px] text-slate-300">
                    {skipped ? 'Skipped — ran out of time' : wrong ? 'Negative-cycle detection' : 'Correct in ' + t.time + 's'}
                  </span>
                  <span className="shrink-0 font-mono text-[10.5px] text-slate-500">{t.time}s</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <p className="text-[12px] leading-relaxed text-slate-400">
              You spent <span className="font-semibold text-white">96 seconds</span> on Q4 and still answered incorrectly — the longest think
              time of the attempt. In the exam, flag it and move on at the 60-second mark; the marks-per-minute maths never favours staying.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <Link href="/quizzes" className="btn btn-md btn-ghost">
                Similar quizzes
              </Link>
              <Link href="/analytics" className="btn btn-md btn-ghost">
                Full performance analytics
              </Link>
            </div>
            <button className="btn btn-md btn-primary">
              Start recommended drill <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
