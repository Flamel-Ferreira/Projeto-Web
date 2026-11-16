import { cn } from '../../utils/cn.js';

const SIZES = {
  sm: { button: 'gap-1.5 px-2.5 py-1.5 text-[11px]', icon: 'h-3.5 w-3.5' },
  md: { button: 'gap-2 px-3 py-2 text-xs', icon: 'h-4 w-4' },
};

export default function SegmentedControl({
  options = [],
  value,
  onChange,
  columns,
  size = 'md',
  name,
  className,
  ariaLabel,
}) {
  const sizeStyles = SIZES[size] ?? SIZES.md;
  const useGrid = Number(columns) > 0;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-name={name}
      className={cn(
        'rounded-lg border border-border bg-[#0B0B0C] p-1',
        useGrid ? 'grid gap-1' : 'flex gap-1',
        className,
      )}
      style={
        useGrid
          ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
            className={cn(
              'flex min-w-0 items-center justify-center rounded-md font-medium transition duration-150',
              sizeStyles.button,
              active
                ? 'bg-[#262628] text-text shadow-sm'
                : 'text-text-secondary hover:bg-white/5 hover:text-text',
            )}
          >
            {Icon && <Icon className={sizeStyles.icon} aria-hidden="true" />}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
