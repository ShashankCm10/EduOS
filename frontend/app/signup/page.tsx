'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  School,
  GraduationCap,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { cn } from '@/lib/utils';

const INTERESTS = [
  'GATE 2026', 'Placements', 'Research paper', 'Machine Learning', 'Competitive coding',
  'Higher studies', 'Core internships', 'Startup', 'Design', 'Semester topper',
];

const PROGRAMS = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mech', 'B.Sc CS', 'BCA', 'M.Tech', 'MBA', 'Other'];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    program: 'B.Tech CSE',
    semester: '5',
  });
  const [picked, setPicked] = useState<string[]>(['Placements', 'GATE 2026']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const strength = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, [form.password]);

  const strengthMeta = [
    { l: 'Too short', c: 'from-pink-500 to-rose-600', t: 'text-pink-300' },
    { l: 'Weak', c: 'from-pink-500 to-orange-500', t: 'text-orange-300' },
    { l: 'Fair', c: 'from-amber-400 to-yellow-500', t: 'text-amber-300' },
    { l: 'Strong', c: 'from-emerald-400 to-teal-500', t: 'text-emerald-300' },
    { l: 'Excellent', c: 'from-cyan-400 to-violet-500', t: 'text-cyan-300' },
  ][strength];

  const canNext = form.name.trim().length > 1 && form.email.includes('@') && form.password.length >= 8;
  const canFinish = canNext && form.university.trim().length > 1;

  const handleSignup = async () => {
  if (!canFinish || loading) return;

  setLoading(true);
  setError('');

  try {
    const response = await fetch('http://127.0.0.1:8001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail || 'Unable to create your account.'
      );
    }

    router.push('/login');
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Unable to create your account.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout mode="signup">
      <div className="animate-fade-up">
        {/* stepper */}
        <div className="mb-7 flex items-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold transition-all duration-500',
                  step >= s ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-glow' : 'border border-white/12 bg-white/[0.04] text-slate-500'
                )}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
              <span className={cn('text-[12px] font-semibold', step >= s ? 'text-white' : 'text-slate-500')}>
                {s === 1 ? 'Your account' : 'Your semester'}
              </span>
              {s === 1 && <span className="h-px flex-1 bg-white/[0.1]" />}
            </div>
          ))}
        </div>

        <h1 className="font-display text-[1.9rem] font-extrabold tracking-tight text-white">
          {step === 1 ? 'Create your account' : 'Set up your semester'}
        </h1>
        <p className="mt-2 text-[13.5px] text-slate-400">
          {step === 1 ? (
            <>
              Already have a workspace?{' '}
              <Link href="/login" className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200">
                Sign in
              </Link>
            </>
          ) : (
            'This is how EduOS builds your topic graph. It stays private to you.'
          )}
        </p>

        <div className="mt-7">
          {step === 1 ? (
            <div className="space-y-4 animate-fade-up">
              <FormField label="Full name" icon={<User className="h-4 w-4" />}>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Aarav Mehta"
                  className="h-12 w-full bg-transparent pl-11 pr-3 text-[14px] text-white"
                />
              </FormField>

              <FormField label="Student email" icon={<Mail className="h-4 w-4" />}>
                <input
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  type="email"
                  placeholder="you@university.edu"
                  className="h-12 w-full bg-transparent pl-11 pr-3 text-[14px] text-white"
                />
              </FormField>

              <FormField label="Password" icon={<Lock className="h-4 w-4" />}>
                <input
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  type={show ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className="h-12 w-full bg-transparent pl-11 pr-11 text-[14px] text-white"
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </FormField>

              {form.password.length > 0 && (
                <div className="animate-fade-up">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-all duration-500',
                          i < strength ? `bg-gradient-to-r ${strengthMeta.c}` : 'bg-white/[0.08]'
                        )}
                      />
                    ))}
                  </div>
                  <div className={cn('mt-1.5 text-[11px] font-semibold', strengthMeta.t)}>
                    {strengthMeta.l} — add symbols and capitals for a top score
                  </div>
                </div>
              )}

              <button onClick={() => canNext && setStep(2)} disabled={!canNext} className="btn btn-lg btn-primary w-full">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[11px] leading-relaxed text-slate-500">
                By continuing you agree to the Terms and Privacy Policy. Your notes are never used to train public models.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-up">
              <FormField label="University / College" icon={<School className="h-4 w-4" />}>
                <input
                  value={form.university}
                  onChange={(e) => set('university', e.target.value)}
                  placeholder="e.g. RV College of Engineering"
                  className="h-12 w-full bg-transparent pl-11 pr-3 text-[14px] text-white"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Program</span>
                  <select
                    value={form.program}
                    onChange={(e) => set('program', e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-ink-800/80 px-3 text-[13px] text-white"
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Semester</span>
                  <select
                    value={form.semester}
                    onChange={(e) => set('semester', e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-ink-800/80 px-3 text-[13px] text-white"
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  What are you working towards?
                </span>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((t) => {
                    const on = picked.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPicked((p) => (on ? p.filter((x) => x !== t) : [...p, t]))}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-all duration-300',
                          on
                            ? 'border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_8px_22px_-10px_rgba(124,58,237,1)]'
                            : 'border-white/12 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white'
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2.5 text-[11px] text-slate-500">{picked.length} selected · you can change this later</p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Student-only by design
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {['No admin or teacher access, ever', 'Export or delete everything in one click', 'Works offline in the library'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[11.5px] text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2.5">
                <button onClick={() => setStep(1)} className="btn btn-lg btn-ghost shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSignup}
                  disabled={!canFinish}
                  className="btn btn-lg btn-primary shine flex-1"
                >
                  <GraduationCap className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                  Build my workspace
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
          <p className="text-[11.5px] leading-relaxed text-slate-400">
            After signup you can import a syllabus PDF, a timetable photo, or pick a template for your university — setup takes about
            two minutes.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <span className="relative block rounded-xl border border-white/[0.09] bg-white/[0.035] transition focus-within:border-violet-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        {children}
      </span>
    </label>
  );
}
