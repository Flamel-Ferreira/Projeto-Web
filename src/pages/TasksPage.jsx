import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import TaskBoard from '../components/tasks/TaskBoard.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import { useTasks } from '../context/TasksContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { TASK_STATUS } from '../utils/constants.js';

export default function TasksPage() {
  const {
    tasks,
    counts,
    addTask,
    toggleComplete,
    moveTask,
    deleteTask,
  } = useTasks();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState(TASK_STATUS.TODO);
  const [pendingDelete, setPendingDelete] = useState(null);

  function openCreate(status = TASK_STATUS.TODO) {
    setInitialStatus(status);
    setModalOpen(true);
  }

  function handleCreate(values) {
    addTask(values);
    setModalOpen(false);
    showToast('Tarefa criada com sucesso.', 'success');
  }

  function handleDelete(task) {
    deleteTask(task.id);
    setPendingDelete(null);
    showToast('Tarefa excluída.', 'info');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="QUADRO SIMPLES • Organização diária"
        title="Tarefas"
        subtitle={`${counts.total} ${counts.total === 1 ? 'tarefa' : 'tarefas'} · ${counts.completed} ${counts.completed === 1 ? 'concluída' : 'concluídas'} · ${counts.pending} ${counts.pending === 1 ? 'pendente' : 'pendentes'}`}
        action={
          <Button icon={Plus} onClick={() => openCreate(TASK_STATUS.TODO)}>
            Nova Tarefa
          </Button>
        }
      />

      <TaskBoard
        tasks={tasks}
        onMove={moveTask}
        onAddCard={openCreate}
        onToggle={toggleComplete}
        onDelete={setPendingDelete}
      />

      <TaskModal
        open={modalOpen}
        initialStatus={initialStatus}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir tarefa?"
        description={
          pendingDelete
            ? `A tarefa “${pendingDelete.title}” será removida permanentemente.`
            : ''
        }
        confirmLabel="Excluir tarefa"
        destructive
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
