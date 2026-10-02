'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();

  // No default/demo credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('That email does not look right.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://127.0.0.1:8001/auth/login',
        {
          method: 'POST',
          headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({
  email: cleanEmail,
  password,
}),
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const detail = data?.detail;

        // FastAPI validation errors
        if (Array.isArray(detail)) {
          const message = detail
            .map((item) => {
              if (typeof item === 'string') {
                return item;
              }

              return item?.msg || JSON.stringify(item);
            })
            .join(', ');

          throw new Error(message || 'Invalid login details.');
        }

        // Structured backend error
        if (
          typeof detail === 'object' &&
          detail !== null
        ) {
          throw new Error(
            detail.message ||
              detail.msg ||
              JSON.stringify(detail)
          );
        }

        // Normal FastAPI error
        throw new Error(
          typeof detail === 'string'
            ? detail
            : 'Invalid email or password.'
        );
      }

      if (!data?.access_token) {
        throw new Error(
          'Login succeeded, but the server did not return an authentication token.'
        );
      }

      /*
       * Store authentication token.
       *
       * Remember me ON:
       *   localStorage
       *
       * Remember me OFF:
       *   sessionStorage
       */
      const storage = remember
        ? localStorage
        : sessionStorage;

      storage.setItem(
        'eduos_token',
        data.access_token
      );

      // Optional cleanup of any old demo token
      if (remember) {
        sessionStorage.removeItem('eduos_token');
      } else {
        localStorage.removeItem('eduos_token');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout mode="login">
      <div className="animate-fade-up">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-[1.9rem] font-extrabold tracking-tight text-white">
            Sign in to EduOS
          </h1>

          <p className="mt-2 text-[13.5px] text-slate-400">
            New here?{' '}
            <Link
              href="/signup"
              className="font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              Create a free workspace
            </Link>
          </p>
        </div>

        {/* Google / SSO */}
        <div className="mb-5 grid grid-cols-2 gap-2.5">
          {[
            { l: 'Google', i: Mail },
            { l: 'Student SSO', i: Fingerprint },
          ].map((p) => (
            <button
              key={p.l}
              type="button"
              onClick={() =>
                setError(
                  `${p.l} sign-in is not connected yet.`
                )
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] text-[13px] font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
            >
              <p.i className="h-4 w-4" />
              {p.l}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/[0.09]" />

          <span className="text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
            or with email
          </span>

          <span className="h-px flex-1 bg-white/[0.09]" />
        </div>

        {/* Login Form */}
        <form
          onSubmit={submit}
          className="space-y-4"
        >

          {/* Email */}
          <Field
            label="Student email"
            icon={<Mail className="h-4 w-4" />}
          >
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              type="email"
              placeholder="you@university.edu"
              autoComplete="email"
              className="h-12 w-full bg-transparent pl-11 pr-3 text-[14px] text-white outline-none"
            />
          </Field>

          {/* Password */}
          <Field
            label="Password"
            icon={<Lock className="h-4 w-4" />}
          >
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-12 w-full bg-transparent pl-11 pr-11 text-[14px] text-white outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShow((v) => !v)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
              aria-label={
                show
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </Field>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setRemember((v) => !v)
              }
              className="flex items-center gap-2.5 text-[12.5px] text-slate-400 transition hover:text-slate-200"
            >
              <span
                className={cn(
                  'grid h-4.5 w-4.5 place-items-center rounded-md border transition-all',
                  remember
                    ? 'border-violet-400/60 bg-violet-500/30 text-white'
                    : 'border-white/20'
                )}
                style={{
                  width: 18,
                  height: 18,
                }}
              >
                {remember && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
              </span>

              Keep me signed in for 30 days
            </button>

            <button
              type="button"
              onClick={() =>
                setError(
                  'Password recovery is not connected yet.'
                )
              }
              className="cursor-pointer text-[12.5px] font-semibold text-slate-400 hover:text-white"
            >
              Forgot?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-pink-400/30 bg-pink-500/[0.1] px-3.5 py-2.5 text-[12.5px] text-pink-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg btn-primary shine w-full"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Unlocking your workspace…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Workspace */}
        <button
          type="button"
          onClick={demoLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-3 text-[12.5px] font-semibold text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
        >
          <GraduationCap className="h-4 w-4" />
          Explore the demo workspace without an account
        </button>

        {/* Privacy */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />

          <p className="text-[11.5px] leading-relaxed text-slate-400">
            EduOS verifies student emails but never shares
            your data with your institution. There is no
            admin dashboard — by design.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <span className="relative block rounded-xl border border-white/[0.09] bg-white/[0.035] transition focus-within:border-violet-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>

        {children}
      </span>
    </label>
  );
}