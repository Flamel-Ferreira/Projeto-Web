import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-primary-gradient text-white shadow-glow hover:brightness-110',
  secondary: 'border border-border bg-surface-3 text-text hover:bg-[#27272A]',
  ghost: 'text-text-secondary hover:bg-white/5 hover:text-text',
  outline: 'border border-border text-text hover:border-white/15 hover:bg-white/5',
  danger: 'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15',
};

const SIZES = {
  sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-3.5 w-3.5' },
  md: { box: 'h-10 w-10 rounded-field', icon: 'h-4 w-4' },
  lg: { box: 'h-12 w-12 rounded-field', icon: 'h-5 w-5' },
};

export default function IconButton({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  const variantStyles = VARIANTS[variant] ?? VARIANTS.ghost;
  const sizeStyles = SIZES[size] ?? SIZES.md;

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center transition duration-150 disabled:pointer-events-none disabled:opacity-50',
        variantStyles,
        sizeStyles.box,
        className,
      )}
      {...props}
    >
      <Icon className={sizeStyles.icon} aria-hidden="true" />
    </button>
  );
}
