'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Bot, User, ShieldCheck, Zap, GitBranch, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/fx/Reveal';
import { Chip, ProgressRing } from '@/components/ui/core';

type Turn = {
  role: 'user' | 'ai';
  text: string;
  cites?: { doc: string; page: number }[];
  chips?: string[];
  kind?: 'insight' | 'plan';
};

const SCRIPT: Turn[] = [
  { role: 'user', text: 'My CN exam is in 42 days and I am only 48% ready. What do I do?' },
  {
    role: 'ai',
    text: 'You have 41 usable study days and 6 units. At 1.5 units/week you finish content by day 30 and keep 11 days for revision plus 3 mock papers. Your bottleneck is not time — it is Congestion Control: 0/[0.06] correct across your last two quizzes.',
    cites: [
      { doc: 'CN Unit 5 — Transport Layer', page: 42 },
      { doc: '2024 End-Sem paper', page: 3 },
    ],
    chips: ['Rebuild plan', 'Drill congestion control', 'Why is it my weak spot?'],
  },
  {
    role: 'user',
    text: 'Rebuild it. I only get 2 hours on weekdays.',
  },
  {
    role: 'ai',
    text: 'Done — 14h/week for 6 weeks. Weekdays: 45 min concept from your slides + 45 min spaced-repetition drills. Weekends: 3h deep work + 1h timed subsection. I moved CN to your 07:30 slot because your accuracy peaks there by 18%.',
    kind: 'plan',
    chips: ['Open in planner', 'Add 3 mock papers'],
  },
];

export default function AISection() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [partial, setPartial] = useState('');
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const turn = SCRIPT[step];
    if (!turn) {
      const t = setTimeout(() => {
        setStep(0);
        setPartial('');
      }, 8000);
      return () => clearTimeout(t);
    }
    if (turn.role === 'user') {
      setPartial('');
      const t = setTimeout(() => setStep((s) => s + 1), 1500);
      return () => clearTimeout(t);
    }
    setTyping(true);
    let i = 0;
    const iv = setInterval(() => {
      i += 3;
      setPartial(turn.text.slice(0, i));
      if (i >= turn.text.length) {
        clearInterval(iv);
        setTyping(false);
        setTimeout(() => setStep((s) => s + 1), 2200);
      }
    }, 16);
    return () => clearInterval(iv);
  }, [step]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [step, partial]);

  const visible = SCRIPT.slice(0, Math.min(step, SCRIPT.length));

  return (
    <section id="ai" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-violet-600/[0.22] blur-[140px] animate-orb-drift" />
        <div className="absolute right-[-8%] bottom-[6%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.18] blur-[130px] animate-float" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* copy */}
        <div>
          <Reveal>
            <Chip tone="violet">
              <Sparkles className="h-3 w-3" /> The AI layer
            </Chip>
            <h2 className="display-xl mt-5 text-balance text-[clamp(2rem,4.6vw,3.5rem)] text-white">
              A tutor that knows <span className="grad-text">you</span> — not just the textbook
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-slate-400">
              Generic chatbots give generic answers. EduOS grounds every reply in your uploaded material, your quiz history and your
              calendar — so advice is specific, cited and actually doable tonight.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {[
              { i: FileText, t: 'Cited, not guessed', d: 'Every claim links to a page in your own PDFs.', tone: 'from-violet-500 to-indigo-600' },
              { i: GitBranch, t: 'Diagnoses root causes', d: 'Traces wrong answers back to the missing prerequisite.', tone: 'from-cyan-400 to-sky-600' },
              { i: Zap, t: 'Turns into action', d: 'One tap to a plan, a deck or a mock paper.', tone: 'from-amber-400 to-orange-600' },
              { i: ShieldCheck, t: 'Private by default', d: 'Your notes are never used to train public models.', tone: 'from-emerald-400 to-teal-600' },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 70}>
                <div className="group flex gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.028] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
                  <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg', f.tone)}>
                    <f.i className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-bold text-white">{f.t}</div>
                    <div className="mt-0.5 text-[12.5px] leading-relaxed text-slate-400">{f.d}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/tutor" className="btn btn-lg btn-primary shine">
                <Bot className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                Open the AI Tutor
              </Link>
              <Link href="/materials" className="btn btn-lg btn-ghost">
                See RAG over PDFs
              </Link>
            </div>
          </Reveal>
        </div>

        {/* chat demo */}
        <Reveal from="right" delay={120}>
          <div className="relative">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-violet-600/35 via-fuchsia-500/20 to-cyan-500/35 blur-[70px]" />
            <div className="aura-border overflow-hidden rounded-[1.6rem] p-[1px]">
              <div className="overflow-hidden rounded-[1.55rem] bg-ink-900/[0.92] backdrop-blur-2xl">
                <div className="flex items-center gap-3 border-b border-white/[0.07] bg-ink-950/50 px-4 py-3.5">
                  <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                    <Bot className="h-4 w-4 text-white" />
                    <span className="absolute inset-0 rounded-xl bg-violet-500/40 animate-pulse-ring" />
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-white">EduOS Tutor</div>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ticker-pulse" />
                      grounded in 9 sources · 2,481 pages
                    </div>
                  </div>
                  <div className="ml-auto hidden sm:block">
                    <ProgressRing value={48} size={44} stroke={4} from="#F59E0B" to="#EC4899" label={<span className="text-[9px]">48%</span>} />
                  </div>
                </div>

                <div ref={scroller} className="thin-scroll h-[430px] space-y-4 overflow-y-auto p-4 sm:h-[470px]">
                  {visible.map((t, i) => (
                    <Bubble key={i} turn={t} />
                  ))}

                  {typing && (
                    <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-violet-400/25 bg-gradient-to-br from-violet-600/[0.16] to-cyan-500/[0.08] px-4 py-3">
                      <p className="text-[13px] leading-relaxed text-slate-100">
                        {partial}
                        <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-cyan-300 animate-blink" />
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-white/[0.07] px-4 py-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />
                  <span className="truncate text-[12.5px] text-slate-500">Ask about your syllabus, deadlines or weak topics…</span>
                  <button className="ml-auto grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Bubble({ turn }: { turn: Turn }) {
  if (turn.role === 'user') {
    return (
      <div className="flex items-start justify-end gap-2.5 animate-fade-up">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm border border-white/[0.12] bg-white/[0.07] px-3.5 py-2.5 text-[13px] text-slate-100">
          {turn.text}
        </div>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05]">
          <User className="h-3.5 w-3.5 text-slate-400" />
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
        <Bot className="h-3.5 w-3.5 text-white" />
      </span>
      <div className="min-w-0 max-w-[92%]">
        <div className="rounded-2xl rounded-bl-sm border border-violet-400/[0.22] bg-gradient-to-br from-violet-600/[0.15] to-cyan-500/[0.08] px-3.5 py-3">
          <p className="text-[13px] leading-relaxed text-slate-100">{turn.text}</p>

          {turn.kind === 'plan' && (
            <div className="mt-3 grid grid-cols-7 gap-1">
              {[2, 1.5, 2, 1.5, 2, 4, 3.5].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="flex h-16 w-full items-end overflow-hidden rounded-md bg-white/[0.05]">
                    <div className="w-full rounded-md bg-gradient-to-t from-violet-600 to-cyan-400" style={{ height: `${(h / 4) * 100}%` }} />
                  </div>
                  <span className="text-[8.5px] text-slate-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          )}

          {turn.cites && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {turn.cites.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-500/[0.1] px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                  <FileText className="h-2.5 w-2.5" /> {c.doc} · p.{c.page}
                </span>
              ))}
            </div>
          )}
        </div>

        {turn.chips && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {turn.chips.map((c) => (
              <span key={c} className="cursor-default rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[10.5px] text-slate-300 transition hover:border-violet-400/50 hover:text-white">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
