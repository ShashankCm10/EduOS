'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  PlayCircle,
  Plus,
  ArrowUpRight,
  Clock,
  BookOpenCheck,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  CalendarClock,
  Library,
  ListChecks,
  ChevronRight,
  Brain,
  CircleAlert,
} from 'lucide-react';

import PageHeader from '@/components/app/PageHeader';
import TaskList from '@/components/app/TaskList';
import FocusTimer from '@/components/app/FocusTimer';
import Reveal from '@/components/fx/Reveal';
import { AreaChart, Heatmap, GroupBars } from '@/components/ui/charts';
import {
  Chip,
  ProgressBar,
  ProgressRing,
  StatTile,
  Avatar,
} from '@/components/ui/core';

import { cn, toneGrad, toneHex } from '@/lib/utils';

import {
  student,
  todayStats,
  subjects,
  studyTrend,
  examCountdown,
  heatmap,
  leaderboard,
  assignments,
} from '@/lib/data';

import { getMyProfile } from '@/lib/student-api';


export default function DashboardPage() {
  const [profile, setProfile] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMyProfile()
      .then((data) => {
        if (mounted) {
          setProfile(data);
        }
      })
      .catch((error) => {
        console.error(
          'Failed to load student profile:',
          error
        );
      })
      .finally(() => {
        if (mounted) {
          setProfileLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openAssignments = assignments.filter((a) =>
    ['due-soon', 'in-progress', 'overdue'].includes(
      a.status
    )
  );

  const nextExam = examCountdown[0];

  const readiness = Math.round(
    examCountdown.reduce(
      (s, e) => s + e.readiness,
      0
    ) / examCountdown.length
  );

  const firstName =
    profile?.name?.trim().split(/\s+/)[0] ||
    'Student';

  return (
    <div className="space-y-6">
      {/* ---------------- header ---------------- */}

      <PageHeader
        eyebrow={
          <>
            <span className="flex items-center gap-1.5 text-orange-300">
              <Flame className="h-3.5 w-3.5" />
              {profileLoading
                ? 'Loading profile...'
                : 'Your study workspace'}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span>
              Your personalized academic dashboard
            </span>
          </>
        }
        title={
          <>
            Good evening,{' '}
            <span className="grad-text">
              {profileLoading ? '...' : firstName}
            </span>{' '}
            👋
          </>
        }
        sub={
          <>
            Your personalized study workspace.{' '}
            {nextExam?.days ?? 0} days until the next
            exam.
          </>
        }
        actions={
          <>
            <Link
              href="/planner"
              className="btn btn-md btn-ghost"
            >
              <CalendarClock className="h-4 w-4" />
              View week
            </Link>

            <Link
              href="/tutor"
              className="btn btn-md btn-primary shine"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI Tutor
            </Link>
          </>
        }
      />

      {/* ---------------- stat tiles ---------------- */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {todayStats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 70}
          >
            <StatTile
              label={s.label}
              value={s.value}
              suffix={s.suffix}
              delta={s.delta}
              tone={s.tone}
              spark={s.spark}
              icon={
                [
                  <Clock
                    key="a"
                    className="h-4 w-4"
                  />,
                  <BookOpenCheck
                    key="b"
                    className="h-4 w-4"
                  />,
                  <Target
                    key="c"
                    className="h-4 w-4"
                  />,
                  <Flame
                    key="d"
                    className="h-4 w-4"
                  />,
                ][i]
              }
            />
          </Reveal>
        ))}
      </div>

      {/* ---------------- chart + AI brief ---------------- */}

      <div className="grid gap-4 xl:grid-cols-[1.75fr_1fr]">
        <Reveal>
          <div className="panel relative h-full overflow-hidden p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">
                  Study hours & focus quality
                </h3>

                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  Last 14 days · focus index measured from
                  session consistency
                </p>
              </div>

              <div className="flex gap-2">
                <Chip tone="cyan">
                  avg 4.3h/day
                </Chip>

                <Chip tone="emerald">
                  <TrendingUp className="h-3 w-3" />
                  +18% vs last fortnight
                </Chip>
              </div>
            </div>

            <div className="mt-3">
              <AreaChart
                data={studyTrend}
                height={252}
                unit="h"
                series={[
                  {
                    key: 'hours',
                    name: 'Study hours',
                    from: '#7C3AED',
                    to: '#22D3EE',
                  },
                ]}
                compare="focus"
                compareName="Focus index"
                compareColor="#F59E0B"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="panel relative h-full overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-violet-600/25 blur-[70px]" />

            <div className="flex items-center gap-2">
              <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="absolute inset-0 rounded-xl bg-violet-500/40 animate-pulse-ring" />
              </span>

              <div>
                <h3 className="font-display text-[15px] font-bold text-white">
                  Daily brief
                </h3>

                <p className="text-[10.5px] text-slate-500">
                  Generated 4 minutes ago from 2,481 pages
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-pink-400/25 bg-pink-500/[0.09] p-3.5">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-pink-300">
                  <CircleAlert className="h-3.5 w-3.5" />
                  Fix first
                </div>

                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-200">
                  <span className="font-semibold text-white">
                    CN lab is 4 days overdue
                  </span>{' '}
                  and carries 15% weight. A 90-minute
                  session tonight clears it.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/25 bg-violet-500/[0.09] p-3.5">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-violet-300">
                  <Brain className="h-3.5 w-3.5" />
                  Weakest topic
                </div>

                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-200">
                  <span className="font-semibold text-white">
                    Bellman-Ford negative cycles
                  </span>{' '}
                  — 2 of 3 wrong. A 12-minute drill exists
                  in your queue.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.09] p-3.5">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                  <Zap className="h-3.5 w-3.5" />
                  On track
                </div>

                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-200">
                  Discrete Maths is revision-ready 12 days
                  early. Skip tonight and protect the CN
                  slot.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href="/planner"
                className="btn btn-sm btn-primary flex-1"
              >
                Apply to plan
              </Link>

              <Link
                href="/tutor"
                className="btn btn-sm btn-ghost"
              >
                Ask why
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------------- tasks + timer + exams ---------------- */}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr]">
        <Reveal>
          <TaskList />
        </Reveal>

        <Reveal delay={80}>
          <FocusTimer />
        </Reveal>

        <Reveal delay={140}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold text-white">
                Exam readiness
              </h3>

              <Chip tone="amber">
                Nov exams · {nextExam?.days ?? 0}d
              </Chip>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <ProgressRing
                value={readiness}
                size={104}
                stroke={9}
                from="#F59E0B"
                to="#EC4899"
                sub="overall"
                label={
                  <span className="text-xl">
                    {readiness}%
                  </span>
                }
              />

              <div className="min-w-0 flex-1 space-y-2">
                {examCountdown
                  .slice(0, 4)
                  .map((e) => (
                    <div key={e.code}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">
                          {e.subject}
                        </span>

                        <span className="text-slate-500">
                          {e.days}d · {e.readiness}%
                        </span>
                      </div>

                      <div className="mt-1">
                        <ProgressBar
                          value={e.readiness}
                          height={5}
                          from={
                            e.readiness > 70
                              ? '#10B981'
                              : e.readiness > 50
                                ? '#22D3EE'
                                : '#EC4899'
                          }
                          to={
                            e.readiness > 70
                              ? '#84CC16'
                              : e.readiness > 50
                                ? '#7C3AED'
                                : '#F59E0B'
                          }
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="text-slate-400">
                  Projected CGPA this term
                </span>

                <span className="font-display text-base font-extrabold text-white">
                  8.91
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-[10.5px] text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                +0.17 if you clear the CN backlog
              </div>
            </div>

            <Link
              href="/analytics"
              className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Full readiness breakdown
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* ---------------- continue strip ---------------- */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Reveal>
          <Link
            href="/quizzes/result"
            className="panel card-hover group flex items-center gap-4 p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600">
              <ListChecks className="h-5 w-5 text-white" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                Review result
              </div>

              <div className="truncate text-[13.5px] font-semibold text-white">
                Graphs quiz · scored 92%
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-cyan-300" />
          </Link>
        </Reveal>

        <Reveal delay={70}>
          <Link
            href="/materials"
            className="panel card-hover group flex items-center gap-4 p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <Library className="h-5 w-5 text-white" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                Continue reading
              </div>

              <div className="truncate text-[13.5px] font-semibold text-white">
                Unit 4 — Graph Algorithms · p.52
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-cyan-300" />
          </Link>
        </Reveal>

        <Reveal delay={140}>
          <Link
            href="/assignments"
            className="panel card-hover group flex items-center gap-4 p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600">
              <Clock className="h-5 w-5 text-white" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                Due tomorrow
              </div>

              <div className="truncate text-[13.5px] font-semibold text-white">
                {openAssignments[0]?.title ||
                  'No pending assignments'}
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-cyan-300" />
          </Link>
        </Reveal>
      </div>

      {/* ---------------- subjects ---------------- */}

      <Reveal>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Your courses
            </h2>

            <p className="text-[12px] text-slate-500">
              6 enrolled · 22 credits this semester
            </p>
          </div>

          <Link
            href="/subjects"
            className="btn btn-sm btn-ghost"
          >
            Manage courses
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((s, i) => {
          const [c1, c2] = toneHex(s.tone);

          return (
            <Reveal
              key={s.id}
              delay={i * 60}
            >
              <Link
                href={`/subjects/${s.id}`}
                className="panel card-hover group relative flex h-full flex-col overflow-hidden p-5"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-25 blur-[60px]"
                  style={{
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                  }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-[11px] font-extrabold text-white',
                        toneGrad(s.tone)
                      )}
                    >
                      {s.short}
                    </span>

                    <div className="min-w-0">
                      <div className="truncate font-display text-[14.5px] font-bold text-white">
                        {s.title}
                      </div>

                      <div className="text-[10.5px] text-slate-500">
                        {s.code} · {s.faculty}
                      </div>
                    </div>
                  </div>

                  <span className="chip shrink-0">
                    Grade {s.grade}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Module {s.modulesDone}/{s.modules}
                  </span>

                  <span className="font-bold text-white">
                    {s.progress}%
                  </span>
                </div>

                <div className="mt-1.5">
                  <ProgressBar
                    value={s.progress}
                    height={6}
                    from={c1}
                    to={c2}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3.5 text-center">
                  {[
                    {
                      l: 'Attendance',
                      v: `${s.attendance}%`,
                    },
                    {
                      l: 'Score',
                      v: `${s.score}`,
                    },
                    {
                      l: 'Credits',
                      v: `${s.credits}`,
                    },
                  ].map((x) => (
                    <div key={x.l}>
                      <div className="font-display text-[13px] font-bold text-white">
                        {x.v}
                      </div>

                      <div className="text-[9.5px] uppercase tracking-wider text-slate-500">
                        {x.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Next: {s.next}
                  </span>

                  <span className="flex items-center gap-1 font-semibold text-slate-400 transition group-hover:text-cyan-300">
                    Open
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* ---------------- consistency + cohort ---------------- */}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[15px] font-bold text-white">
                  Consistency map
                </h3>

                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  Every square is a study day · darker means
                  more focused time
                </p>
              </div>

              <Chip tone="violet">
                <Flame className="h-3 w-3" />
                best: 41d
              </Chip>
            </div>

            <div className="mt-5">
              <Heatmap matrix={heatmap} />
            </div>

            <div className="mt-5 grid gap-3 border-t border-white/[0.07] pt-4 sm:grid-cols-3">
              {[
                {
                  l: 'Avg session',
                  v: '58 min',
                },
                {
                  l: 'Best weekday',
                  v: 'Thursday',
                },
                {
                  l: 'Weakest slot',
                  v: 'Wed 21:00',
                },
              ].map((x) => (
                <div key={x.l}>
                  <div className="font-display text-[15px] font-bold text-white">
                    {x.v}
                  </div>

                  <div className="text-[10.5px] text-slate-500">
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="panel h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />

                <h3 className="font-display text-[15px] font-bold text-white">
                  Cohort ladder
                </h3>
              </div>

              <Chip tone="amber">
                Your progress
              </Chip>
            </div>

            <div className="mt-4 space-y-1.5">
              {leaderboard
                .slice(2, 8)
                .map((u) => (
                  <div
                    key={u.rank}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 transition',
                      u.you
                        ? 'border border-violet-400/35 bg-gradient-to-r from-violet-600/25 to-cyan-500/10'
                        : 'border border-transparent hover:bg-white/[0.04]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 shrink-0 text-center font-display text-[12px] font-extrabold',
                        u.you
                          ? 'text-cyan-300'
                          : 'text-slate-500'
                      )}
                    >
                      {u.rank}
                    </span>

                    <Avatar
                      name={u.name}
                      size={28}
                      tone={
                        u.you
                          ? 'cyan'
                          : 'violet'
                      }
                      ring={false}
                    />

                    <span
                      className={cn(
                        'min-w-0 flex-1 truncate text-[12.5px]',
                        u.you
                          ? 'font-bold text-white'
                          : 'text-slate-300'
                      )}
                    >
                      {u.name}{' '}
                      {u.you && (
                        <span className="text-[10px] font-semibold text-cyan-300">
                          · you
                        </span>
                      )}
                    </span>

                    <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                      {u.xp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-300">
                  Weekly XP vs cohort
                </span>

                <span className="chip chip-cyan">
                  +92 XP
                </span>
              </div>

              <GroupBars
                height={120}
                unit=""
                data={[
                  {
                    label: 'Mon',
                    a: 120,
                    b: 95,
                  },
                  {
                    label: 'Tue',
                    a: 180,
                    b: 110,
                  },
                  {
                    label: 'Wed',
                    a: 90,
                    b: 80,
                  },
                  {
                    label: 'Thu',
                    a: 240,
                    b: 130,
                  },
                  {
                    label: 'Fri',
                    a: 160,
                    b: 120,
                  },
                  {
                    label: 'Sat',
                    a: 300,
                    b: 150,
                  },
                  {
                    label: 'Sun',
                    a: 210,
                    b: 100,
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------------- quick actions ---------------- */}

      <Reveal>
        <div className="panel flex flex-wrap items-center gap-3 p-4">
          <span className="text-[12px] font-semibold text-slate-400">
            Quick actions
          </span>

          <div className="ml-auto flex flex-wrap gap-2">
            {[
              {
                l: 'Start focus session',
                i: PlayCircle,
                href: '/planner',
              },
              {
                l: 'Add task',
                i: Plus,
                href: '/planner',
              },
              {
                l: 'New quiz',
                i: ListChecks,
                href: '/quizzes',
              },
              {
                l: 'Upload material',
                i: Library,
                href: '/materials',
              },
            ].map((a) => (
              <Link
                key={a.l}
                href={a.href}
                className="btn btn-sm btn-ghost"
              >
                <a.i className="h-3.5 w-3.5" />
                {a.l}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}