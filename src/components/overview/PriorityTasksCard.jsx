import { Link } from 'react-router-dom';
import { Check, ListChecks } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import TaskBadges from '../tasks/TaskBadges.jsx';
import { ROUTES, TASK_STATUS } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

export default function PriorityTasksCard({
  tasks,
  completedInList,
  totalCompleted,
  totalPending,
  onToggle,
}) {
  return (
    <section className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-light">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold leading-snug text-text">
              Tarefas Prioritárias
            </h2>
            <p className="mt-1 text-[11px] text-text-muted">
              Até três pendências de maior prioridade.
            </p>
          </div>
        </div>
        <Badge tone="neutral">
          {completedInList} de {tasks.length}{' '}
          {tasks.length === 1 ? 'concluída' : 'concluídas'}
        </Badge>
      </div>

      <div className="mt-5 flex-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/[0.015] px-4 py-8 text-center">
            <ListChecks className="h-5 w-5 text-text-muted" aria-hidden="true" />
            <p className="mt-3 text-xs font-medium text-text">
              Nenhuma tarefa prioritária
            </p>
            <p className="mt-1 text-[11px] text-text-muted">
              Crie um cartão para começar o dia.
            </p>
            <Link
              to={ROUTES.tasks}
              className="mt-4 inline-flex h-8 items-center rounded-field border border-border px-3 text-xs font-medium text-text-secondary transition hover:border-white/15 hover:text-text"
            >
              Nova tarefa
            </Link>
          </div>
        ) : (
          tasks.map((task) => {
            const done = task.status === TASK_STATUS.DONE;
            return (
              <div
                key={task.id}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-[#151516] px-3 py-2.5"
              >
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  aria-label={
                    done
                      ? `Reabrir tarefa: ${task.title}`
                      : `Concluir tarefa: ${task.title}`
                  }
                  className={cn(
                    'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition',
                    done
                      ? 'border-success bg-success text-black'
                      : 'border-[#3F3F46] hover:border-success/70',
                  )}
                >
                  {done && (
                    <Check
                      className="h-3 w-3"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-xs font-medium',
                      done ? 'text-text-muted line-through' : 'text-text',
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="mt-1.5">
                    <TaskBadges
                      category={task.category}
                      priority={task.priority}
                      variant="inline"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="mt-5 border-t border-border pt-4 text-[11px] text-text-muted">
        {totalCompleted + totalPending}{' '}
        {totalCompleted + totalPending === 1 ? 'tarefa' : 'tarefas'} ·{' '}
        {totalCompleted} {totalCompleted === 1 ? 'concluída' : 'concluídas'} ·{' '}
        {totalPending} {totalPending === 1 ? 'pendente' : 'pendentes'}
      </footer>
    </section>
  );
}
