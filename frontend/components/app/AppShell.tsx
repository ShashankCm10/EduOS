'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import {
  LayoutDashboard,
  GraduationCap,
  Library,
  Sparkles,
  ClipboardList,
  ListChecks,
  CalendarDays,
  LineChart,
  UserCog,
  Search,
  Bell,
  Flame,
  Zap,
  Menu,
  X,
  Command,
  ChevronRight,
  Settings,
  LogOut,
  Target,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { student } from '@/lib/data';
import { Avatar, ProgressRing } from '@/components/ui/core';
import { getMyProfile } from '@/lib/student-api';

import CommandPalette from './CommandPalette';

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/subjects',
    label: 'Subjects & Courses',
    icon: GraduationCap,
  },
  {
    href: '/materials',
    label: 'Study Materials',
    icon: Library,
    badge: 'RAG',
  },
  {
    href: '/tutor',
    label: 'AI Tutor',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    href: '/assignments',
    label: 'Assignments',
    icon: ClipboardList,
    badge: '4',
  },
  {
    href: '/quizzes',
    label: 'Quizzes',
    icon: ListChecks,
  },
  {
    href: '/planner',
    label: 'Study Planner',
    icon: CalendarDays,
  },
  {
    href: '/analytics',
    label: 'Progress',
    icon: LineChart,
  },
  {
    href: '/profile',
    label: 'Profile & Settings',
    icon: UserCog,
  },
];

type StudentProfile = {
  id: number;
  name: string;
  email: string;
};

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Real authenticated student
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Load the currently authenticated student from the backend.
  useEffect(() => {
    let mounted = true;

    getMyProfile()
      .then((data) => {
        if (mounted) {
          setProfile(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setProfile(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'k'
      ) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const active = (href: string) =>
    path === href || path.startsWith(href + '/');

  const pageTitle =
    NAV.find((n) => active(n.href))?.label ?? 'EduOS';

  /*
   * Use the actual authenticated student's name.
   * Fall back to "Student" while the profile is loading.
   */
  const studentName = profile?.name || 'Student';
  const studentEmail = profile?.email || 'Student account';

  /*
   * Keep the existing progress card for now.
   * This is separate from the student's identity.
   * We will connect XP/level/streak to real progress data later.
   */
  const sidebar = (
    <div className="flex h-full flex-col gap-5 p-4">
      {/* logo */}
      <Link
        href="/"
        className="group flex items-center gap-3 px-1 py-2"
      >
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-glow">
          <GraduationCap className="h-5 w-5 text-white" />

          <span className="absolute inset-0 rounded-2xl bg-grad-ring opacity-0 blur-md transition-opacity group-hover:opacity-70 animate-spin-slower" />
        </span>

        {!collapsed && (
          <span className="min-w-0">
            <span className="block font-display text-[17px] font-extrabold leading-none tracking-tight text-white">
              Edu<span className="grad-text">OS</span>
            </span>

            <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Student workspace
            </span>
          </span>
        )}
      </Link>

      {/* nav */}
      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto">
        {NAV.map(
          ({ href, label, icon: Icon, badge }) => {
            const on = active(href);

            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring',
                  on
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                )}
              >
                {on && (
                  <>
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/85 via-indigo-600/60 to-cyan-500/45 shadow-[0_10px_30px_-12px_rgba(124,58,237,0.95)]" />

                    <span className="absolute inset-0 rounded-xl border border-white/20" />
                  </>
                )}

                <Icon
                  className={cn(
                    'relative h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110',
                    on && 'drop-shadow'
                  )}
                />

                {!collapsed && (
                  <span className="relative truncate">
                    {label}
                  </span>
                )}

                {!collapsed && badge && (
                  <span
                    className={cn(
                      'relative ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                      on
                        ? 'bg-white/25 text-white'
                        : 'bg-white/10 text-slate-300'
                    )}
                  >
                    {badge}
                  </span>
                )}

                {on && !collapsed && (
                  <ChevronRight className="relative ml-auto h-3.5 w-3.5 opacity-70" />
                )}
              </Link>
            );
          }
        )}
      </nav>

      {/* level card */}
      {!collapsed ? (
        <div className="aura-border aura-border-slow relative overflow-hidden rounded-2xl p-3.5">
          <div className="flex items-center gap-3">
            <ProgressRing
              value={
                (student.xp / student.xpToNext) * 100
              }
              size={54}
              stroke={5}
              from="#F59E0B"
              to="#EC4899"
              label={
                <span className="text-[11px]">
                  {student.level}
                </span>
              }
            />

            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Level {student.level}
              </div>

              <div className="truncate text-[11px] text-slate-400">
                {(
                  student.xpToNext - student.xp
                ).toLocaleString()}{' '}
                XP to next
              </div>

              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                <Zap className="h-3 w-3 text-amber-400" />

                {student.xp.toLocaleString()} XP
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-orange-300">
              <Flame className="h-3 w-3" />

              {student.streak}-day streak
            </span>

            <Link
              href="/analytics"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              View progress →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-white/10 bg-white/[0.04] py-3">
          <ProgressRing
            value={
              (student.xp / student.xpToNext) * 100
            }
            size={40}
            stroke={4}
            from="#F59E0B"
            to="#EC4899"
            label={
              <span className="text-[10px]">
                {student.level}
              </span>
            }
          />
        </div>
      )}

      <button
        onClick={() => setCollapsed((v) => !v)}
        className="hidden items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-[11px] font-semibold text-slate-400 transition hover:text-white lg:flex"
      >
        {collapsed ? '»' : '« Collapse'}
      </button>
    </div>
  );

  return (
    <div className="min-h-dvh">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-ink-950" />

        <div className="absolute inset-0 grid-bg opacity-[0.35] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_65%)]" />

        <div className="absolute -left-40 top-[-10%] h-[38rem] w-[38rem] rounded-full bg-violet-600/25 blur-[150px] animate-orb-drift" />

        <div className="absolute -right-32 top-[24%] h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.18] blur-[140px] animate-float" />

        <div
          className="absolute bottom-[-14%] left-[35%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/[0.18] blur-[150px] animate-orb-drift"
          style={{ animationDelay: '-10s' }}
        />
      </div>

      <div className="flex">
        {/* desktop sidebar */}
        <aside
          className={cn(
            'sticky top-0 hidden h-dvh shrink-0 border-r border-white/[0.07] bg-ink-900/55 backdrop-blur-2xl transition-[width] duration-500 ease-spring lg:block',
            collapsed
              ? 'w-[86px]'
              : 'w-[268px]'
          )}
        >
          {sidebar}
        </aside>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <div className="absolute left-0 top-0 h-full w-[280px] border-r border-white/10 bg-ink-900/95 backdrop-blur-2xl animate-[fade-up_0.3s_ease]">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>

              {sidebar}
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* topbar */}
          <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-950/70 backdrop-blur-2xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* page identity */}
              <div className="hidden min-w-0 sm:block">
                <div className="text-[11px] text-slate-500">
                  Student Workspace
                </div>

                <h1 className="truncate font-display text-[15px] font-bold text-white">
                  {pageTitle}
                </h1>
              </div>

              {/* search */}
              <button
                onClick={() => setPaletteOpen(true)}
                className="group ml-auto flex h-10 flex-1 max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-sm text-slate-500 transition hover:border-violet-400/40 hover:bg-white/[0.06] sm:flex-none"
              >
                <Search className="h-4 w-4 shrink-0 transition group-hover:text-violet-300" />

                <span className="truncate">
                  Search notes, quizzes, topics…
                </span>

                <kbd className="ml-auto hidden items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:flex">
                  <Command className="h-2.5 w-2.5" />
                  K
                </kbd>
              </button>

              <div className="ml-auto flex items-center gap-2 sm:ml-0">
                {/* streak */}
                <span className="hidden items-center gap-1.5 rounded-xl border border-orange-400/25 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300 md:flex">
                  <Flame className="h-3.5 w-3.5" />

                  {student.streak}
                </span>

                {/* notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setBellOpen((v) => !v);
                      setUserOpen(false);
                    }}
                    className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08]"
                  >
                    <Bell className="h-4 w-4" />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-600 ring-2 ring-ink-950" />
                  </button>

                  {bellOpen && (
                    <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/[0.97] shadow-lift backdrop-blur-xl animate-scale-in">
                      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                        <span className="text-sm font-bold text-white">
                          Notifications
                        </span>

                        <span className="chip chip-pink">
                          3 new
                        </span>
                      </div>

                      {[
                        {
                          t: 'CN lab is overdue',
                          s: 'Submit the socket server report in 6h',
                          tone: 'from-pink-500 to-rose-500',
                          icon: '⚠',
                        },
                        {
                          t: 'New material indexed',
                          s: '“Normalisation cheat-sheet” is now searchable',
                          tone: 'from-violet-500 to-indigo-500',
                          icon: '📚',
                        },
                        {
                          t: 'AI Tutor insight',
                          s: 'Bellman-Ford is your weakest topic this month',
                          tone: 'from-cyan-400 to-sky-500',
                          icon: '✨',
                        },
                      ].map((n, i) => (
                        <div
                          key={i}
                          className="flex gap-3 border-b border-white/[0.05] px-4 py-3 transition hover:bg-white/[0.04]"
                        >
                          <span
                            className={cn(
                              'grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm',
                              n.tone
                            )}
                          >
                            {n.icon}
                          </span>

                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-white">
                              {n.t}
                            </div>

                            <div className="text-[11px] leading-snug text-slate-400">
                              {n.s}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Link
                        href="/assignments"
                        className="block px-4 py-3 text-center text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        View all activity →
                      </Link>
                    </div>
                  )}
                </div>

                {/* user menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserOpen((v) => !v);
                      setBellOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1 pr-2 transition hover:bg-white/[0.08]"
                  >
                    <Avatar
                      name={studentName}
                      size={32}
                      tone="violet"
                      ring={false}
                    />

                    <span className="hidden text-left sm:block">
                      <span className="block text-[12px] font-bold leading-none text-white">
                        {studentName}
                      </span>

                      <span className="mt-0.5 block max-w-[150px] truncate text-[10px] leading-none text-slate-500">
                        {studentEmail}
                      </span>
                    </span>
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/[0.97] shadow-lift backdrop-blur-xl animate-scale-in">
                      <div className="border-b border-white/[0.07] p-4">
                        <div className="text-sm font-bold text-white">
                          {studentName}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {studentEmail}
                        </div>
                      </div>

                      {[
                        {
                          l: 'Profile & settings',
                          href: '/profile',
                          i: Settings,
                        },
                        {
                          l: 'My goals',
                          href: '/profile#goals',
                          i: Target,
                        },
                      ].map(
                        ({ l, href, i: I }) => (
                          <Link
                            key={l}
                            href={href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <I className="h-4 w-4" />
                            {l}
                          </Link>
                        )
                      )}

                      <Link
                        href="/"
                        className="flex items-center gap-2.5 border-t border-white/[0.07] px-4 py-2.5 text-[13px] text-pink-300 transition hover:bg-pink-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}