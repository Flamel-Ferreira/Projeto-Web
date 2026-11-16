import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import {
  LIMITS,
  TASK_CATEGORIES,
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_ORDER,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_ORDER,
  TASK_STATUS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from '../../utils/constants.js';

const CATEGORY_OPTIONS = TASK_CATEGORY_ORDER.map((value) => ({
  value,
  label: TASK_CATEGORY_LABELS[value],
}));

const PRIORITY_OPTIONS = TASK_PRIORITY_ORDER.map((value) => ({
  value,
  label: TASK_PRIORITY_LABELS[value],
}));

const STATUS_OPTIONS = TASK_STATUS_ORDER.map((value) => ({
  value,
  label: TASK_STATUS_LABELS[value],
}));

export default function TaskModal({
  open,
  initialStatus = TASK_STATUS.TODO,
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [category, setCategory] = useState(TASK_CATEGORIES.WORK);
  const [priority, setPriority] = useState(TASK_PRIORITIES.MEDIUM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setStatus(initialStatus);
    setCategory(TASK_CATEGORIES.WORK);
    setPriority(TASK_PRIORITIES.MEDIUM);
    setError('');
  }, [open, initialStatus]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();

    if (!value) {
      setError('Informe o título da tarefa.');
      return;
    }

    onSubmit?.({ title: value, status, category, priority });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova Tarefa"
      description="Escolha a coluna, a categoria e a prioridade do novo cartão."
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="task-form"
            icon={Plus}
          >
            Criar Tarefa
          </Button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="task-title"
          label="Título"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
          placeholder="O que precisa ser feito?"
          error={error}
          hint={`${title.length}/${LIMITS.taskTitleMax}`}
          maxLength={LIMITS.taskTitleMax}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Coluna</p>
          <SegmentedControl
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            columns={3}
            size="sm"
            name="task-status"
            ariaLabel="Coluna da tarefa"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Categoria</p>
          <SegmentedControl
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            columns={3}
            size="sm"
            name="task-category"
            ariaLabel="Categoria da tarefa"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Prioridade</p>
          <SegmentedControl
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={setPriority}
            columns={3}
            size="sm"
            name="task-priority"
            ariaLabel="Prioridade da tarefa"
          />
        </div>
      </form>
    </Modal>
  );
}
