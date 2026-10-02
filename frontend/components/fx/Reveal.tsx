'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** direction of the entrance */
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
  once?: boolean;
};

const hidden: Record<NonNullable<Props['from']>, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
  scale: 'scale-[0.93]',
};

export default function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.unobserve(el);
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-[900ms] ease-spring will-change-transform',
        shown ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0' : cn('opacity-0 blur-[2px]', hidden[from]),
        className
      )}
    >
      {children}
    </div>
  );
}
