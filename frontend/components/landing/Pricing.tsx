'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Sparkles, Minus, GraduationCap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/fx/Reveal';
import { SectionHead } from '@/components/ui/core';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Everything a single semester needs.',
    monthly: 0,
    yearly: 0,
    cta: 'Start free',
    highlight: false,
    features: [
      { t: '3 active courses', on: true },
      { t: 'Unlimited notes & materials', on: true },
      { t: 'Timetable + study planner', on: true },
      { t: 'Progress analytics', on: true },
      { t: '30 AI tutor messages / month', on: true },
      { t: 'RAG over PDFs', on: false },
      { t: 'Adaptive mock papers', on: false },
      { t: 'Offline mode', on: false },
    ],
  },
  {
    id: 'pro',
    name: 'Scholar',
    tagline: 'For students who intend to top their cohort.',
    monthly: 399,
    yearly: 3190,
    cta: 'Go Scholar',
    highlight: true,
    features: [
      { t: 'Unlimited courses', on: true },
      { t: 'Unlimited notes & materials', on: true },
      { t: 'Timetable + autonomous replanner', on: true },
      { t: 'Deep analytics + cohort comparison', on: true },
      { t: 'Unlimited AI tutor + RAG citations', on: true },
      { t: 'Adaptive mock papers & drills', on: true },
      { t: 'Offline mode + PDF exports', on: true },
      { t: 'Flashcard decks with spaced repetition', on: true },
    ],
  },
  {
    id: 'campus',
    name: 'Campus',
    tagline: 'For study groups, clubs and hostel floors.',
    monthly: 299,
    yearly: 2390,
    perSeat: true,
    cta: 'Talk to us',
    highlight: false,
    features: [
      { t: 'Everything in Scholar', on: true },
      { t: 'Shared materials & group decks', on: true },
      { t: 'Peer quiz ladders', on: true },
      { t: 'Group streaks & accountability', on: true },
      { t: 'Mentor review slots', on: true },
      { t: 'Priority AI capacity', on: true },
      { t: 'SSO for campus groups', on: false },
      { t: 'Custom integrations', on: false },
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHead
            eyebrow="Pricing"
            title={
              <>
                Cheaper than one textbook.
                <br />
                <span className="grad-text-brand">Built to outlast your degree.</span>
              </>
            }
            sub="Students pay, institutions do not. No seat licences, no procurement, no admin dashboards. Cancel the day it stops helping."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button
                onClick={() => setYearly(false)}
                className={cn('rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all duration-300', !yearly ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white')}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn('rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all duration-300', yearly ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white')}
              >
                Yearly
              </button>
            </div>
            <span className="chip chip-emerald">Save 33% · 4 months free</span>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => {
            const price = yearly ? t.yearly : t.monthly;
            const perMonth = yearly ? Math.round(t.yearly / 12) : t.monthly;
            return (
              <Reveal key={t.id} delay={i * 110} from="scale">
                <div
                  className={cn(
                    'relative h-full overflow-hidden rounded-[1.5rem] transition-all duration-500 ease-spring hover:-translate-y-2',
                    t.highlight
                      ? 'aura-border p-[1.5px] shadow-[0_50px_120px_-45px_rgba(124,58,237,1)]'
                      : 'border border-white/[0.09] bg-white/[0.028]'
                  )}
                >
                  {t.highlight && (
                    <div className="absolute left-1/[0.02] top-0 z-20 -translate-x-1/[0.02] rounded-b-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                      Most chosen
                    </div>
                  )}
                  <div className={cn('h-full rounded-[1.45rem] p-6 sm:p-7', t.highlight && 'bg-ink-900/[0.92] backdrop-blur-xl', t.highlight && 'pt-9')}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-extrabold text-white">{t.name}</h3>
                      {t.highlight && (
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
                          <Sparkles className="h-3.5 w-3.5 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[12.5px] text-slate-400">{t.tagline}</p>

                    <div className="mt-6 flex items-end gap-1.5">
                      <span className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-white">
                        {price === 0 ? 'Free' : `₹${perMonth.toLocaleString('en-IN')}`}
                      </span>
                      {price !== 0 && <span className="pb-1 text-[12.5px] text-slate-400">/ month{t.perSeat ? ' per seat' : ''}</span>}
                    </div>
                    {price !== 0 && (
                      <div className="mt-1.5 text-[11.5px] text-slate-500">
                        {yearly ? `Billed ₹${t.yearly.toLocaleString('en-IN')} yearly` : 'Billed monthly · cancel anytime'}
                      </div>
                    )}
                    {price === 0 && <div className="mt-1.5 text-[11.5px] text-slate-500">Forever. Verify with your student email.</div>}

                    <Link
                      href="/signup"
                      className={cn('btn btn-lg mt-6 w-full', t.highlight ? 'btn-primary shine' : 'btn-ghost')}
                    >
                      {t.cta}
                    </Link>

                    <div className="my-6 divider-grad" />

                    <ul className="space-y-2.5">
                      {t.features.map((f) => (
                        <li key={f.t} className={cn('flex items-start gap-2.5 text-[12.5px]', f.on ? 'text-slate-300' : 'text-slate-600')}>
                          <span className={cn('mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full', f.on ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-slate-600')}>
                            {f.on ? <Check className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                          </span>
                          {f.t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[12px] text-slate-400">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-300" /> Verified students get Scholar at 50% off for their first year
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 30-day refund, no questions asked
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
