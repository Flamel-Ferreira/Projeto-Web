import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard.jsx';
import { cn } from '../../utils/cn.js';
import { TASK_STATUS_DOTS } from '../../utils/constants.js';

export default function TaskColumn({
  status,
  label,
  tasks,
  count,
  onAddCard,
  onToggle,
  onDelete,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { type: 'column', status },
  });

  return (
    <section
      aria-label={`${label}, ${count} ${count === 1 ? 'tarefa' : 'tarefas'}`}
      className="flex min-w-[85vw] snap-start flex-col rounded-card border border-border bg-[#101011] p-4 md:min-w-0"
    >
      <header className="flex items-center gap-2.5 pb-3">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: TASK_STATUS_DOTS[status] }}
          aria-hidden="true"
        />
        <h2 className="text-sm font-semibold text-text">{label}</h2>
        <span
          className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#232325] px-2 text-[11px] font-medium text-text-secondary"
          aria-hidden="true"
        >
          {count}
        </span>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-[130px] flex-1 flex-col gap-2.5 rounded-lg transition-colors',
            isOver && 'bg-white/[0.025]',
          )}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}

          {tasks.length === 0 && (
            <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/70 px-3 py-6 text-center text-[11px] text-text-muted">
              Nenhum cartão nesta coluna
            </p>
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onAddCard?.(status)}
        className="mt-3 flex items-center gap-1.5 rounded-lg px-1 py-2 text-left text-xs font-medium text-text-muted transition hover:text-primary-light"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Adicionar cartão
      </button>
    </section>
  );
}
