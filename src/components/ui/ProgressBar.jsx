import { cn } from '../../utils/cn.js';

const TONES = {
  success: 'bg-success-gradient',
  primary: 'bg-primary-gradient',
};

export default function ProgressBar({
  value = 0,
  tone = 'primary',
  label,
  className,
}) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
  const rounded = Math.round(safeValue);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-text-secondary">{label}</span>
          <span className="text-xs font-medium text-text">{rounded}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-label={label || 'Progresso'}
        className="h-2 w-full overflow-hidden rounded-full bg-[#232325]"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            TONES[tone] ?? TONES.primary,
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
