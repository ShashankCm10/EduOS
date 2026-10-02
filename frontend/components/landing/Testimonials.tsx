import { Star, Quote, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Marquee from '@/components/fx/Marquee';
import Reveal from '@/components/fx/Reveal';
import { SectionHead } from '@/components/ui/core';

type T = { q: string; n: string; r: string; tone: string; metric?: string };

const ROW_A: T[] = [
  { q: 'I used to keep 6 browser windows open. EduOS replaced all of them, and the AI actually cites my professor’s slides instead of making things up.', n: 'Ishita Verma', r: 'BITS Pilani · CSE', tone: 'from-amber-400 to-orange-600', metric: 'CGPA 8.1 → 9.2' },
  { q: 'The adaptive quizzes found two topics I had been silently faking. Fixed both in a week and aced the mid-sem.', n: 'Rahul Nair', r: 'NIT Trichy · ECE', tone: 'from-violet-500 to-indigo-600', metric: 'Mid-sem +22%' },
  { q: 'My planner re-solved itself when I lost 6 hours to a hackathon. Nothing slipped. That is genuinely new.', n: 'Sneha Pillai', r: 'VIT Vellore · IT', tone: 'from-cyan-400 to-sky-600', metric: '0 missed deadlines' },
  { q: 'The 12-week heatmap was brutal and honest. It showed me every Wednesday I wasted, and I fixed it.', n: 'Kabir Anand', r: 'IIIT Hyderabad · CSE', tone: 'from-emerald-400 to-teal-600', metric: 'Focus 54 → 86' },
  { q: 'I uploaded 3 semesters of scanned notes. It read the handwriting, tagged the topics and built flashcards from them.', n: 'Meera Krishnan', r: 'PSG Tech · Mech', tone: 'from-fuchsia-500 to-pink-600', metric: '2,100 pages indexed' },
];

const ROW_B: T[] = [
  { q: 'As a final year student, the exam-readiness score is scarily accurate. It predicted my mock result within 3 marks.', n: 'Devansh Gupta', r: 'DTU · CSE', tone: 'from-sky-400 to-blue-600', metric: 'GATE mock 62 → 71' },
  { q: 'Streak tracking sounds gimmicky until it is day 40 and you cannot bear to break it. Best study habit I have ever built.', n: 'Tanvi Desai', r: 'Manipal · Biotech', tone: 'from-amber-400 to-rose-600', metric: '41-day streak' },
  { q: 'The AI tutor does not just answer — it makes me answer first. My retention went up measurably.', n: 'Arjun Rathore', r: 'COEP · Civil', tone: 'from-violet-500 to-fuchsia-600', metric: 'Recall +31%' },
  { q: 'I run it in the library with no signal. Offline-first was clearly designed by people who actually study.', n: 'Nikita Shah', r: 'SRM · EEE', tone: 'from-emerald-400 to-lime-600', metric: 'Works offline' },
  { q: 'Assignment weighting told me which five submissions actually mattered. I stopped optimising the wrong ones.', n: 'Rohan Iyer', r: 'Amrita · CSE', tone: 'from-indigo-400 to-violet-600', metric: 'Top 5% of cohort' },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/[0.03] -z-10 h-72 bg-gradient-to-r from-violet-600/10 via-fuchsia-500/10 to-cyan-500/10 blur-[100px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHead
            eyebrow="Loved by students, ignored by admins"
            title={
              <>
                61,400 students. <span className="grad-text-brand">Zero classroom management.</span>
              </>
            }
            sub="EduOS is deliberately student-only. It does not report to your institution, it does not monitor you, and it never grades you. It works for exactly one person: you."
          />
        </Reveal>
      </div>

      <div className="mt-14 space-y-4">
        <Marquee speed="slow">
          {ROW_A.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </Marquee>
        <Marquee speed="slow" reverse>
          {ROW_B.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: '4.9/5', l: 'Average rating', s: 'from 3,204 reviews' },
            { n: '91%', l: 'Still active after 6 months', s: 'vs 34% industry norm' },
            { n: '18%', l: 'Average grade lift', s: 'self-reported, one term' },
          ].map((x, i) => (
            <Reveal key={x.l} delay={i * 90}>
              <div className="panel flex items-center gap-5 p-6">
                <div className="font-display text-3xl font-extrabold grad-text">{x.n}</div>
                <div>
                  <div className="text-[13.5px] font-bold text-white">{x.l}</div>
                  <div className="text-[11.5px] text-slate-500">{x.s}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ t }: { t: T }) {
  return (
    <figure className="panel relative w-[340px] shrink-0 overflow-hidden p-5 sm:w-[400px]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.05] blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-amber-400">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <Quote className="h-4 w-4 text-slate-600" />
      </div>
      <blockquote className="mt-3.5 text-[13.5px] leading-relaxed text-slate-300">{t.q}</blockquote>
      {t.metric && <div className="mt-3 inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-bold text-emerald-300">{t.metric}</div>}
      <figcaption className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-4">
        <span className={cn('grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white', t.tone)}>
          {t.n.split(' ').map((x) => x[0]).join('')}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-white">
            {t.n} <BadgeCheck className="h-3.5 w-3.5 text-cyan-400" />
          </span>
          <span className="block truncate text-[11px] text-slate-500">{t.r}</span>
        </span>
      </figcaption>
    </figure>
  );
}
