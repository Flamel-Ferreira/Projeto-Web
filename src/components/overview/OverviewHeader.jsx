import { getGreeting } from '../../utils/date.js';

export default function OverviewHeader({ name, dateLabel, periodLabel }) {
  const firstName = String(name || '').trim().split(/\s+/)[0] || '';

  return (
    <header>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
        <span
          className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)]"
          aria-hidden="true"
        />
        Modo de Foco Disponível
      </p>

      <h1
        tabIndex={-1}
        className="mt-3 text-3xl font-semibold tracking-tight text-text focus:outline-none sm:text-4xl"
      >
        {getGreeting()}
        {firstName ? `, ${firstName}` : ''}
      </h1>

      <p className="mt-2 text-sm text-text-secondary">
        {dateLabel} <span className="text-text-muted">•</span> {periodLabel}
      </p>
    </header>
  );
}
