'use client';

import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Pointer-reactive 3D tilt with a moving specular highlight. */
export default function TiltCard({
  children,
  className,
  intensity = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const spec = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    const card = inner.current;
    if (!el || !card) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * intensity * 2;
    const ry = (px - 0.5) * intensity * 2;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (spec.current) {
      spec.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.16), transparent 55%)`;
    }
  };

  const reset = () => {
    const card = inner.current;
    if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (spec.current) spec.current.style.background = 'transparent';
  };

  return (
    <div ref={wrap} className={cn('perspective', className)} onPointerMove={onMove} onPointerLeave={reset}>
      <div
        ref={inner}
        className="preserve-3d h-full transition-transform duration-500 ease-spring"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {glare && <div ref={spec} className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300" />}
        {children}
      </div>
    </div>
  );
}
