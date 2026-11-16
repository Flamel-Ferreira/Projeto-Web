import ProgressBar from '../ui/ProgressBar.jsx';

export default function ConsistencyBar({ percent, completed, total }) {
  return (
    <div className="rounded-card border border-border bg-surface px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-text-secondary">
          Consistência diária
        </p>
        <p className="text-[11px] text-text-muted">
          {completed} de {total} {total === 1 ? 'hábito' : 'hábitos'} ·{' '}
          <span className="font-semibold text-text">{percent}%</span>
        </p>
      </div>
      <ProgressBar value={percent} tone="success" className="mt-2.5" />
    </div>
  );
}
