import { useMemo, useState } from 'react';
import ModeTabs from '../components/focus/ModeTabs.jsx';
import PomodoroRing from '../components/focus/PomodoroRing.jsx';
import TimerControls from '../components/focus/TimerControls.jsx';
import CurrentTaskBar from '../components/focus/CurrentTaskBar.jsx';
import TaskPicker from '../components/focus/TaskPicker.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { usePomodoro } from '../context/PomodoroContext.jsx';
import { useTasks } from '../context/TasksContext.jsx';
import {
  POMODORO_MODE_LABELS,
  POMODORO_MODES,
  POMODORO_STATUS_LABELS,
  TASK_PRIORITY_RANK,
  TASK_STATUS,
} from '../utils/constants.js';

export default function FocusPage() {
  const {
    mode,
    duration,
    remaining,
    isRunning,
    sessionCount,
    cycleLength,
    currentTask,
    setMode,
    start,
    pause,
    reset,
    selectTask,
  } = usePomodoro();
  const { tasks } = useTasks();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const pendingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== TASK_STATUS.DONE)
        .sort((a, b) => {
          const rankA = TASK_PRIORITY_RANK[a.priority] ?? 1;
          const rankB = TASK_PRIORITY_RANK[b.priority] ?? 1;
          if (rankA !== rankB) return rankA - rankB;
          if (a.order !== b.order) return a.order - b.order;
          return String(a.createdAt).localeCompare(String(b.createdAt));
        }),
    [tasks],
  );

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

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-6">
      <h1 tabIndex={-1} className="sr-only">
        Foco
      </h1>

      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <ModeTabs
          mode={mode}
          onChange={handleModeChange}
          className="w-full max-w-md"
        />

        <div className="w-[min(280px,70vw)]">
          <PomodoroRing
            remaining={remaining}
            duration={duration}
            size={280}
            stroke={8}
            isRunning={isRunning}
            label={POMODORO_STATUS_LABELS[mode]}
            tone={mode === POMODORO_MODES.FOCUS ? 'focus' : 'pause'}
            sublabel={
              mode === POMODORO_MODES.FOCUS
                ? `Sessão ${Math.min(sessionCount + 1, cycleLength)} de ${cycleLength}`
                : POMODORO_MODE_LABELS[mode]
            }
          />
        </div>

        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        <CurrentTaskBar
          task={currentTask}
          onOpenPicker={() => setPickerOpen(true)}
          onClear={() => selectTask(null)}
        />
      </div>

      <TaskPicker
        open={pickerOpen}
        tasks={pendingTasks}
        selectedId={currentTask?.id ?? null}
        onSelect={selectTask}
        onClose={() => setPickerOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(pendingMode)}
        title="Trocar de modo?"
        description="O timer está em andamento. Trocar de modo irá parar a sessão atual e aplicar a duração do novo modo."
        confirmLabel="Trocar modo"
        onConfirm={confirmModeChange}
        onCancel={() => setPendingMode(null)}
      />
    </div>
  );
}
