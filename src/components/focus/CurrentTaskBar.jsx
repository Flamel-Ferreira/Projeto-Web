import { ArrowUpRight, Target, X } from 'lucide-react';

export default function CurrentTaskBar({ task, onOpenPicker, onClear }) {
  if (!task) {
    return (
      <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-surface-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Target className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <p className="truncate text-xs text-text-secondary">
            Nenhuma tarefa selecionada
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPicker}
          className="shrink-0 text-xs font-medium text-primary-light transition hover:text-text"
        >
          Escolher tarefa
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
      <Target className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
          Tarefa atual
        </p>
        <p className="mt-0.5 truncate text-xs font-medium text-text">
          {task.title}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenPicker}
        className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary-light transition hover:text-text"
      >
        Trocar
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onClear}
        aria-label="Remover tarefa atual"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-white/5 hover:text-text"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
