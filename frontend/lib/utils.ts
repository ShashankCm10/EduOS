import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export function fmtDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-IN', opts ?? { day: 'numeric', month: 'short' });
}

export function daysUntil(iso: string) {
  const target = new Date(iso + 'T00:00:00').getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

export function nf(n: number, digits = 0) {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Deterministic pseudo-random so server & client markup always agree. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const GRADIENTS = {
  violet: 'from-violet-500 to-indigo-500',
  cyan: 'from-cyan-400 to-sky-500',
  emerald: 'from-emerald-400 to-teal-500',
  amber: 'from-amber-400 to-orange-500',
  pink: 'from-fuchsia-500 to-pink-500',
  rose: 'from-rose-400 to-red-500',
  lime: 'from-lime-400 to-emerald-500',
  blue: 'from-blue-500 to-violet-500',
} as const;

export type GradientKey = keyof typeof GRADIENTS;

/* ---------------- Shared tone system ---------------- */
export const TONE_GRADIENT: Record<GradientKey, string> = {
  violet: 'from-violet-500 to-indigo-600',
  cyan: 'from-cyan-400 to-sky-600',
  emerald: 'from-emerald-400 to-teal-600',
  amber: 'from-amber-400 to-orange-600',
  pink: 'from-fuchsia-500 to-pink-600',
  rose: 'from-rose-400 to-red-600',
  lime: 'from-lime-400 to-emerald-600',
  blue: 'from-blue-500 to-violet-600',
};

export const TONE_BAR: Record<GradientKey, string> = {
  violet: 'from-violet-500 to-indigo-400',
  cyan: 'from-cyan-400 to-sky-400',
  emerald: 'from-emerald-400 to-teal-400',
  amber: 'from-amber-400 to-orange-400',
  pink: 'from-fuchsia-500 to-pink-400',
  rose: 'from-rose-400 to-red-400',
  lime: 'from-lime-400 to-emerald-400',
  blue: 'from-blue-500 to-violet-500',
};

export const TONE_HEX: Record<GradientKey, [string, string]> = {
  violet: ['#8B5CF6', '#6366F1'],
  cyan: ['#22D3EE', '#0EA5E9'],
  emerald: ['#34D399', '#14B8A6'],
  amber: ['#FBBF24', '#FB923C'],
  pink: ['#E879F9', '#EC4899'],
  rose: ['#FB7185', '#EF4444'],
  lime: ['#A3E635', '#10B981'],
  blue: ['#3B82F6', '#8B5CF6'],
};

export function toneGrad(k?: string) {
  return TONE_GRADIENT[(k as GradientKey) ?? 'violet'] ?? TONE_GRADIENT.violet;
}
export function toneBar(k?: string) {
  return TONE_BAR[(k as GradientKey) ?? 'violet'] ?? TONE_BAR.violet;
}
export function toneHex(k?: string) {
  return TONE_HEX[(k as GradientKey) ?? 'violet'] ?? TONE_HEX.violet;
}
