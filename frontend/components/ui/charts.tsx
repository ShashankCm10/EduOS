'use client';

import { useMemo, useState } from 'react';
import { cn, clamp } from '@/lib/utils';

/* ============================================================
   Hand-rolled SVG chart kit — no external chart dependency.
   Every chart is gradient-aware and animates on mount/hover.
   ============================================================ */

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Area / line chart with crosshair tooltip                            */
/* ------------------------------------------------------------------ */
export function AreaChart({
  data,
  height = 260,
  unit = '',
  series = [{ key: 'value', name: 'Value', from: '#7C3AED', to: '#22D3EE' }],
  compare,
  compareName,
  compareColor = '#64748B',
  className,
  yTicks = 4,
}: {
  data: Record<string, any>[];
  height?: number;
  unit?: string;
  series?: { key: string; name: string; from: string; to: string }[];
  compare?: string;
  compareName?: string;
  compareColor?: string;
  className?: string;
  yTicks?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 900;
  const H = height;
  const pad = { t: 18, r: 18, b: 34, l: 40 };

  const all = data.flatMap((d) => series.map((s) => Number(d[s.key]) ?? 0).concat(compare ? [Number(d[compare]) || 0] : []));
  const max = Math.max(...all) * 1.12;
  const min = 0;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * iw;
  const y = (v: number) => pad.t + ih - ((v - min) / (max - min || 1)) * ih;

  const paths = series.map((s) => {
    const pts = data.map((d, i) => [x(i), y(Number(d[s.key]) ?? 0)] as [number, number]);
    return { ...s, line: smoothPath(pts), area: `${smoothPath(pts)} L${x(data.length - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`, pts };
  });
  const cmpPts = compare ? data.map((d, i) => [x(i), y(Number(d[compare]) || 0)] as [number, number]) : null;

  return (
    <div className={cn('relative', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} onMouseLeave={() => setHover(null)}>
        <defs>
          {paths.map((p, i) => (
            <linearGradient key={i} id={`ac-f-${i}-${p.from.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.from} stopOpacity="0.42" />
              <stop offset="100%" stopColor={p.to} stopOpacity="0" />
            </linearGradient>
          ))}
          {paths.map((p, i) => (
            <linearGradient key={`l${i}`} id={`ac-l-${i}-${p.from.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={p.from} />
              <stop offset="100%" stopColor={p.to} />
            </linearGradient>
          ))}
        </defs>

        {/* horizontal grid */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const v = min + ((max - min) / yTicks) * i;
          return (
            <g key={i}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#fff" strokeOpacity={i === 0 ? 0.14 : 0.055} strokeDasharray={i === 0 ? '' : '4 6'} />
              <text x={pad.l - 10} y={y(v) + 4} textAnchor="end" className="fill-slate-500" fontSize="11">
                {Math.round(v)}
              </text>
            </g>
          );
        })}

        {/* x labels */}
        {data.map((d, i) => {
          const every = Math.ceil(data.length / 8);
          if (i % every !== 0 && i !== data.length - 1) return null;
          return (
            <text key={i} x={x(i)} y={H - 12} textAnchor="middle" className="fill-slate-500" fontSize="11">
              {String(d.label ?? d.d ?? d.m ?? '')}
            </text>
          );
        })}

        {cmpPts && (
          <path d={smoothPath(cmpPts)} fill="none" stroke={compareColor} strokeWidth={2} strokeDasharray="6 6" opacity={0.8} />
        )}

        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.area} fill={`url(#ac-f-${i}-${p.from.slice(1)})`} />
            <path
              d={p.line}
              fill="none"
              stroke={`url(#ac-l-${i}-${p.from.slice(1)})`}
              strokeWidth={2.6}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 6px 14px ${p.from}70)` }}
            />
          </g>
        ))}

        {/* hover targets + crosshair */}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="#fff" strokeOpacity={0.28} strokeDasharray="4 4" />
            {paths.map((p, i) => (
              <circle key={i} cx={x(hover)} cy={y(Number(data[hover][p.key]) ?? 0)} r={5} fill="#04050C" stroke={p.to} strokeWidth={2.5} />
            ))}
          </g>
        )}

        {data.map((_, i) => (
          <rect
            key={i}
            x={x(i) - iw / (data.length * 2)}
            y={pad.t}
            width={iw / data.length}
            height={ih}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/[0.02] rounded-xl border border-white/[0.12] bg-ink-900/95 px-3 py-2 text-xs shadow-lift backdrop-blur"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 6 }}
        >
          <div className="mb-1 font-semibold text-slate-300">{String(data[hover].label ?? data[hover].d ?? data[hover].m)}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full" style={{ background: s.to }} />
              <span className="text-slate-400">{s.name}</span>
              <span className="ml-auto font-bold text-white">
                {data[hover][s.key]}
                {unit}
              </span>
            </div>
          ))}
          {compare && (
            <div className="mt-1 flex items-center gap-2 whitespace-nowrap border-t border-white/10 pt-1">
              <span className="h-2 w-2 rounded-full" style={{ background: compareColor }} />
              <span className="text-slate-400">{compareName}</span>
              <span className="ml-auto font-bold text-slate-200">
                {data[hover][compare]}
                {unit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Radar chart                                                         */
/* ------------------------------------------------------------------ */
export function RadarChart({
  axes,
  size = 300,
  aLabel = 'You',
  bLabel = 'Cohort',
  className,
}: {
  axes: { label: string; a: number; b: number }[];
  size?: number;
  aLabel?: string;
  bLabel?: string;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 42;
  const n = axes.length;
  const point = (i: number, r: number) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r] as const;
  };
  const poly = (key: 'a' | 'b') =>
    axes.map((ax, i) => point(i, (clamp(ax[key]) / 100) * R).join(',')).join(' ');

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="rd-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={axes.map((_, i) => point(i, R * f).join(',')).join(' ')}
            fill="none"
            stroke="#fff"
            strokeOpacity={f === 1 ? 0.16 : 0.07}
          />
        ))}
        {axes.map((_, i) => {
          const [px, py] = point(i, R);
          return <line key={i} x1={cx} y1={cy} x2={px} y2={py} stroke="#fff" strokeOpacity={0.07} />;
        })}
        <polygon points={poly('b')} fill="none" stroke="#64748B" strokeWidth={1.6} strokeDasharray="5 5" />
        <polygon points={poly('a')} fill="url(#rd-a)" stroke="#A78BFA" strokeWidth={2.2} style={{ filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.6))' }} />
        {axes.map((ax, i) => {
          const [px, py] = point(i, (clamp(ax.a) / 100) * R);
          return <circle key={i} cx={px} cy={py} r={4} fill="#04050C" stroke="#67E8F9" strokeWidth={2.4} />;
        })}
        {axes.map((ax, i) => {
          const [px, py] = point(i, R + 24);
          return (
            <text key={i} x={px} y={py + 4} textAnchor="middle" fontSize="10.5" className="fill-slate-400 font-semibold">
              {ax.label}
            </text>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center gap-4 text-[11px]">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="h-2 w-2 rounded-full bg-violet-400 shadow-glow" /> {aLabel}
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-slate-500" /> {bLabel}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut                                                               */
/* ------------------------------------------------------------------ */
export function Donut({
  data,
  size = 200,
  thickness = 22,
  center,
  className,
}: {
  data: { label: string; value: number; tone: string }[];
  size?: number;
  thickness?: number;
  center?: React.ReactNode;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={cn('relative grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff" strokeOpacity={0.06} strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.tone}
              strokeWidth={thickness}
              strokeDasharray={`${len - 4} ${c - len + 4}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 10px ${d.tone}66)` }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">{center}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grouped bars                                                        */
/* ------------------------------------------------------------------ */
export function GroupBars({
  data,
  height = 220,
  aName = 'You',
  bName = 'Cohort',
  from = '#7C3AED',
  to = '#22D3EE',
  className,
  unit = '',
}: {
  data: { label: string; a: number; b?: number }[];
  height?: number;
  aName?: string;
  bName?: string;
  from?: string;
  to?: string;
  className?: string;
  unit?: string;
}) {
  const max = Math.max(...data.flatMap((d) => [d.a, d.b ?? 0])) * 1.15 || 1;
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="group flex h-full flex-1 flex-col justify-end gap-1.5">
            <div className="relative flex h-full items-end gap-1">
              <div className="relative flex-1 overflow-hidden rounded-t-lg bg-white/[0.04]">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-lg transition-all duration-1000 ease-spring"
                  style={{ height: `${(d.a / max) * 100}%`, backgroundImage: `linear-gradient(180deg, ${from}, ${to})`, boxShadow: `0 0 24px -6px ${to}` }}
                />
                <span className="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-white/90">
                  {d.a}
                  {unit}
                </span>
              </div>
              {typeof d.b === 'number' && (
                <div className="relative flex-1 overflow-hidden rounded-t-lg bg-white/[0.04]">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-lg bg-slate-500/60 transition-all duration-1000 ease-spring"
                    style={{ height: `${(d.b / max) * 100}%` }}
                  />
                </div>
              )}
            </div>
            <div className="truncate text-center text-[10px] font-semibold text-slate-400 group-hover:text-slate-200">{d.label}</div>
          </div>
        ))}
      </div>
      {data.some((d) => typeof d.b === 'number') && (
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: to }} /> {aName}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-slate-500/70" /> {bName}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Consistency heatmap                                                 */
/* ------------------------------------------------------------------ */
export function Heatmap({ matrix, className }: { matrix: number[][]; className?: string }) {
  const colors = ['rgba(255,255,255,0.055)', 'rgba(124,58,237,0.42)', 'rgba(124,58,237,0.7)', 'rgba(79,70,229,0.85)', 'rgba(34,211,238,0.95)'];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const total = useMemo(() => matrix.flat().reduce((a, b) => a + b, 0), [matrix]);
  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-[5px]">
        <div className="mr-1 flex flex-col gap-[5px] pt-0">
          {days.map((d, i) => (
            <span key={i} className="h-[13px] text-[9px] leading-[13px] text-slate-600">{d}</span>
          ))}
        </div>
        {matrix.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[5px]">
            {week.map((v, di) => (
              <span
                key={di}
                title={`${v * 1.5}h studied`}
                className="h-[13px] w-[13px] rounded-[3px] transition-transform duration-200 hover:scale-[1.35] hover:ring-1 hover:ring-white/40"
                style={{ background: colors[v] }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>12 weeks</span>
        <span className="flex items-center gap-1.5">
          less
          {colors.map((c, i) => (
            <span key={i} className="h-[10px] w-[10px] rounded-[3px]" style={{ background: c }} />
          ))}
          more
        </span>
        <span className="font-semibold text-slate-400">{total} sessions</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gauge (semi-circle)                                                 */
/* ------------------------------------------------------------------ */
export function Gauge({
  value,
  size = 190,
  from = '#7C3AED',
  to = '#22D3EE',
  label,
  sub,
  className,
}: {
  value: number;
  size?: number;
  from?: string;
  to?: string;
  label?: string;
  sub?: string;
  className?: string;
}) {
  const W = size;
  const H = size * 0.62;
  const r = W / 2 - 18;
  const cx = W / 2;
  const cy = H - 6;
  const arc = Math.PI * r;
  const v = clamp(value);
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className={cn('relative grid place-items-center', className)} style={{ width: W, height: H + 6 }}>
      <svg width={W} height={H + 6} viewBox={`0 0 ${W} ${H + 6}`}>
        <defs>
          <linearGradient id={`gg-${from.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="#fff" strokeOpacity={0.09} strokeWidth={16} strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke={`url(#gg-${from.slice(1)})`}
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={arc}
          strokeDashoffset={arc - (v / 100) * arc}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 14px ${to}66)` }}
        />
      </svg>
      <div className="absolute bottom-1 text-center">
        <div className="font-display text-3xl font-extrabold text-white">{label ?? v}</div>
        {sub && <div className="text-[10px] uppercase tracking-widest text-slate-500">{sub}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked horizontal bar (single row)                                 */
/* ------------------------------------------------------------------ */
export function StackedBar({
  data,
  height = 12,
  className,
}: {
  data: { label: string; value: number; tone: string }[];
  height?: number;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className={cn('w-full', className)}>
      <div className="flex w-full overflow-hidden rounded-full bg-white/[0.05]" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={i}
            title={`${d.label}: ${Math.round((d.value / total) * 100)}%`}
            style={{ width: `${(d.value / total) * 100}%`, background: d.tone, boxShadow: `0 0 18px -4px ${d.tone}` }}
            className="h-full transition-all duration-1000 ease-spring first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ background: d.tone }} />
            {d.label}
            <span className="font-bold text-slate-200">{Math.round((d.value / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
