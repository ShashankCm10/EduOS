'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Timer, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subjects } from '@/lib/data';

const MODES = [
  { id: 'focus', label: 'Deep focus', mins: 25, from: '#7C3AED', to: '#22D3EE' },
  { id: 'short', label: 'Short break', mins: 5, from: '#10B981', to: '#84CC16' },
  { id: 'long', label: 'Long break', mins: 15, from: '#F59E0B', to: '#EC4899' },
] as const;

export default function FocusTimer() {
  const [mode, setMode] = useState<(typeof MODES)[number]>(MODES[0]);
  const [subject, setSubject] = useState(subjects[0].id);
  const [left, setLeft] = useState(mode.mins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(3);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLeft(mode.mins * 60);
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    iv.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setRunning(false);
          setSessions((s) => s + 1);
          return mode.mins * 60;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (iv.current) clearInterval(iv.current);
    };
  }, [running, mode]);

  const total = mode.mins * 60;
  const progress = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const r = 74;
  const c = 2 * Math.PI * r;

  return (
    <div className="panel relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-[70px]"
        style={{ background: `linear-gradient(135deg, ${mode.from}, ${mode.to})` }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-violet-300" />
          <h3 className="font-display text-[15px] font-bold text-white">Focus session</h3>
        </div>
        <span className="chip chip-violet">{sessions} today</span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 rounded-lg border px-2 py-1.5 text-[10.5px] font-semibold transition-all duration-300',
              mode.id === m.id ? 'border-white/25 bg-white/[0.09] text-white' : 'border-white/[0.07] text-slate-400 hover:text-white'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-5 grid h-[190px] w-[190px] place-items-center">
        <svg viewBox="0 0 180 180" className="absolute h-[180px] w-[180px] -rotate-90">
          <defs>
            <linearGradient id="ft-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={mode.from} />
              <stop offset="100%" stopColor={mode.to} />
            </linearGradient>
          </defs>
          <circle cx="90" cy="90" r={r} fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="10" />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="url(#ft-g)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (progress / 100) * c}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 12px ${mode.to}88)` }}
          />
        </svg>
        <div className="text-center">
          <div className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-white tabular-nums">
            {mm}:{ss}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{mode.label}</div>
        </div>
        {running && <span className="absolute inset-0 rounded-full border border-white/10 animate-pulse-ring" />}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => setRunning((v) => !v)} className="btn btn-md btn-primary flex-1">
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setLeft(mode.mins * 60);
          }}
          className="btn btn-md btn-ghost"
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Studying</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 h-9 w-full rounded-lg border border-white/[0.09] bg-ink-800/80 px-2.5 text-[12px] text-slate-200"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} · {s.short}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[10.5px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Coffee className="h-3 w-3" /> Next break in {Math.max(1, Math.floor(left / 60))}m
        </span>
        <span className="flex items-center gap-1.5">
          <Volume2 className="h-3 w-3" /> Focus sounds on
        </span>
      </div>
    </div>
  );
}
