import { useEffect, useState } from 'react';
import { Check, ListChecks, Search, X } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import TaskBadges from '../tasks/TaskBadges.jsx';
import { cn } from '../../utils/cn.js';

export default function TaskPicker({
  open,
  tasks,
  selectedId,
  onSelect,
  onClose,
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? tasks.filter((task) =>
        task.title.toLowerCase().includes(normalizedQuery),
      )
    : tasks;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Selecionar tarefa"
      description="Apenas tarefas pendentes podem ser vinculadas ao timer."
      size="sm"
    >
      <div className="space-y-3">
        <Input
          id="task-picker-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar tarefa..."
          icon={Search}
          autoFocus
        />

        <button
          type="button"
          onClick={() => {
            onSelect(null);
            onClose();
          }}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition',
            selectedId
              ? 'border-border text-text-secondary hover:bg-white/5'
              : 'border-primary/30 bg-primary-soft text-text',
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Nenhuma tarefa
          {!selectedId && (
            <Check className="ml-auto h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
          )}
        </button>

        {tasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Crie uma tarefa primeiro"
            description="Adicione um cartão no quadro de tarefas para vinculá-lo ao foco."
          />
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-text-muted">
            Nenhuma tarefa encontrada para “{query}”.
          </p>
        ) : (
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filtered.map((task) => {
              const active = task.id === selectedId;
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(task.id);
                      onClose();
                    }}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition',
                      active
                        ? 'border-primary/30 bg-primary-soft'
                        : 'border-transparent hover:bg-white/5',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-text">
                        {task.title}
                      </span>
                      <span className="mt-1 block">
                        <TaskBadges
                          category={task.category}
                          priority={task.priority}
                        />
                      </span>
                    </span>
                    {active && (
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-light"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
