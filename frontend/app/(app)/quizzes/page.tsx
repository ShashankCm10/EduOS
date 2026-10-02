'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ListChecks,
  Timer,
  Play,
  Sparkles,
  Filter,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  X,
  Check,
  ChevronRight,
  CircleAlert,
  RefreshCw,
  Gauge,
  Flame,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { GroupBars } from '@/components/ui/charts';
import { cn, toneGrad, toneHex } from '@/lib/utils';
import { quizzes, subjects, leaderboard, lastQuizResult, type Quiz } from '@/lib/data';

const QUESTIONS = [
  {
    q: 'A directed graph has one negative edge and no negative cycle. Which single-source algorithm is guaranteed correct in the best worst-case time?',
    o: ['Dijkstra with a Fibonacci heap', 'Bellman-Ford, then one extra relaxation pass', 'BFS twice, forward and reversed', 'Floyd–Warshall on the full matrix'],
    a: 1,
    why: 'Negative weights break Dijkstra’s greedy invariant. Bellman-Ford handles them in O(V·E), and the extra pass is only needed to prove no negative cycle.',
  },
  {
    q: 'After |V|−1 rounds of Bellman-Ford, one more edge can still be relaxed. What does that prove?',
    o: ['The graph is disconnected', 'The source is unreachable', 'A negative-weight cycle is reachable from the source', 'The edge weights overflowed'],
    a: 2,
    why: 'Relaxing beyond the |V|−1 edge bound is only possible if a cycle reduces total path weight.',
  },
  {
    q: 'Which traversal gives the fewest-edges path in an unweighted graph?',
    o: ['DFS with a stack', 'BFS with a FIFO queue', 'Topological sort', 'Prim’s algorithm'],
    a: 1,
    why: 'BFS explores in layers, so the first time a vertex is reached it is via the minimum number of edges.',
  },
];

export default function QuizzesPage() {
  const [difficulty, setDifficulty] = useState<'all' | Quiz['difficulty']>('all');
  const [subject, setSubject] = useState<'all' | string>('all');
  const [runner, setRunner] = useState<Quiz | null>(null);

  const list = useMemo(
    () =>
      quizzes.filter((q) => {
        if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
        if (subject !== 'all' && q.subjectId !== subject) return false;
        return true;
      }),
    [difficulty, subject]
  );

  const taken = quizzes.filter((q) => q.status === 'completed');
  const avg = Math.round(taken.reduce((s, q) => s + (q.best ?? 0), 0) / taken.length);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <ListChecks className="h-3.5 w-3.5" /> Adaptive engine · difficulty follows every answer
          </>
        }
        title={
          <>
            Quizzes & <span className="grad-text">Practice</span>
          </>
        }
        sub="Questions escalate with your accuracy, so you stop burning evenings on what you already know. Every attempt feeds your readiness score and the tutor's memory."
        actions={
          <>
            <button className="btn btn-md btn-ghost">
              <RefreshCw className="h-4 w-4" /> Rebuild question bank
            </button>
            <button className="btn btn-md btn-primary shine">
              <Sparkles className="h-4 w-4" /> Generate quiz from notes
            </button>
          </>
        }
      />

      {/* hero: continue */}
      <Reveal>
        <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
          <div className="relative flex flex-wrap items-center gap-6 rounded-3xl bg-ink-900/85 p-6 backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/25 blur-[80px]" />
            <ProgressRing value={62} size={104} stroke={9} from="#7C3AED" to="#22D3EE" label={<span className="text-lg">62%</span>} sub="answered" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="violet">In progress</Chip>
                <Chip tone="cyan">Adaptive</Chip>
                <Chip tone="amber">
                  <Flame className="h-3 w-3" /> 4-answer streak
                </Chip>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-white">Subnetting & routing protocols sprint</h2>
              <p className="mt-1.5 text-[12.5px] text-slate-400">
                Question 9 of 12 · currently at <span className="font-semibold text-white">Hard</span> difficulty · started 14 minutes ago
              </p>
              <div className="mt-4 max-w-md">
                <ProgressBar value={62} height={6} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button onClick={() => setRunner(quizzes[3])} className="btn btn-lg btn-primary shine">
                <Play className="h-4 w-4" /> Resume quiz
              </button>
              <span className="text-center text-[11px] text-slate-500">≈ 6 minutes left</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: 'Quizzes taken', v: taken.length, s: 'this semester', i: ListChecks, tone: 'from-violet-500 to-indigo-600' },
          { l: 'Average best score', v: `${avg}%`, s: '+16 vs last semester', i: TrendingUp, tone: 'from-emerald-400 to-teal-600' },
          { l: 'Questions answered', v: 246, s: '89% accuracy on medium', i: Target, tone: 'from-cyan-400 to-sky-600' },
          { l: 'XP from quizzes', v: '2,140', s: 'rank #7 of 240', i: Zap, tone: 'from-amber-400 to-orange-600' },
        ].map((x, i) => (
          <Reveal key={x.l} delay={i * 60}>
            <div className="panel flex items-center gap-4 p-4">
              <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white', x.tone)}>
                <x.i className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-xl font-extrabold text-white">{x.v}</div>
                <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                <div className="text-[10.5px] text-slate-500">{x.s}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* filters */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <Filter className="h-3.5 w-3.5" /> Subject
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill on={subject === 'all'} onClick={() => setSubject('all')}>
              All
            </FilterPill>
            {subjects.map((s) => (
              <FilterPill key={s.id} on={subject === s.id} onClick={() => setSubject(s.id)}>
                {s.short}
              </FilterPill>
            ))}
          </div>

          <span className="ml-4 hidden text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:block">Type</span>
          <div className="flex flex-wrap gap-2">
            {(['all', 'Adaptive', 'Core', 'Challenge', 'Rapid'] as const).map((d) => (
              <FilterPill key={d} on={difficulty === d} onClick={() => setDifficulty(d)}>
                {d === 'all' ? 'Any' : d}
              </FilterPill>
            ))}
          </div>
        </div>
      </Reveal>

      {/* quiz grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((q, i) => {
          const s = subjects.find((x) => x.id === q.subjectId)!;
          const [c1, c2] = toneHex(s.tone);
          const done = q.status === 'completed';
          return (
            <Reveal key={q.id} delay={i * 55}>
              <div className="panel card-hover group relative flex h-full flex-col overflow-hidden p-5">
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-20 blur-[70px]" style={{ background: `linear-gradient(135deg,${c1},${c2})` }} />

                <div className="flex items-start justify-between gap-3">
                  <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-[10.5px] font-extrabold text-white', toneGrad(s.tone))}>
                    {s.short}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <Chip tone={q.difficulty === 'Challenge' ? 'pink' : q.difficulty === 'Adaptive' ? 'violet' : q.difficulty === 'Rapid' ? 'amber' : 'cyan'}>{q.difficulty}</Chip>
                    {q.attempts > 0 && <span className="text-[10px] text-slate-500">{q.attempts} attempts</span>}
                  </div>
                </div>

                <h3 className="mt-4 text-[14px] font-semibold leading-snug text-white">{q.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ListChecks className="h-3 w-3" /> {q.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" /> {q.minutes} min
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {q.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-white/[0.07] pt-4">
                  {done ? (
                    <ProgressRing value={q.best ?? 0} size={54} stroke={6} from={c1} to={c2} label={<span className="text-[11px]">{q.best}</span>} />
                  ) : (
                    <span className="grid h-[54px] w-[54px] place-items-center rounded-full border border-dashed border-white/15 text-[10px] font-semibold text-slate-500">
                      NEW
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-500">
                      {done ? 'Best score · top 12% of cohort' : 'Not attempted yet · est. +180 XP'}
                    </div>
                    <div className="mt-1.5 flex gap-2">
                      {done ? (
                        <>
                          <Link href="/quizzes/result" className="btn btn-sm btn-ghost">
                            Review
                          </Link>
                          <button onClick={() => setRunner(q)} className="btn btn-sm btn-primary">
                            <Play className="h-3.5 w-3.5" /> Retake
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setRunner(q)} className="btn btn-sm btn-primary w-full">
                          <Play className="h-3.5 w-3.5" /> Start quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* bottom row */}
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Gauge className="h-4 w-4 text-cyan-300" /> Accuracy by subject
              </h3>
              <Chip tone="emerald">
                <TrendingUp className="h-3 w-3" /> +9% this month
              </Chip>
            </div>
            <div className="mt-5">
              <GroupBars
                height={200}
                unit="%"
                aName="Your accuracy"
                bName="Cohort avg"
                data={[
                  { label: 'DSA', a: 89, b: 71 },
                  { label: 'OS', a: 78, b: 66 },
                  { label: 'DBMS', a: 86, b: 69 },
                  { label: 'CN', a: 58, b: 64 },
                  { label: 'ML', a: 71, b: 67 },
                  { label: 'DM', a: 93, b: 72 },
                ]}
              />
            </div>
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-pink-400/25 bg-pink-500/[0.08] p-3.5">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink-300" />
              <p className="text-[12px] leading-relaxed text-slate-300">
                <span className="font-semibold text-white">CN is your only below-cohort subject</span> — 58% vs 64% average. Three targeted
                sprints would move it above the line and lift your term grade by roughly 0.2 points.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-white">
                <Trophy className="h-4 w-4 text-amber-400" /> Quiz ladder
              </h3>
              <Chip tone="amber">weekly</Chip>
            </div>
            <div className="mt-4 space-y-1.5">
              {leaderboard.slice(0, 6).map((u) => (
                <div key={u.rank} className={cn('flex items-center gap-3 rounded-xl px-3 py-2', u.you && 'border border-violet-400/35 bg-gradient-to-r from-violet-600/[0.25] to-cyan-500/[0.08]')}>
                  <span className={cn('w-5 text-center font-display text-[12px] font-extrabold', u.you ? 'text-cyan-300' : 'text-slate-500')}>{u.rank}</span>
                  <span className={cn('min-w-0 flex-1 truncate text-[12.5px]', u.you ? 'font-bold text-white' : 'text-slate-300')}>{u.name}</span>
                  <span className="shrink-0 text-[11px] font-semibold text-slate-400">{88 + (6 - u.rank)}%</span>
                </div>
              ))}
            </div>
            <Link href="/quizzes/result" className="btn btn-sm btn-ghost mt-4 w-full">
              See last result breakdown <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      {runner && <QuizRunner quiz={runner} onClose={() => setRunner(null)} />}
    </div>
  );
}

function FilterPill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all duration-300',
        on ? 'border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white'
      )}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- */
/* Modal quiz runner                                                 */
/* ---------------------------------------------------------------- */
function QuizRunner({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [secs, setSecs] = useState(quiz.minutes * 60);
  const [finished, setFinished] = useState(false);
  const subject = subjects.find((x) => x.id === quiz.subjectId)!;

  useEffect(() => {
    if (finished) return;
    const iv = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, [finished]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = QUESTIONS[i];
  const correctCount = answers.filter((a, k) => a === QUESTIONS[k].a).length;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  const next = () => {
    if (picked === null) return;
    const nextAnswers = [...answers, picked];
    setAnswers(nextAnswers);
    setPicked(null);
    if (i + 1 >= QUESTIONS.length) setFinished(true);
    else setI(i + 1);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-ink-900/95 shadow-[0_50px_140px_-40px_rgba(124,58,237,0.9)] backdrop-blur-2xl animate-scale-in">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

        {/* header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] p-4">
          <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-[10px] font-extrabold text-white', toneGrad(subject.tone))}>
            {subject.short}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-bold text-white">{quiz.title}</div>
            <div className="text-[10.5px] text-slate-500">
              Adaptive engine · {quiz.questions} questions · difficulty follows your answers
            </div>
          </div>
          <span className={cn('chip', secs < 60 ? 'chip-pink' : 'chip-amber')}>
            <Timer className="h-3 w-3" /> {mm}:{ss}
          </span>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!finished ? (
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Question {i + 1} of {QUESTIONS.length}
              </span>
              <div className="flex-1">
                <ProgressBar value={((i + 1) / QUESTIONS.length) * 100} height={4} />
              </div>
              <Chip tone={i === 0 ? 'cyan' : i === 1 ? 'violet' : 'pink'}>
                {i === 0 ? 'Medium' : i === 1 ? 'Hard' : 'Expert'} · escalated
              </Chip>
            </div>

            <p className="mt-5 text-[15.5px] font-semibold leading-relaxed text-white">{q.q}</p>

            <div className="mt-5 space-y-2.5">
              {q.o.map((o, k) => (
                <button
                  key={k}
                  onClick={() => setPicked(k)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[13px] transition-all duration-300',
                    picked === k ? 'border-violet-400/60 bg-gradient-to-r from-violet-600/[0.2] to-cyan-500/[0.1] text-white' : 'border-white/[0.09] bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06]'
                  )}
                >
                  <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[10px] font-bold', picked === k ? 'border-white/30 bg-white/15 text-white' : 'border-white/12 text-slate-500')}>
                    {String.fromCharCode(65 + k)}
                  </span>
                  {o}
                  {picked === k && <Check className="ml-auto h-4 w-4 shrink-0 text-cyan-300" />}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button onClick={next} disabled={picked === null} className="btn btn-lg btn-primary">
                {i + 1 === QUESTIONS.length ? 'Finish quiz' : 'Next question'}
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-[11.5px] text-slate-500">Answers are explained after the attempt — no instant hints.</span>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center">
            <div className="grid place-items-center">
              <ProgressRing
                value={(correctCount / QUESTIONS.length) * 100}
                size={130}
                stroke={11}
                from="#10B981"
                to="#22D3EE"
                label={<span className="text-2xl">{Math.round((correctCount / QUESTIONS.length) * 100)}%</span>}
                sub={`${correctCount}/${QUESTIONS.length}`}
              />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-white">
              {correctCount === QUESTIONS.length ? 'Flawless run.' : correctCount >= 2 ? 'Solid — one gap to close.' : 'Good signal: this topic needs work.'}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-400">
              You earned <span className="font-semibold text-amber-300">+{correctCount * 60} XP</span> and the tutor has updated your
              mastery profile. Full breakdown with per-topic accuracy is on the result page.
            </p>

            <div className="mt-6 space-y-2.5 text-left">
              {QUESTIONS.map((qq, k) => {
                const ok = answers[k] === qq.a;
                return (
                  <div key={k} className={cn('rounded-xl border p-3.5', ok ? 'border-emerald-400/25 bg-emerald-500/[0.07]' : 'border-pink-400/25 bg-pink-500/[0.07]')}>
                    <div className="flex items-start gap-2.5">
                      {ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />}
                      <div>
                        <div className="text-[12.5px] font-semibold text-white">{qq.q}</div>
                        <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{qq.why}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Link href="/quizzes/result" className="btn btn-lg btn-primary shine">
                View full result breakdown
              </Link>
              <button onClick={onClose} className="btn btn-lg btn-ghost">
                Back to quizzes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
