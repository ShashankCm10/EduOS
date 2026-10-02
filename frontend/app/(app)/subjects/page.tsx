'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Plus,
  Upload,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  GraduationCap,
  BookOpenCheck,
  Layers,
} from 'lucide-react';

import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

type Filter = 'all' | 'with-description' | 'without-description';

type Subject = {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError('');

        const data = await apiFetch('/students/me/subjects');

        if (mounted) {
          setSubjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load your subjects.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  const list = useMemo(() => {
    let out = subjects.filter((subject) => {
      const searchText = `${subject.name} ${
        subject.description ?? ''
      }`.toLowerCase();

      const hit = searchText.includes(q.toLowerCase());

      if (!hit) return false;

      if (filter === 'with-description') {
        return Boolean(subject.description?.trim());
      }

      if (filter === 'without-description') {
        return !subject.description?.trim();
      }

      return true;
    });

    out = [...out].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return out;
  }, [subjects, filter, q]);

  const FILTERS: {
    id: Filter;
    label: string;
    n: number;
  }[] = [
    {
      id: 'all',
      label: 'All courses',
      n: subjects.length,
    },
    {
      id: 'with-description',
      label: 'With description',
      n: subjects.filter((s) => Boolean(s.description?.trim())).length,
    },
    {
      id: 'without-description',
      label: 'Needs details',
      n: subjects.filter((s) => !s.description?.trim()).length,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <GraduationCap className="h-3.5 w-3.5" />
            My Academic Subjects
          </>
        }
        title={
          <>
            Subjects & <span className="grad-text">Courses</span>
          </>
        }
        sub="Your subjects are loaded directly from your EduOS account."
        actions={
          <>
            <button
              type="button"
              className="btn btn-md btn-ghost"
              onClick={() => {
                alert('Syllabus import will be connected later.');
              }}
            >
              <Upload className="h-4 w-4" />
              Import syllabus
            </button>

            <button
              type="button"
              className="btn btn-md btn-primary shine"
              onClick={() => {
                alert('Add course will be connected to the backend later.');
              }}
            >
              <Plus className="h-4 w-4" />
              Add course
            </button>
          </>
        }
      />

      {/* Summary */}
      <Reveal>
        <div className="panel grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: 'Total subjects',
              value: subjects.length,
              description: 'Subjects in your account',
              icon: BookOpenCheck,
              tone: 'from-violet-500 to-indigo-600',
            },
            {
              label: 'With descriptions',
              value: subjects.filter((s) =>
                Boolean(s.description?.trim())
              ).length,
              description: 'Subjects with additional details',
              icon: Layers,
              tone: 'from-cyan-400 to-sky-600',
            },
            {
              label: 'Needs details',
              value: subjects.filter(
                (s) => !s.description?.trim()
              ).length,
              description: 'Subjects without descriptions',
              icon: SlidersHorizontal,
              tone: 'from-amber-400 to-orange-600',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3.5"
            >
              <span
                className={cn(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white',
                  item.tone
                )}
              >
                <item.icon className="h-5 w-5" />
              </span>

              <div>
                <div className="font-display text-xl font-extrabold text-white">
                  {item.value}
                </div>

                <div className="text-[10.5px] uppercase tracking-wider text-slate-500">
                  {item.label}
                </div>

                <div className="mt-0.5 text-[10.5px] text-slate-500">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Loading */}
      {loading && (
        <Reveal>
          <div className="panel grid place-items-center py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

            <p className="mt-4 text-[14px] font-semibold text-white">
              Loading your subjects...
            </p>

            <p className="mt-1 text-[12.5px] text-slate-500">
              Fetching subjects from your EduOS account.
            </p>
          </div>
        </Reveal>
      )}

      {/* Error */}
      {!loading && error && (
        <Reveal>
          <div className="panel border border-pink-500/20 p-6">
            <p className="text-[14px] font-semibold text-pink-300">
              Unable to load subjects
            </p>

            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">
              {error}
            </p>

            <button
              type="button"
              className="btn btn-sm btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </Reveal>
      )}

      {/* Controls */}
      {!loading && !error && (
        <Reveal delay={60}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300',
                    filter === f.id
                      ? 'border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_10px_28px_-12px_rgba(124,58,237,1)]'
                      : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white'
                  )}
                >
                  {f.label}

                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[10px]',
                      filter === f.id
                        ? 'bg-white/25'
                        : 'bg-white/10'
                    )}
                  >
                    {f.n}
                  </span>
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search subjects..."
                  className="h-10 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-3 text-[13px] text-white transition focus:border-violet-400/60 sm:w-72"
                />
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Subject cards */}
      {!loading && !error && (
        <div className="grid gap-4 xl:grid-cols-2">
          {list.map((subject, index) => (
            <Reveal
              key={subject.id}
              delay={index * 60}
            >
              <div className="panel card-hover group relative overflow-hidden p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 opacity-50 blur-[80px]" />

                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-[13px] font-extrabold text-white shadow-lg">
                    {subject.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[16.5px] font-bold leading-tight text-white">
                        {subject.name}
                      </h3>
                    </div>

                    <div className="mt-1.5 text-[11.5px] text-slate-500">
                      Subject ID: {subject.id}
                    </div>
                  </div>
                </div>

                <p className="mt-4 min-h-[48px] text-[12.5px] leading-relaxed text-slate-400">
                  {subject.description?.trim()
                    ? subject.description
                    : 'No description has been added for this subject yet.'}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-4">
                  <span className="text-[11.5px] text-slate-500">
                    User ID: {subject.user_id}
                  </span>

                  <div className="ml-auto flex gap-2">
                    <Link
                      href="/materials"
                      className="btn btn-sm btn-ghost"
                    >
                      Materials
                    </Link>

                    <Link
                      href={`/subjects/${subject.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Open course
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && list.length === 0 && (
        <div className="panel grid place-items-center py-16 text-center">
          <SlidersHorizontal className="mb-3 h-8 w-8 text-slate-600" />

          <p className="text-[14px] font-semibold text-white">
            No subjects found
          </p>

          <p className="mt-1 text-[12.5px] text-slate-500">
            Try clearing the search or switching back to “All courses”.
          </p>
        </div>
      )}

      {/* Insight */}
      {!loading && !error && subjects.length > 0 && (
        <Reveal>
          <div className="aura-border overflow-hidden rounded-3xl p-[1px]">
            <div className="flex flex-wrap items-center gap-5 rounded-3xl bg-ink-900/85 p-5 backdrop-blur-xl sm:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-5 w-5 text-white" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[15px] font-bold text-white">
                  Subject workspace
                </h3>

                <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-400">
                  Your subject list is now connected to your EduOS
                  account. More academic information such as progress,
                  attendance, grades, modules, and faculty can be
                  connected when those fields are available in the
                  backend.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}