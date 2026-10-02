'use client';

import { useEffect, useRef } from 'react';

/** Soft gradient light that follows the pointer. Desktop-only, zero layout cost. */
export default function CursorSpotlight({ size = 560 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (raf.current == null) loop();
    };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (el) {
        el.style.transform = `translate3d(${current.current.x - size / 2}px, ${current.current.y - size / 2}px, 0)`;
      }
      const dx = Math.abs(target.current.x - current.current.x);
      const dy = Math.abs(target.current.y - current.current.y);
      raf.current = dx > 0.4 || dy > 0.4 ? requestAnimationFrame(loop) : null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden opacity-60 mix-blend-screen md:block"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(34,211,238,0.10) 35%, transparent 62%)',
      }}
    />
  );
}
