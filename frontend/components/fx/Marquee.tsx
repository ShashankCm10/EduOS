import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export default function Marquee({
  children,
  className,
  speed = 'normal',
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  reverse?: boolean;
}) {
  const anim = speed === 'fast' ? 'animate-marquee-fast' : speed === 'slow' ? 'animate-[marquee_70s_linear_infinite]' : 'animate-marquee';
  return (
    <div className={cn('group relative flex overflow-hidden mask-fade-x', className)}>
      <div
        className={cn('flex w-max shrink-0 items-center gap-4 group-hover:[animation-play-state:paused]', anim)}
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
