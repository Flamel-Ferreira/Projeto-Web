import HabitRow from './HabitRow.jsx';
import { WEEK_DAYS } from '../../utils/constants.js';
import { parseDateKey, toDateKey } from '../../utils/date.js';
import { cn } from '../../utils/cn.js';

export default function HabitTable({
  habits,
  weekDates,
  todayKey,
  onToggle,
  onEdit,
  onDelete,
  streakOf,
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-[minmax(200px,1fr)_repeat(7,36px)_96px_64px] items-center gap-2 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Hábito
          </p>

          {weekDates.map((dateKey) => {
            const date = parseDateKey(dateKey);
            const weekday = date ? date.getDay() : null;
            const meta = WEEK_DAYS.find((day) => day.value === weekday);
            const isToday = dateKey === todayKey;

            return (
              <p
                key={dateKey}
                className={cn(
                  'text-center text-[11px] font-medium uppercase tracking-wide',
                  isToday ? 'text-primary-light' : 'text-text-muted',
                )}
                title={meta?.long}
              >
                {meta?.short ?? ''}
              </p>
            );
          })}

          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Sequência
          </p>
          <span className="sr-only">Ações</span>
        </div>

        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDates={weekDates}
            todayKey={todayKey || toDateKey()}
            streak={streakOf(habit.id)}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
