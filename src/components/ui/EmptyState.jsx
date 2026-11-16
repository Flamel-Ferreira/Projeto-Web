import { cn } from '../../utils/cn.js';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-white/[0.015] px-6 py-12 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-3 text-text-muted">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-4 text-sm font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
