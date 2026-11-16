import { Flame } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function StreakBadge({ days = 0 }) {
  const active = days > 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        active
          ? 'border-success/20 bg-success-soft text-success'
          : 'border-border bg-[#232325] text-text-muted',
      )}
    >
      <Flame className="h-3 w-3" aria-hidden="true" />
      {days} {days === 1 ? 'dia' : 'dias'}
    </span>
  );
}
