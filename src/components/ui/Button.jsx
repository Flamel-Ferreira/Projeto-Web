import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary:
    'bg-primary-gradient text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'border border-border bg-surface-3 text-text hover:bg-[#27272A] active:bg-[#202023]',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/5 hover:text-text active:bg-white/10',
  outline:
    'border border-border bg-transparent text-text hover:border-white/15 hover:bg-white/5',
  danger:
    'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 active:bg-danger/20',
};

const SIZES = {
  sm: { button: 'h-8 gap-1.5 px-3 text-xs', icon: 'h-3.5 w-3.5' },
  md: { button: 'h-10 gap-2 px-4 text-sm', icon: 'h-4 w-4' },
  lg: { button: 'h-12 gap-2 px-5 text-sm', icon: 'h-[18px] w-[18px]' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  type = 'button',
  disabled = false,
  className,
  ...props
}) {
  const variantStyles = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeStyles = SIZES[size] ?? SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-field font-medium transition duration-150 disabled:pointer-events-none disabled:opacity-50',
        variantStyles,
        sizeStyles.button,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn('animate-spin', sizeStyles.icon)} aria-hidden="true" />
      ) : (
        Icon && <Icon className={sizeStyles.icon} aria-hidden="true" />
      )}
      {children}
      {!loading && IconRight && (
        <IconRight className={sizeStyles.icon} aria-hidden="true" />
      )}
    </button>
  );
}
