import { useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import IconButton from '../ui/IconButton.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import ModeTabs from '../focus/ModeTabs.jsx';
import PomodoroRing from '../focus/PomodoroRing.jsx';
import {
  POMODORO_MODES,
  POMODORO_STATUS_LABELS,
} from '../../utils/constants.js';

export default function FocusSummaryCard({
  mode,
  setMode,
  remaining,
  progress,
  isRunning,
  start,
  pause,
  reset,
  sessionCount,
  cycleLength,
  duration,
}) {
  const [pendingMode, setPendingMode] = useState(null);

  function handleModeChange(nextMode) {
    if (nextMode === mode) return;
    if (isRunning) {
      setPendingMode(nextMode);
      return;
    }
    setMode(nextMode);
  }

  function confirmModeChange() {
    if (pendingMode) setMode(pendingMode);
    setPendingMode(null);
  }

  const safeDuration = duration || (progress > 0 ? remaining / progress : remaining);

  return (
    <section className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-light">
            <Timer className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold leading-snug text-text">
              Temporizador de Foco
            </h2>
            <p className="mt-1 text-[11px] text-text-muted">
              Mantenha o ritmo no que importa.
            </p>
          </div>
        </div>
        <Badge tone="purple">Pomodoro</Badge>
      </div>

      <ModeTabs
        mode={mode}
        onChange={handleModeChange}
        compact
        className="mt-5"
      />

      <div className="mt-5 flex flex-1 items-center justify-center">
        <div className="w-[min(180px,55vw)]">
          <PomodoroRing
            remaining={remaining}
            duration={safeDuration}
            size={180}
            stroke={8}
            isRunning={isRunning}
            label={POMODORO_STATUS_LABELS[mode]}
            tone={mode === POMODORO_MODES.FOCUS ? 'focus' : 'pause'}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <Button
          size="md"
          icon={isRunning ? Pause : Play}
          onClick={isRunning ? pause : start}
          className="min-w-[132px]"
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </Button>
        <IconButton
          icon={RotateCcw}
          label="Reiniciar timer"
          variant="secondary"
          onClick={reset}
        />
      </div>

      <footer className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-text-muted">
        <span
          className="h-1.5 w-1.5 rounded-full bg-success"
          aria-hidden="true"
        />
        Sessão {Math.min(sessionCount + 1, cycleLength)} de {cycleLength} prevista
        para hoje
      </footer>

      <ConfirmDialog
        open={Boolean(pendingMode)}
        title="Trocar de modo?"
        description="O timer está em andamento. Trocar de modo irá parar a sessão atual."
        confirmLabel="Trocar modo"
        onConfirm={confirmModeChange}
        onCancel={() => setPendingMode(null)}
      />
    </section>
  );
}
