import { Check, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskBadges from './TaskBadges.jsx';
import { TASK_STATUS } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

function TaskCardContent({ task, onToggle, onDelete, dragging = false }) {
  const done = task.status === TASK_STATUS.DONE;

  return (
    <>
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle?.(task.id);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={
            done
              ? `Reabrir tarefa: ${task.title}`
              : `Concluir tarefa: ${task.title}`
          }
          className={cn(
            'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition',
            done
              ? 'border-success bg-success text-black'
              : 'border-[#3F3F46] bg-transparent hover:border-success/70',
          )}
        >
          {done && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-[15px] font-semibold leading-snug',
              done ? 'text-text-muted line-through' : 'text-text',
            )}
          >
            {task.title}
          </p>
          <div className="mt-2">
            <TaskBadges category={task.category} priority={task.priority} />
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(task);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={`Excluir tarefa: ${task.title}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted opacity-0 transition hover:bg-danger/10 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {dragging && (
        <span className="sr-only">Movendo {task.title}</span>
      )}
    </>
  );
}

export default function TaskCard({ task, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'card', status: task.status },
  });

  const done = task.status === TASK_STATUS.DONE;

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={cn(
        'group cursor-grab touch-none rounded-xl border border-border bg-[#181819] p-3.5 transition-colors hover:border-white/10',
        done && 'border-success/15 bg-[#151715]',
        isDragging && 'opacity-40',
      )}
    >
      <TaskCardContent
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </article>
  );
}

export function TaskCardOverlay({ task }) {
  return (
    <div className="rotate-2 scale-[1.02] rounded-xl border border-primary/30 bg-[#1C1C1F] p-3.5 shadow-2xl shadow-black/50">
      <TaskCardContent task={task} />
    </div>
  );
}
