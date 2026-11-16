import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const displayName = user?.displayName || 'Usuário';
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div ref={wrapperRef} className="relative">
      {open && (
        <div
          role="menu"
          aria-label="Menu do perfil"
          className="absolute bottom-full left-0 right-0 mb-2 animate-fade-in rounded-xl border border-border bg-surface-2 p-1.5 shadow-2xl"
        >
          <div className="px-2.5 py-2">
            <p className="truncate text-xs font-semibold text-text">{displayName}</p>
            <p className="truncate text-[11px] text-text-muted">
              {user?.plan || 'Pro Workspace'}
            </p>
          </div>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-text-secondary transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sair
          </button>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl border border-transparent p-2 text-left transition hover:bg-white/5',
          open && 'border-border bg-white/5',
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-text">
            {displayName}
          </span>
          <span className="block truncate text-[10px] text-text-muted">
            {user?.plan || 'Pro Workspace'}
          </span>
        </span>
        <span
          className={cn(
            'text-text-muted transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        >
          ⌃
        </span>
      </button>
    </div>
  );
}
