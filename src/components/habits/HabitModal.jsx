import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import {
  ALL_WEEK_DAYS,
  HABIT_CATEGORIES,
  HABIT_CATEGORY_LABELS,
  HABIT_CATEGORY_ORDER,
  HABIT_GOALS,
  LIMITS,
  WEEK_DAYS,
} from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

const CATEGORY_OPTIONS = HABIT_CATEGORY_ORDER.map((value) => ({
  value,
  label: HABIT_CATEGORY_LABELS[value],
}));

const GOAL_OPTIONS = HABIT_GOALS.map((goal) => ({
  value: String(goal.value),
  label: goal.label,
}));

export default function HabitModal({ open, habit, onClose, onSubmit }) {
  const editing = Boolean(habit);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(HABIT_CATEGORIES.HEALTH);
  const [days, setDays] = useState([...ALL_WEEK_DAYS]);
  const [goal, setGoal] = useState('1');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setName(habit?.name ?? '');
    setCategory(habit?.category ?? HABIT_CATEGORIES.HEALTH);
    setDays(habit?.days ? [...habit.days] : [...ALL_WEEK_DAYS]);
    setGoal(String(habit?.goal ?? 1));
    setError('');
  }, [open, habit]);

  function toggleDay(value) {
    setDays((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value],
    );
    if (error) setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const value = name.trim();

    if (!value) {
      setError('Informe o nome do hábito.');
      return;
    }
    if (value.length > LIMITS.habitNameMax) {
      setError(`O nome deve ter no máximo ${LIMITS.habitNameMax} caracteres.`);
      return;
    }
    if (days.length === 0) {
      setError('Selecione pelo menos um dia de frequência.');
      return;
    }

    onSubmit?.({
      name: value,
      category,
      days,
      goal: Number(goal),
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Editar Hábito' : 'Novo Hábito'}
      description={
        editing
          ? 'Ajuste nome, categoria, frequência e meta do hábito.'
          : 'Defina nome, categoria, frequência e meta para acompanhar sua consistência.'
      }
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="habit-form" icon={Save}>
            Salvar Hábito
          </Button>
        </div>
      }
    >
      <form id="habit-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="habit-name"
          label="Nome"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError('');
          }}
          placeholder="Ex.: Meditar 10 minutos"
          hint={`${name.length}/${LIMITS.habitNameMax}`}
          maxLength={LIMITS.habitNameMax}
          error={error}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Categoria</p>
          <SegmentedControl
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            columns={2}
            size="sm"
            name="habit-category"
            ariaLabel="Categoria do hábito"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Frequência</p>
          <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
            {WEEK_DAYS.map((day) => {
              const active = days.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleDay(day.value)}
                  className={cn(
                    'h-9 rounded-field border text-[11px] font-medium transition',
                    active
                      ? 'border-primary/40 bg-primary-soft text-primary-light'
                      : 'border-border bg-[#0F0F10] text-text-muted hover:border-white/15 hover:text-text',
                  )}
                  title={day.long}
                >
                  {day.short}
                </button>
              );
            })}
          </div>
        </div>

        <Select
          id="habit-goal"
          label="Meta diária"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          options={GOAL_OPTIONS}
        />
      </form>
    </Modal>
  );
}
