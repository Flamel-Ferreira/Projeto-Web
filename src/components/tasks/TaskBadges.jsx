import Badge from '../ui/Badge.jsx';
import { cn } from '../../utils/cn.js';
import {
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_TONES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_TONES,
} from '../../utils/constants.js';

const PRIORITY_DOTS = {
  low: 'bg-slate',
  medium: 'bg-primary-light',
  high: 'bg-pink',
};

export default function TaskBadges({ category, priority, variant = 'card' }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1')}>
      <Badge tone={TASK_CATEGORY_TONES[category] ?? 'neutral'}>
        {TASK_CATEGORY_LABELS[category] ?? 'Tarefa'}
      </Badge>

      {priority && (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[11px] text-text-muted',
            variant === 'inline' && 'text-text-secondary',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              PRIORITY_DOTS[priority] ?? PRIORITY_DOTS.medium,
            )}
            aria-hidden="true"
          />
          {TASK_PRIORITY_LABELS[priority] ?? 'Média'}
        </span>
      )}
    </div>
  );
}
