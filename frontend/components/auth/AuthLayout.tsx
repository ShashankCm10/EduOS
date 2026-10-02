import Link from 'next/link';
import type { ReactNode } from 'react';
import { GraduationCap, Sparkles, ShieldCheck, Star, TrendingUp, Flame } from 'lucide-react';
import Aurora from '@/components/fx/Aurora';

export default function AuthLayout({
  children,
  mode,
}: {
  children: ReactNode;
  mode: 'login' | 'signup';
}) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <Aurora variant="default" />

      {/* ---------------- form side ---------------- */}
      <div className="relative flex flex-col px-5 py-8 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-glow">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            Edu<span className="grad-text">OS</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[27rem]">{children}</div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-slate-500">
          <span>© {new Date().getFullYear()} EduOS Labs</span>
          <span className="flex gap-4">
            <span className="cursor-pointer hover:text-slate-300">Privacy</span>
            <span className="cursor-pointer hover:text-slate-300">Terms</span>
            <Link href="/dashboard" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Skip to demo →
            </Link>
          </span>
        </div>
      </div>

      {/* ---------------- showcase side ---------------- */}
      <div className="relative hidden overflow-hidden border-l border-white/[0.07] lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/25 via-ink-900/50 to-cyan-600/20" />
        <div aria-hidden className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_70%)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/4 h-[34rem] w-[34rem] rounded-full bg-grad-ring opacity-20 blur-[110px] animate-spin-slower"
        />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-14">
          <div>
            <span className="chip chip-violet">
              <Sparkles className="h-3 w-3" /> {mode === 'login' ? 'Welcome back' : 'Free for one semester'}
            </span>
            <h2 className="display-xl mt-6 max-w-md text-[clamp(1.8rem,3vw,2.6rem)] text-white">
              {mode === 'login' ? (
                <>
                  Pick up exactly
                  <br />
                  where you <span className="grad-text">stopped</span>
                </>
              ) : (
                <>
                  Your semester,
                  <br />
                  finally <span className="grad-text">organised</span>
                </>
              )}
            </h2>
            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-slate-400">
              {mode === 'login'
                ? 'Your streak, your plan and your tutor memory are all waiting. Two weeks of spaced repetition will not re-schedule itself.'
                : 'Import your syllabus tonight. Tomorrow morning you get a plan you can actually follow — with an AI tutor that cites your own notes.'}
            </p>
          </div>

          {/* floating stat cards */}
          <div className="relative my-8 h-[19rem]">
            <FloatCard className="left-0 top-2 w-56" tone="from-violet-500 to-indigo-600" icon={<TrendingUp className="h-4 w-4 text-white" />} label="Focus score" value="82" sub="+14 this month" delay="-1s" />
            <FloatCard className="left-24 top-32 w-60" tone="from-cyan-400 to-sky-600" icon={<Sparkles className="h-4 w-4 text-white" />} label="Tutor citations" value="86" sub="all page-accurate" delay="-6s" />
            <FloatCard className="right-2 top-16 w-56" tone="from-amber-400 to-orange-600" icon={<Flame className="h-4 w-4 text-white" />} label="Current streak" value="26d" sub="best 41 days" delay="-11s" />

            {/* mini chart card */}
            <div className="absolute bottom-0 left-1/2 w-[22rem] -translate-x-1/2 rounded-2xl border border-white/12 bg-ink-900/80 p-4 backdrop-blur-xl animate-float" style={{ animationDelay: '-8s' }}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300">Study hours · last 7 days</span>
                <span className="font-bold text-emerald-300">+18%</span>
              </div>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[2.4, 4.1, 1.8, 5.6, 4.9, 6.1, 4.6].map((h, i) => (
                  <div key={i} className="flex-1 overflow-hidden rounded-t-md bg-white/[0.05]">
                    <div className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400" style={{ height: `${(h / 6.5) * 100}%`, marginTop: 'auto' }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-slate-500">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex gap-0.5 text-amber-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
              “I stopped maintaining a notes folder. Everything quotes itself back to me with the page number.”
            </p>
            <div className="mt-3.5 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-[10px] font-bold text-white">IV</span>
              <div>
                <div className="text-[12px] font-bold text-white">Ishita Verma</div>
                <div className="text-[10.5px] text-slate-500">BITS Pilani · CSE 3rd year</div>
              </div>
              <span className="ml-auto chip chip-emerald">
                <ShieldCheck className="h-3 w-3" /> Verified student
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatCard({
  className,
  tone,
  icon,
  label,
  value,
  sub,
  delay,
}: {
  className?: string;
  tone: string;
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute rounded-2xl border border-white/12 bg-ink-900/85 p-3.5 backdrop-blur-xl animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${tone}`}>{icon}</span>
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <div className="mt-2.5 font-display text-xl font-extrabold text-white">{value}</div>
      <div className="text-[10.5px] text-slate-500">{sub}</div>
    </div>
  );
}
