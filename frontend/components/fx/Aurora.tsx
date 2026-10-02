import { cn } from '@/lib/utils';

/**
 * Layered cosmic backdrop: drifting gradient orbs + grid + noise.
 * Pure CSS so it costs nothing at runtime and ships in the HTML.
 */
export default function Aurora({
  className,
  variant = 'default',
  grid = true,
  noise = true,
}: {
  className?: string;
  variant?: 'default' | 'violet' | 'calm';
  grid?: boolean;
  noise?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', noise && 'noise', className)}
    >
      {grid && (
        <>
          <div className="absolute inset-0 grid-bg opacity-[0.55] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/40 to-ink-950" />
        </>
      )}

      {/* orbs */}
      <div
        className={cn(
          'absolute -left-[12%] -top-[18%] h-[46rem] w-[46rem] rounded-full blur-[110px] animate-orb-drift',
          variant === 'calm' ? 'opacity-25' : 'opacity-45'
        )}
        style={{ background: 'radial-gradient(circle at 30% 30%, #7C3AED 0%, rgba(79,70,229,0.55) 42%, transparent 70%)' }}
      />
      <div
        className={cn(
          'absolute -right-[14%] top-[6%] h-[40rem] w-[40rem] rounded-full blur-[120px] animate-float',
          variant === 'calm' ? 'opacity-20' : 'opacity-40'
        )}
        style={{ background: 'radial-gradient(circle at 60% 40%, #22D3EE 0%, rgba(14,165,233,0.5) 45%, transparent 72%)', animationDelay: '-6s' }}
      />
      <div
        className={cn(
          'absolute bottom-[-22%] left-[24%] h-[42rem] w-[42rem] rounded-full blur-[130px] animate-orb-drift',
          variant === 'calm' ? 'opacity-15' : 'opacity-35'
        )}
        style={{
          background: 'radial-gradient(circle at 50% 50%, #EC4899 0%, rgba(217,70,239,0.45) 45%, transparent 72%)',
          animationDelay: '-12s',
          animationDuration: '34s',
        }}
      />
      {variant !== 'calm' && (
        <div
          className="absolute bottom-[2%] right-[16%] h-[26rem] w-[26rem] rounded-full opacity-30 blur-[110px] animate-float"
          style={{ background: 'radial-gradient(circle at 50% 50%, #10B981 0%, rgba(132,204,22,0.35) 50%, transparent 72%)', animationDelay: '-14s', animationDuration: '22s' }}
        />
      )}

      {/* top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
    </div>
  );
}
