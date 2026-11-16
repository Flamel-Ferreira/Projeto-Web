import { useState } from 'react';
import { Flame, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import HabitTable from '../components/habits/HabitTable.jsx';
import HabitModal from '../components/habits/HabitModal.jsx';
import ConsistencyBar from '../components/habits/ConsistencyBar.jsx';
import { useHabits } from '../context/HabitsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function HabitsPage() {
  const {
    habits,
    weekDates,
    todayKey,
    dailyConsistency,
    streakOf,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleDay,
  } = useHabits();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(habit) {
    setEditing(habit);
    setModalOpen(true);
  }

  function handleSubmit(values) {
    if (editing) {
      updateHabit(editing.id, values);
      showToast('Hábito atualizado.', 'success');
    } else {
      addHabit(values);
      showToast('Hábito criado com sucesso.', 'success');
    }
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete() {
    if (!pendingDelete) return;
    deleteHabit(pendingDelete.id);
    setPendingDelete(null);
    showToast('Hábito excluído.', 'info');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="HÁBITOS"
        title="Meus Hábitos"
        subtitle="Acompanhamento de consistência semanal"
        action={
          <Button icon={Plus} onClick={openCreate}>
            Novo Hábito
          </Button>
        }
      />

      <ConsistencyBar
        percent={dailyConsistency.percent}
        completed={dailyConsistency.completed}
        total={dailyConsistency.total}
      />

      {habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="Você ainda não criou hábitos"
          description="Crie seu primeiro hábito para acompanhar a sequência e a consistência diária."
          action={
            <Button icon={Plus} onClick={openCreate}>
              Novo Hábito
            </Button>
          }
        />
      ) : (
        <HabitTable
          habits={habits}
          weekDates={weekDates}
          todayKey={todayKey}
          streakOf={streakOf}
          onToggle={toggleDay}
          onEdit={openEdit}
          onDelete={setPendingDelete}
        />
      )}

      <HabitModal
        open={modalOpen}
        habit={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir hábito?"
        description={
          pendingDelete
            ? `O hábito “${pendingDelete.name}” e todo o seu histórico serão removidos permanentemente.`
            : ''
        }
        confirmLabel="Excluir hábito"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
