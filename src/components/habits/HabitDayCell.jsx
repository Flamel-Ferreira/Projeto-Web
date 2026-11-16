import { Check } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function HabitDayCell({ state, label, onClick, title }) {
  const done = state === 'done';
  const disabled = state === 'notRequired' || state === 'future';

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'flex h-[30px] w-[30px] items-center justify-center rounded-cell border transition',
        done &&
          'border-success/40 bg-success-soft text-success hover:bg-success/20',
        state === 'pending' &&
          'border-[#2A2A2E] bg-surface-2 hover:border-primary/50 hover:bg-surface-3',
        state === 'notRequired' &&
          'cursor-default border-dashed border-white/[0.06] bg-[#131315]',
        state === 'future' &&
          'cursor-not-allowed border-border bg-surface-2 opacity-40',
      )}
    >
      {done && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}
