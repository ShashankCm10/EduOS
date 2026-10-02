'use client';

import { useState } from 'react';
import { Check, Clock, Flag } from 'lucide-react';
import { cn, toneGrad, toneHex } from '@/lib/utils';
import { subjects, tasks as seedTasks } from '@/lib/data';

const PRIORITY: Record<string, { label: string; cls: string }> = {
  high: { label: 'High', cls: 'border-pink-400/30 bg-pink-500/[0.12] text-pink-300' },
  med: { label: 'Medium', cls: 'border-amber-400/30 bg-amber-500/[0.12] text-amber-300' },
  low: { label: 'Low', cls: 'border-slate-400/25 bg-white/[0.05] text-slate-300' },
};

export default function TaskList({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState(seedTasks);
  const done = items.filter((t) => t.done).length;
  const totalMins = items.filter((t) => !t.done).reduce((s, t) => s + t.mins, 0);

  const toggle = (id: string) => setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[15px] font-bold text-white">Today&apos;s focus</h3>
          <p className="mt-0.5 text-[11.5px] text-slate-500">
            {done}/{items.length} done · {totalMins} min remaining
          </p>
        </div>
        <div className="relative grid h-11 w-11 place-items-center">
          <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="4" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={113}
              strokeDashoffset={113 - (done / items.length) * 113}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-white">{Math.round((done / items.length) * 100)}%</span>
        </div>
      </div>

      <div className={cn('space-y-2', !compact && 'max-h-[19rem] overflow-y-auto thin-scroll pr-1')}>
        {items.map((t) => {
          const subj = subjects.find((s) => s.id === t.subjectId);
          const [c1] = toneHex(subj?.tone);
          return (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              className={cn(
                'group flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300 ease-spring',
                t.done ? 'border-white/[0.05] bg-white/[0.015] opacity-55' : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.055]'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all duration-300',
                  t.done ? 'border-emerald-400/60 bg-emerald-500/25 text-emerald-300' : 'border-white/20 group-hover:border-cyan-300/60'
                )}
              >
                {t.done && <Check className="h-3 w-3" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn('text-[13px] font-medium leading-snug', t.done ? 'text-slate-500 line-through' : 'text-slate-200')}>{t.title}</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-slate-500">
                  <span className="flex items-center gap-1" style={{ color: c1 }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: c1 }} />
                    {subj?.short}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.mins}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Flag className="h-3 w-3" /> {t.when}
                  </span>
                  <span className={cn('ml-auto rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide', PRIORITY[t.priority].cls)}>
                    {PRIORITY[t.priority].label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
