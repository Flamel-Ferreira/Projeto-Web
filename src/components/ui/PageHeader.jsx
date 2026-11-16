import { cn } from '../../utils/cn.js';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
            {eyebrow}
          </p>
        )}
        <h1
          tabIndex={-1}
          className="mt-1.5 text-2xl font-semibold tracking-tight text-text focus:outline-none sm:text-3xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>
  );
}
