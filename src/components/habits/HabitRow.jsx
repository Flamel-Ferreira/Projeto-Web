import { Pencil, Trash2, Brain, BookOpen, HeartPulse, Target } from 'lucide-react';
import HabitDayCell from './HabitDayCell.jsx';
import StreakBadge from './StreakBadge.jsx';
import {
  HABIT_CATEGORIES,
  HABIT_CATEGORY_LABELS,
} from '../../utils/constants.js';
import {
  diffCalendarDays,
  getWeekdayLong,
  parseDateKey,
} from '../../utils/date.js';

const CATEGORY_ICONS = {
  [HABIT_CATEGORIES.HEALTH]: HeartPulse,
  [HABIT_CATEGORIES.STUDIES]: BookOpen,
  [HABIT_CATEGORIES.PRODUCTIVITY]: Target,
  [HABIT_CATEGORIES.MIND]: Brain,
};

export default function HabitRow({
  habit,
  weekDates,
  todayKey,
  streak,
  onToggle,
  onEdit,
  onDelete,
}) {
  const Icon = CATEGORY_ICONS[habit.category] ?? HeartPulse;

  return (
    <div className="group grid grid-cols-[minmax(200px,1fr)_repeat(7,36px)_96px_64px] items-center gap-2 border-t border-white/5 px-4 py-3 transition-colors hover:bg-white/[0.02]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-text-secondary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold text-text">
            {habit.name}
          </span>
          <span className="block truncate text-xs text-text-muted">
            {HABIT_CATEGORY_LABELS[habit.category]} ·{' '}
            {habit.goal} {habit.goal === 1 ? 'vez' : 'vezes'} ao dia
          </span>
        </span>
      </div>

      {weekDates.map((dateKey) => {
        const date = parseDateKey(dateKey);
        const scheduled = date ? habit.days.includes(date.getDay()) : false;
        const future = diffCalendarDays(todayKey, dateKey) > 0;
        const done = habit.history?.[dateKey] === true;

        let state = 'pending';
        if (!scheduled) state = 'notRequired';
        else if (future) state = 'future';
        else if (done) state = 'done';

        const weekday = date ? getWeekdayLong(date) : 'dia';
        const statusLabel =
          state === 'done'
            ? 'concluído'
            : state === 'future'
              ? 'dia futuro'
              : state === 'notRequired'
                ? 'não obrigatório'
                : 'não concluído';

        return (
          <HabitDayCell
            key={dateKey}
            state={state}
            label={`${weekday}, ${statusLabel}`}
            title={state === 'future' ? 'Dia futuro' : undefined}
            onClick={() => onToggle(habit.id, dateKey)}
          />
        );
      })}

      <div>
        <StreakBadge days={streak} />
      </div>

      <div className="flex items-center justify-end gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(habit)}
          aria-label={`Editar hábito: ${habit.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition hover:bg-white/5 hover:text-text"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(habit)}
          aria-label={`Excluir hábito: ${habit.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
