'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Plus,
  Paperclip,
  MessageSquare,
  FileText,
  Brain,
  Target,
  Layers,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  Zap,
  BookOpen,
  Timer,
  Settings2,
  CircleCheck,
  History,
} from 'lucide-react';
import PageHeader from '@/components/app/PageHeader';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressBar, ProgressRing } from '@/components/ui/core';
import { cn } from '@/lib/utils';
import { materials, subjects, tutorSuggestions } from '@/lib/data';

type Msg = {
  role: 'user' | 'ai';
  text: string;
  cites?: { doc: string; page: number }[];
  bullets?: string[];
  drill?: string[];
  note?: string;
};

const MODES = [
  { id: 'socratic', label: 'Socratic', icon: Brain, desc: 'Asks before it tells' },
  { id: 'direct', label: 'Direct', icon: Zap, desc: 'Straight answers' },
  { id: 'exam', label: 'Exam drill', icon: Target, desc: 'Quiz-first mode' },
] as const;

const CONVOS = [
  { t: 'Bellman-Ford negative cycles', s: 'DSA · 12 messages', active: true },
  { t: 'Explain paging like I am 12', s: 'OS · 8 messages' },
  { t: '7-day revision plan for CN', s: 'CN · 21 messages' },
  { t: 'Normalisation 3NF doubts', s: 'DBMS · 5 messages' },
  { t: 'Bias–variance intuition', s: 'ML · 15 messages' },
];

const REPLIES: Record<string, Msg> = {
  socratic: {
    role: 'ai',
    text: 'Before I answer — take 20 seconds. If you relax every edge once more after the standard |V|−1 rounds and the distance still improves, what must exist in the graph?',
    bullets: ['Think about what "still improving" means after full convergence', 'Consider the shortest-path edge-count bound of |V|−1'],
    note: 'Answer in your head, then say "show me" and I will walk through it.',
  },
  direct: {
    role: 'ai',
    text: 'A negative-weight cycle reachable from the source. Here is the complete reasoning:',
    bullets: [
      'After |V|−1 rounds every shortest path with at most |V|−1 edges is final.',
      'A shortest path can never use more than |V|−1 edges unless a negative cycle exists.',
      'So any edge that still relaxes in round |V| lies on or after such a cycle.',
    ],
    cites: [
      { doc: 'Unit 4 — Graph Algorithms (full notes)', page: 33 },
      { doc: 'Dijkstra & Bellman-Ford worked examples', page: 21 },
    ],
    note: 'Want a 6-question drill on this? It takes 9 minutes.',
  },
  exam: {
    role: 'ai',
    text: 'Exam drill generated — 6 questions, 9 minutes, adaptive difficulty. Try these first three:',
    drill: [
      'Given weights A→B=2, B→C=−5, C→A=1 — is there a negative cycle?',
      'How many relaxation rounds does Bellman-Ford need for |V|=6?',
      'Which algorithm detects a negative cycle in O(V·E) rather than O(E log V)?',
    ],
    note: 'Submit answers and I will mark them with the same rubric your professor uses.',
  },
};

export default function TutorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'user', text: 'I keep getting Bellman-Ford wrong in quizzes. Can you explain when it beats Dijkstra?' },
    {
      role: 'ai',
      text: 'Short version: Dijkstra assumes every edge weight is non-negative — it greedily locks in the closest unvisited node, so one negative edge can break it. Bellman-Ford gives up greediness and relaxes every edge |V|−1 times.',
      bullets: [
        'No negative weights → Dijkstra, O(E log V)',
        'Any negative weight (no negative cycle) → Bellman-Ford, O(V·E)',
        'Mentions of arbitrage or "graph changes over time" → almost always Bellman-Ford',
      ],
      cites: [
        { doc: 'Unit 4 — Graph Algorithms (full notes)', page: 31 },
        { doc: 'Dijkstra & Bellman-Ford worked examples', page: 19 },
      ],
      note: 'You lost 2 of 3 Bellman-Ford questions in the 28 Sep quiz — both were negative-cycle variants.',
    },
  ]);
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('socratic');
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [sources, setSources] = useState<string[]>(materials.slice(0, 4).map((m) => m.id));
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    setMsgs((m) => [...m, { role: 'user', text }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, REPLIES[mode]]);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <Sparkles className="h-3.5 w-3.5" /> Grounded in your {materials.length} sources · {sources.length} active
          </>
        }
        title={
          <>
            AI Academic <span className="grad-text">Tutor</span>
          </>
        }
        sub="A tutor with your syllabus, your quiz history and your calendar in context. It hints before it answers, drills what you keep missing, and turns every idea into an action."
        actions={
          <>
            <Link href="/materials" className="btn btn-md btn-ghost">
              <FileText className="h-4 w-4" /> Manage sources
            </Link>
            <button
              onClick={() => setMsgs([])}
              className="btn btn-md btn-primary shine"
            >
              <Plus className="h-4 w-4" /> New conversation
            </button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[260px_1fr_320px]">
        {/* ------------- conversations ------------- */}
        <Reveal>
          <div className="panel flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                <History className="h-3.5 w-3.5" /> Recent
              </h3>
              <span className="chip">5</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {CONVOS.map((c, i) => (
                <button
                  key={i}
                  className={cn(
                    'w-full rounded-xl border p-2.5 text-left transition-all duration-300',
                    c.active ? 'border-violet-400/35 bg-gradient-to-br from-violet-600/[0.15] to-cyan-500/[0.05]' : 'border-transparent hover:border-white/[0.09] hover:bg-white/[0.04]'
                  )}
                >
                  <div className={cn('truncate text-[12.5px] font-semibold', c.active ? 'text-white' : 'text-slate-300')}>{c.t}</div>
                  <div className="mt-0.5 text-[10px] text-slate-500">{c.s}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-4">
              <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5" /> Saved outputs
              </h3>
              <div className="mt-3 space-y-1.5">
                {['Graph flashcards · 24 cards', 'CN mock paper · 60 marks', 'OS summary sheet · 2 pages'].map((x) => (
                  <div key={x} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2.5 py-2">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                    <span className="truncate text-[11.5px] text-slate-300">{x}</span>
                    <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] uppercase tracking-wider text-slate-500">Tutor memory</span>
                  <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="mt-2.5 space-y-2.5">
                  {[
                    { l: 'Quiz history', v: 100 },
                    { l: 'Notes indexed', v: 92 },
                    { l: 'Planner link', v: 74 },
                  ].map((x) => (
                    <div key={x.l}>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-400">{x.l}</span>
                        <span className="font-bold text-emerald-300">on</span>
                      </div>
                      <div className="mt-1">
                        <ProgressBar value={x.v} height={4} from="#10B981" to="#84CC16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-sm btn-ghost w-full">
                <Trash2 className="h-3.5 w-3.5" /> Clear memory
              </button>
            </div>
          </div>
        </Reveal>

        {/* ------------- chat ------------- */}
        <Reveal delay={60}>
          <div className="panel flex h-full min-h-[42rem] flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] p-4">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute inset-0 rounded-2xl bg-violet-500/40 animate-pulse-ring" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[15px] font-bold text-white">EduOS Tutor</h3>
                <div className="flex items-center gap-2 text-[10.5px] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ticker-pulse" />
                  {sources.length} sources attached · answers cited to page level
                </div>
              </div>

              <div className="flex gap-1 rounded-xl border border-white/[0.09] bg-white/[0.03] p-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.desc}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-300',
                      mode === m.id ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <m.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div ref={scroller} className="thin-scroll flex-1 space-y-4 overflow-y-auto p-5">
              {msgs.length === 0 && (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-glow">
                      <Sparkles className="h-6 w-6 text-white" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-white">What are we fixing tonight?</h3>
                    <p className="mx-auto mt-2 max-w-sm text-[12.5px] text-slate-400">
                      Ask about a chapter, a problem set, a past paper, or let me pick the weakest topic from your quiz history.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {tutorSuggestions.slice(0, 4).map((s) => (
                        <button key={s} onClick={() => send(s)} className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[11.5px] text-slate-300 transition hover:border-violet-400/50 hover:text-white">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {msgs.map((m, i) => (
                <div key={i} className={cn('flex gap-3 animate-fade-up', m.role === 'user' && 'justify-end')}>
                  {m.role === 'ai' && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                      <Bot className="h-4 w-4 text-white" />
                    </span>
                  )}

                  <div className={cn('min-w-0 max-w-[85%]', m.role === 'user' && 'order-first')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3',
                        m.role === 'user'
                          ? 'rounded-br-sm border border-white/12 bg-white/[0.07] text-[13px] text-slate-100'
                          : 'rounded-bl-sm border border-violet-400/22 bg-gradient-to-br from-violet-600/[0.14] to-cyan-500/[0.07]'
                      )}
                    >
                      <p className={cn('leading-relaxed text-slate-100', m.role === 'ai' ? 'text-[13px]' : 'text-[13px]')}>{m.text}</p>

                      {m.bullets && (
                        <ul className="mt-3 space-y-2">
                          {m.bullets.map((b, k) => (
                            <li key={k} className="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-300">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      {m.drill && (
                        <div className="mt-3 space-y-2">
                          {m.drill.map((d, k) => (
                            <div key={k} className="flex items-start gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 py-2.5">
                              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-to-br from-violet-600 to-cyan-500 text-[10px] font-bold text-white">
                                {k + 1}
                              </span>
                              <span className="text-[12px] leading-relaxed text-slate-200">{d}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {m.note && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-500/[0.08] px-3 py-2.5">
                          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                          <span className="text-[11.5px] leading-relaxed text-amber-100">{m.note}</span>
                        </div>
                      )}

                      {m.cites && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {m.cites.map((c, k) => (
                            <Link
                              key={k}
                              href="/materials"
                              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-500/[0.1] px-2.5 py-1 text-[10.5px] font-semibold text-cyan-200 transition hover:border-cyan-400/60"
                            >
                              <FileText className="h-2.5 w-2.5" /> {c.doc} · p.{c.page}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {m.role === 'ai' && (
                      <div className="mt-2 flex items-center gap-1">
                        {[Copy, ThumbsUp, ThumbsDown, RefreshCw].map((I, k) => (
                          <button key={k} className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-200">
                            <I className="h-3.5 w-3.5" />
                          </button>
                        ))}
                        <span className="ml-2 text-[10px] text-slate-600">grounded · 2 sources</span>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05]">
                      <User className="h-4 w-4 text-slate-400" />
                    </span>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                    <Bot className="h-4 w-4 text-white" />
                  </span>
                  <div className="rounded-2xl rounded-bl-sm border border-violet-400/22 bg-gradient-to-br from-violet-600/[0.14] to-cyan-500/[0.07] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-1">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </span>
                      <span className="text-[11.5px] text-slate-400">Reading Unit 4 notes and your quiz history…</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* composer */}
            <div className="border-t border-white/[0.07] p-4">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {tutorSuggestions.slice(0, 3).map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[10.5px] text-slate-400 transition hover:border-violet-400/50 hover:text-white">
                    {s.length > 42 ? s.slice(0, 42) + '…' : s}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-2.5 transition focus-within:border-violet-400/60 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]">
                <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:text-white">
                  <Paperclip className="h-4 w-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything — a concept, a past paper question, or “what should I study tonight?”"
                  className="max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-relaxed text-white"
                />
                <button
                  onClick={() => send(input)}
                  disabled={thinking || !input.trim()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white transition disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
                <span>⏎ send · ⇧⏎ newline</span>
                <span className="flex items-center gap-1">
                  <CircleCheck className="h-3 w-3 text-emerald-400" /> Your notes are never used for public model training
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Timer className="h-3 w-3" /> avg response 1.4s
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------- context panel ------------- */}
        <Reveal delay={120}>
          <div className="space-y-4">
            <div className="panel p-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                  <FileText className="h-3.5 w-3.5" /> Active sources
                </h3>
                <span className="chip chip-cyan">{sources.length}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {materials.slice(0, 5).map((m) => {
                  const on = sources.includes(m.id);
                  const s = subjects.find((x) => x.id === m.subjectId)!;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSources((p) => (on ? p.filter((x) => x !== m.id) : [...p, m.id]))}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all duration-300',
                        on ? 'border-cyan-400/30 bg-cyan-500/[0.08]' : 'border-white/[0.07] bg-white/[0.02] opacity-60'
                      )}
                    >
                      <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[9px] font-bold', on ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200' : 'border-white/15 text-slate-500')}>
                        {on ? '✓' : ''}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11.5px] font-medium text-slate-200">{m.title}</span>
                        <span className="text-[9.5px] text-slate-500">
                          {s.code} · {m.pages}p
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <Link href="/materials" className="btn btn-sm btn-ghost mt-3 w-full">
                Add or remove sources
              </Link>
            </div>

            <div className="panel p-4">
              <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                <Brain className="h-3.5 w-3.5" /> What the tutor noticed
              </h3>
              <div className="mt-3 space-y-2.5">
                {[
                  { t: 'Negative cycles', v: 34, tone: 'pink' },
                  { t: 'Congestion control', v: 41, tone: 'amber' },
                  { t: 'Normalisation (BCNF)', v: 58, tone: 'amber' },
                  { t: 'Time complexity proofs', v: 67, tone: 'cyan' },
                  { t: 'Graph traversal', v: 92, tone: 'emerald' },
                ].map((x) => (
                  <div key={x.t}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{x.t}</span>
                      <span
                        className={cn(
                          'font-bold',
                          { pink: 'text-pink-300', amber: 'text-amber-300', cyan: 'text-cyan-300', emerald: 'text-emerald-300' }[x.tone]
                        )}
                      >
                        {x.v}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        value={x.v}
                        height={5}
                        from={{ pink: '#EC4899', amber: '#F59E0B', cyan: '#22D3EE', emerald: '#10B981' }[x.tone]!}
                        to={{ pink: '#F43F5E', amber: '#FB923C', cyan: '#7C3AED', emerald: '#84CC16' }[x.tone]!}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-4">
              <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                <MessageSquare className="h-3.5 w-3.5" /> Try asking
              </h3>
              <div className="mt-3 space-y-1.5">
                {tutorSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="flex w-full items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 text-left text-[11.5px] leading-snug text-slate-300 transition hover:border-violet-400/50 hover:text-white"
                  >
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-violet-300" />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel relative overflow-hidden p-4">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-600/25 blur-[60px]" />
              <div className="flex items-center gap-3">
                <ProgressRing value={68} size={64} stroke={6} from="#7C3AED" to="#22D3EE" label={<span className="text-[11px]">68%</span>} />
                <div>
                  <div className="text-[12px] font-bold text-white">This week with the tutor</div>
                  <div className="mt-1 text-[10.5px] text-slate-400">142 messages · 9 decks generated</div>
                  <div className="mt-1 text-[10.5px] text-emerald-300">+4.1h of focused study</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3 text-center">
                {[
                  { l: 'Drills', v: '14' },
                  { l: 'Mock papers', v: '3' },
                  { l: 'Cards', v: '186' },
                ].map((x) => (
                  <div key={x.l}>
                    <div className="font-display text-[14px] font-bold text-white">{x.v}</div>
                    <div className="text-[9.5px] uppercase tracking-wider text-slate-500">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
