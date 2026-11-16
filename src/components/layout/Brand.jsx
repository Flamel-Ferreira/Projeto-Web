import { Zap } from 'lucide-react';
import { APP } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

const SIZES = {
  sm: {
    box: 'h-8 w-8 rounded-lg',
    icon: 'h-4 w-4',
    title: 'text-sm',
    subtitle: 'text-[8px]',
  },
  md: {
    box: 'h-10 w-10 rounded-xl',
    icon: 'h-5 w-5',
    title: 'text-lg',
    subtitle: 'text-[9px]',
  },
  lg: {
    box: 'h-11 w-11 rounded-xl',
    icon: 'h-[22px] w-[22px]',
    title: 'text-[28px]',
    subtitle: 'text-[10px]',
  },
};

export default function Brand({
  size = 'md',
  withSubtitle = true,
  stacked = false,
  className,
}) {
  const styles = SIZES[size] ?? SIZES.md;

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        stacked && 'flex-col gap-4 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center bg-brand-gradient text-white shadow-glow',
          styles.box,
        )}
      >
        <Zap className={styles.icon} strokeWidth={2.4} aria-hidden="true" />
      </div>

      <div className={cn(stacked && 'space-y-1.5')}>
        <p
          className={cn(
            'font-semibold leading-none tracking-tight text-text',
            styles.title,
          )}
        >
          {APP.name}
        </p>
        {withSubtitle && (
          <p
            className={cn(
              'mt-1.5 font-medium uppercase tracking-[0.22em] text-text-muted',
              styles.subtitle,
            )}
          >
            {APP.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
