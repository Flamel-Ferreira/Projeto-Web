import { useId } from 'react';
import { formatTimer } from '../../utils/date.js';
import { cn } from '../../utils/cn.js';

const TIME_SIZES = {
  lg: 'text-[56px]',
  md: 'text-[40px]',
  sm: 'text-[32px]',
};export default function PomodoroRing({
  remaining,
  duration,
  size = 280,
  stroke = 8,
  isRunning = false,
  label,
  sublabel,
  tone = 'focus',
}) {
  const filterId = `ring-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const safeDuration = duration > 0 ? duration : 1;
  const progress = Math.min(1, Math.max(0, remaining / safeDuration));
  const center = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const timeSize =
    size >= 260 ? TIME_SIZES.lg : size >= 190 ? TIME_SIZES.md : TIME_SIZES.sm;

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: size, aspectRatio: '1 / 1' }}
      role="timer"
      aria-label={`${label}: ${formatTimer(remaining)} restantes`}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#26262A"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#8B7CF7"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter={`url(#${filterId})`}
          className={cn(
            isRunning ? 'transition-[stroke-dashoffset] duration-300 ease-linear' : '',
          )}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p
          className={cn(
            'font-semibold tracking-tight text-text tabular-nums',
            timeSize,
          )}
        >
          {formatTimer(remaining)}
        </p>

        {label && (
          <p
            className={cn(
              'mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]',
              tone === 'pause' ? 'text-warning' : 'text-success',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full animate-pulse-soft',
                tone === 'pause' ? 'bg-warning' : 'bg-success',
              )}
              aria-hidden="true"
            />
            {label}
          </p>
        )}

        {sublabel && (
          <p className="mt-1 text-[10px] text-text-muted">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
