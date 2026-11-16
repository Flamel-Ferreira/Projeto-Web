import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import IconButton from './IconButton.jsx';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const previousActive = document.activeElement;
    const panel = panelRef.current;
    const getFocusable = () =>
      panel ? Array.from(panel.querySelectorAll(FOCUSABLE)) : [];

    const firstFocusable = getFocusable()[0];
    (firstFocusable ?? panel)?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActive instanceof HTMLElement) previousActive.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-modal border border-border bg-surface shadow-2xl animate-modal-in focus:outline-none',
          SIZES[size] ?? SIZES.md,
        )}
      >
        <header className="flex items-start justify-between gap-4 px-6 pt-5">
          <div className="min-w-0">
            {title && (
              <h2 id="modal-title" className="text-base font-semibold text-text">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1 text-xs text-text-secondary">
                {description}
              </p>
            )}
          </div>
          <IconButton icon={X} label="Fechar" size="sm" onClick={onClose} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="border-t border-border bg-surface-2/60 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
