import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/fx/Reveal';

export default function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal>
      <div className={cn('mb-7 flex flex-wrap items-end justify-between gap-5', className)}>
        <div className="min-w-0">
          {eyebrow && <div className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</div>}
          <h1 className="display-xl text-[clamp(1.6rem,3.4vw,2.5rem)] text-white">{title}</h1>
          {sub && <p className="mt-3 max-w-2xl text-pretty text-[14px] leading-relaxed text-slate-400">{sub}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </Reveal>
  );
}
