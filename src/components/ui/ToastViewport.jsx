import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { cn } from '../../utils/cn.js';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TONE_CLASSES = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary-light',
};

const BAR_CLASSES = {
  success: 'bg-success',
  error: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-primary-light',
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const type = ICONS[toast.type] ? toast.type : 'info';
        const Icon = ICONS[type];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden rounded-xl border border-border bg-surface-2 pr-9 shadow-2xl animate-toast-in"
            role="status"
          >
            <div className="flex items-start gap-2.5 px-3.5 py-3">
              <Icon
                className={cn('mt-0.5 h-4 w-4 shrink-0', TONE_CLASSES[type])}
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-text">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fechar notificação"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition hover:bg-white/5 hover:text-text"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {toast.duration > 0 && (
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-full origin-left animate-toast-progress',
                  BAR_CLASSES[type],
                )}
                style={{ animationDuration: `${toast.duration}ms` }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
