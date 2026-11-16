import { Link } from 'react-router-dom';
import { Check, Flame } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import { ROUTES } from '../../utils/constants.js';
import { cn } from '../../utils/cn.js';

export default function TodayHabitsCard({
  habits,
  consistency,
  currentStreak,
  onToggle,
}) {
  return (
    <section className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
            <Flame className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold leading-snug text-text">
              Hábitos de Hoje
            </h2>
            <p className="mt-1 text-[11px] text-text-muted">
              Pequenas ações, consistência real.
            </p>
          </div>
        </div>
        <Badge tone="green">
          {consistency.completed} de {consistency.total}
        </Badge>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-text-secondary">
            Consistência Diária
          </p>
          <p className="text-xs font-semibold text-text">
            {consistency.percent}%
          </p>
        </div>
        <ProgressBar
          value={consistency.percent}
          tone="success"
          className="mt-2"
        />
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {habits.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/[0.015] px-4 py-8 text-center">
            <Flame className="h-5 w-5 text-text-muted" aria-hidden="true" />
            <p className="mt-3 text-xs font-medium text-text">
              Nenhum hábito para hoje
            </p>
            <p className="mt-1 text-[11px] text-text-muted">
              Crie um hábito para acompanhar sua rotina.
            </p>
            <Link
              to={ROUTES.habits}
              className="mt-4 inline-flex h-8 items-center rounded-field border border-border px-3 text-xs font-medium text-text-secondary transition hover:border-white/15 hover:text-text"
            >
              Ver hábitos
            </Link>
          </div>
        ) : (
          habits.map((habit) => {
            const done = habit.done;
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => onToggle(habit.id)}
                aria-pressed={done}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition',
                  done
                    ? 'border-success/25 bg-success-soft'
                    : 'border-border bg-[#151516] hover:border-white/15',
                )}
              >
                <span
                  className={cn(
                    'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition',
                    done
                      ? 'border-success bg-success text-black'
                      : 'border-[#3F3F46]',
                  )}
                >
                  {done && (
                    <Check
                      className="h-3 w-3"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-xs font-medium',
                    done ? 'text-text-secondary line-through' : 'text-text',
                  )}
                >
                  {habit.name}
                </span>
              </button>
            );
          })
        )}
      </div>

      <footer className="mt-5 border-t border-border pt-4 text-[11px] text-text-muted">
        Sequência atual: {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
      </footer>
    </section>
  );
}
