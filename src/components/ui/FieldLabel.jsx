import { cn } from '../../utils/cn.js';

export default function FieldLabel({ htmlFor, children, hint, className }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3', className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-text-secondary"
      >
        {children}
      </label>
      {hint && <span className="text-[11px] text-text-muted">{hint}</span>}
    </div>
  );
}
