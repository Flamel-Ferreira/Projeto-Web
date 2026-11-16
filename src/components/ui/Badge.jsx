import { cn } from '../../utils/cn.js';

const TONES = {
  purple: 'border-primary/25 bg-primary-soft text-primary-light',
  pink: 'border-pink/25 bg-pink/10 text-pink',
  green: 'border-success/25 bg-success-soft text-success',
  slate: 'border-slate/20 bg-slate/10 text-slate',
  amber: 'border-warning/25 bg-warning/10 text-warning',
  neutral: 'border-border bg-white/5 text-text-secondary',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
};

export default function Badge({
  children,
  tone = 'neutral',
  size = 'sm',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-badge border font-medium uppercase tracking-wide',
        TONES[tone] ?? TONES.neutral,
        SIZES[size] ?? SIZES.sm,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
