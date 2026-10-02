import { cn, clamp, type GradientKey } from '@/lib/utils';
import type { ReactNode } from 'react';

/* ---------------- Badge / chip ---------------- */
export function Chip({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'pink';
  className?: string;
}) {
  const tones = {
    default: '',
    violet: 'chip-violet',
    cyan: 'chip-cyan',
    emerald: 'chip-emerald',
    amber: 'chip-amber',
    pink: 'chip-pink',
  };
  return <span className={cn('chip', tones[tone], className)}>{children}</span>;
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  eyebrow,
  title,
  sub,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <div className={cn('mb-4 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-violet-400/70" />
          <span className="eyebrow text-violet-300/90">{eyebrow}</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/70" />
        </div>
      )}
      <h2 className="display-xl text-balance text-[clamp(1.9rem,4.4vw,3.4rem)] text-white">{title}</h2>
      {sub && <p className="mt-5 text-pretty text-[15px] leading-relaxed text-slate-400 sm:text-base">{sub}</p>}
    </div>
  );
}

/* ---------------- Circular progress ---------------- */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  from = '#7C3AED',
  to = '#22D3EE',
  label,
  sub,
  className,
  trackOpacity = 0.12,
}: {
  value: number;
  size?: number;
  stroke?: number;
  from?: string;
  to?: string;
  label?: ReactNode;
  sub?: ReactNode;
  className?: string;
  trackOpacity?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = clamp(value);
  const id = `ring-${from.replace('#', '')}-${to.replace('#', '')}-${size}`;
  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff" strokeOpacity={trackOpacity} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <div className="font-display text-lg font-bold leading-none text-white">{label ?? `${Math.round(v)}%`}</div>
        {sub && <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------- Linear progress ---------------- */
export function ProgressBar({
  value,
  className,
  from = '#7C3AED',
  to = '#22D3EE',
  height = 8,
}: {
  value: number;
  className?: string;
  from?: string;
  to?: string;
  height?: number;
}) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-white/[0.07]', className)} style={{ height }}>
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-spring"
        style={{ width: `${clamp(value)}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({
  data,
  className,
  from = '#A78BFA',
  to = '#22D3EE',
  width = 120,
  height = 36,
}: {
  data: number[];
  className?: string;
  from?: string;
  to?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => [i * step, height - ((d - min) / span) * (height - 6) - 3] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const id = `sp-${from.slice(1)}-${to.slice(1)}-${data.length}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0.35" />
          <stop offset="100%" stopColor={to} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id}-f)`} />
      <path d={line} fill="none" stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.6} fill="#fff" />
    </svg>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  name,
  size = 40,
  tone = 'violet',
  className,
  ring = true,
}: {
  name: string;
  size?: number;
  tone?: 'violet' | 'cyan' | 'amber' | 'emerald' | 'pink';
  className?: string;
  ring?: boolean;
}) {
  const tones = {
    violet: 'from-violet-500 to-indigo-600',
    cyan: 'from-cyan-400 to-sky-600',
    amber: 'from-amber-400 to-orange-600',
    emerald: 'from-emerald-400 to-teal-600',
    pink: 'from-fuchsia-500 to-pink-600',
  };
  const ini = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-display font-bold text-white',
        tones[tone],
        ring && 'ring-2 ring-white/15',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {ini}
    </span>
  );
}

/* ---------------- Segmented control ---------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div className={cn('inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full font-semibold transition-all duration-300 ease-spring',
            size === 'sm' ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs',
            value === o.value
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_6px_24px_-8px_rgba(124,58,237,0.9)]'
              : 'text-slate-400 hover:text-slate-100'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Stat tile ---------------- */
export function StatTile({
  label,
  value,
  delta,
  icon,
  tone = 'violet',
  spark,
  suffix,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  icon?: ReactNode;
  tone?: GradientKey;
  spark?: number[];
  suffix?: string;
  className?: string;
}) {
  const map = {
    violet: { g: 'from-violet-500 to-indigo-600', s: ['#A78BFA', '#818CF8'] },
    cyan: { g: 'from-cyan-400 to-sky-600', s: ['#67E8F9', '#38BDF8'] },
    emerald: { g: 'from-emerald-400 to-teal-600', s: ['#6EE7B7', '#2DD4BF'] },
    amber: { g: 'from-amber-400 to-orange-600', s: ['#FCD34D', '#FB923C'] },
    pink: { g: 'from-fuchsia-500 to-pink-600', s: ['#F0ABFC', '#F472B6'] },
    rose: { g: 'from-rose-400 to-red-600', s: ['#FDA4AF', '#F87171'] },
    lime: { g: 'from-lime-400 to-emerald-600', s: ['#BEF264', '#34D399'] },
    blue: { g: 'from-blue-500 to-violet-600', s: ['#93C5FD', '#A78BFA'] },
  }[tone];

  return (
    <div className={cn('panel card-hover relative overflow-hidden p-5', className)}>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl"
        style={{ background: `linear-gradient(135deg, ${map.s[0]}, ${map.s[1]})` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="mt-2 flex items-end gap-1.5">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">{value}</span>
            {suffix && <span className="pb-1 text-xs font-semibold text-slate-400">{suffix}</span>}
          </div>
        </div>
        {icon && (
          <span className={cn('grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg', map.g)}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {typeof delta === 'number' && (
          <span
            className={cn(
              'chip',
              delta >= 0 ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300' : 'border-pink-400/25 bg-pink-500/10 text-pink-300'
            )}
          >
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
        )}
        {spark && <Sparkline data={spark} from={map.s[0]} to={map.s[1]} width={92} height={30} className="opacity-90" />}
      </div>
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ icon, title, sub, action }: { icon?: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="panel grid place-items-center px-8 py-14 text-center">
      {icon && <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-slate-400">{icon}</div>}
      <h4 className="font-display text-lg font-bold text-white">{title}</h4>
      {sub && <p className="mt-2 max-w-sm text-sm text-slate-400">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
