'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/fx/Reveal';
import { SectionHead } from '@/components/ui/core';

const QA = [
  {
    q: 'Is EduOS connected to my college?',
    a: 'No — and that is deliberate. EduOS is student-only. Your institution cannot see your notes, your quiz attempts, your streak or your analytics. You can import your syllabus and timetable manually in about ten minutes, or use a template from 400+ universities we already map.',
  },
  {
    q: 'Does the AI make things up?',
    a: 'Answers are grounded in the material you uploaded. When the tutor cannot find support in your sources it says so instead of inventing an answer, and every claim carries a page-level citation you can open in one click. You can also switch to "strict mode", where it answers only from your documents.',
  },
  {
    q: 'What file types can I upload?',
    a: 'PDF, DOCX, PPTX, EPUB, images and scanned handwriting, plus plain text and Markdown. Everything is chunked with page numbers preserved so citations stay accurate. Files up to 200 MB per document, unlimited documents on Scholar.',
  },
  {
    q: 'Will this actually raise my marks?',
    a: 'Across 3,204 self-reported results, the average lift was 18% within one term — but the honest answer is that it raises marks only if you use the daily brief and the drills. EduOS is an operating system, not an autopilot. Students who study 20+ minutes a day see the largest gains.',
  },
  {
    q: 'Can I use it offline?',
    a: 'Yes. Scholar and Campus include offline mode: your materials, decks and the planner are cached on device, and focus sessions sync back the moment you reconnect. The AI tutor needs a connection, but everything else works in a basement library.',
  },
  {
    q: 'What happens after I graduate?',
    a: 'Your workspace converts to an alumni mode at no cost — keep your materials, decks and transcripts of your AI conversations. Nothing is deleted unless you ask for it, and you can export everything as PDF or Markdown at any time.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionHead
              align="left"
              eyebrow="Questions"
              title={
                <>
                  The things students
                  <br />
                  actually ask us
                </>
              }
              sub="Short, honest answers. If something is missing, the AI tutor in your workspace will happily argue about it."
            />
          </Reveal>

          <div className="space-y-3">
            {QA.map((item, i) => {
              const on = open === i;
              return (
                <Reveal key={item.q} delay={i * 60}>
                  <div
                    className={cn(
                      'overflow-hidden rounded-2xl border transition-all duration-500 ease-spring',
                      on ? 'border-violet-400/35 bg-gradient-to-br from-violet-600/[0.12] to-cyan-500/[0.05]' : 'border-white/[0.08] bg-white/[0.028] hover:border-white/20'
                    )}
                  >
                    <button onClick={() => setOpen(on ? null : i)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                      <span className={cn('font-display text-[13px] font-extrabold', on ? 'grad-text' : 'text-slate-600')}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('flex-1 text-[14.5px] font-semibold', on ? 'text-white' : 'text-slate-300')}>{item.q}</span>
                      <span
                        className={cn(
                          'grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-all duration-500',
                          on ? 'rotate-45 border-violet-400/50 bg-violet-500/20 text-violet-200' : 'border-white/[0.12] text-slate-400'
                        )}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-500 ease-spring"
                      style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[3.4rem] text-[13.5px] leading-relaxed text-slate-400">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
