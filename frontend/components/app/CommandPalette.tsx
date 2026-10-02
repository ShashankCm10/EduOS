'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  GraduationCap,
  Library,
  Sparkles,
  ClipboardList,
  ListChecks,
  CalendarDays,
  LineChart,
  UserCog,
  CornerDownLeft,
  FileText,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { materials, quizzes, subjects } from '@/lib/data';

type Item = { label: string; group: string; href: string; icon: any; hint?: string };

const PAGES: Item[] = [
  { label: 'Dashboard', group: 'Go to', href: '/dashboard', icon: LayoutDashboard, hint: 'Today at a glance' },
  { label: 'Subjects & Courses', group: 'Go to', href: '/subjects', icon: GraduationCap, hint: '6 enrolled' },
  { label: 'Study Materials', group: 'Go to', href: '/materials', icon: Library, hint: 'Ask the PDFs' },
  { label: 'AI Tutor', group: 'Go to', href: '/tutor', icon: Sparkles, hint: 'Socratic chat' },
  { label: 'Assignments', group: 'Go to', href: '/assignments', icon: ClipboardList, hint: '4 open' },
  { label: 'Quizzes', group: 'Go to', href: '/quizzes', icon: ListChecks, hint: 'Adaptive' },
  { label: 'Study Planner', group: 'Go to', href: '/planner', icon: CalendarDays, hint: 'Timetable + focus' },
  { label: 'Progress & Analytics', group: 'Go to', href: '/analytics', icon: LineChart, hint: 'Trends' },
  { label: 'Profile & Settings', group: 'Go to', href: '/profile', icon: UserCog, hint: 'Preferences' },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const items: Item[] = [
      ...PAGES,
      ...subjects.map((s) => ({ label: s.title, group: 'Subjects', href: `/subjects/${s.id}`, icon: GraduationCap, hint: s.code })),
      ...materials.map((m) => ({ label: m.title, group: 'Materials', href: '/materials', icon: FileText, hint: m.kind })),
      ...quizzes.map((qz) => ({ label: qz.title, group: 'Quizzes', href: '/quizzes', icon: Timer, hint: `${qz.questions}Q` })),
    ];
    if (!q.trim()) return items.filter((i) => i.group === 'Go to');
    const needle = q.toLowerCase();
    return items.filter((i) => (i.label + ' ' + (i.hint ?? '') + ' ' + i.group).toLowerCase().includes(needle)).slice(0, 12);
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
    }
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(results.length - 1, c + 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      }
      if (e.key === 'Enter' && results[cursor]) {
        router.push(results[cursor].href);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, cursor, onClose, router]);

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-ink-950/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.12] bg-ink-900/95 shadow-[0_40px_120px_-30px_rgba(124,58,237,0.7)] backdrop-blur-2xl animate-scale-in">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
          <Search className="h-4 w-4 shrink-0 text-violet-300" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages, subjects, notes, quizzes…"
            className="h-14 flex-1 bg-transparent text-[15px] text-white"
          />
          <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">ESC</kbd>
        </div>

        <div className="thin-scroll max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No matches for “{q}”. Try “dijkstra”, “os”, or “quiz”.
            </div>
          )}
          {results.map((r, i) => {
            const showGroup = r.group !== lastGroup;
            lastGroup = r.group;
            const Icon = r.icon;
            return (
              <div key={r.href + r.label + i}>
                {showGroup && <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">{r.group}</div>}
                <button
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => {
                    router.push(r.href);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                    cursor === i ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/15 text-white' : 'text-slate-300'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', cursor === i ? 'text-cyan-300' : 'text-slate-500')} />
                  <span className="min-w-0 flex-1 truncate">{r.label}</span>
                  {r.hint && <span className="shrink-0 text-[11px] text-slate-500">{r.hint}</span>}
                  {cursor === i && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-cyan-300" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-400">
            <Sparkles className="h-3 w-3 text-violet-400" /> EduOS Command
          </span>
        </div>
      </div>
    </div>
  );
}
