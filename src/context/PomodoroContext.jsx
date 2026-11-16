import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext.jsx';
import { useTasks } from './TasksContext.jsx';
import { useToast } from './ToastContext.jsx';
import {
  POMODORO_CYCLE_LENGTH,
  POMODORO_DURATIONS,
  POMODORO_MODE_ORDER,
  POMODORO_MODES,
  STORAGE_KEYS,
  TASK_STATUS,
} from '../utils/constants.js';
import { readJSON, writeJSON } from '../utils/storage.js';
import { formatTimer, toDateKey } from '../utils/date.js';
import { playChime, unlockAudio } from '../utils/sound.js';

const PomodoroContext = createContext(null);
const MODE_SET = new Set(POMODORO_MODE_ORDER);

function nowIso() {
  return new Date().toISOString();
}

function defaultState() {
  return {
    mode: POMODORO_MODES.FOCUS,
    durations: { ...POMODORO_DURATIONS },
    remaining: POMODORO_DURATIONS[POMODORO_MODES.FOCUS],
    isRunning: false,
    endsAt: null,
    sessionCount: 0,
    sessionDate: toDateKey(),
    cycleLength: POMODORO_CYCLE_LENGTH,
    currentTaskId: null,
    updatedAt: nowIso(),
  };
}

function readState(key) {
  const raw = readJSON(key, null);
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;

  const mode = MODE_SET.has(raw.mode) ? raw.mode : base.mode;
  const durations = { ...base.durations };
  const storedDurations =
    raw.durations && typeof raw.durations === 'object' ? raw.durations : {};

  for (const item of POMODORO_MODE_ORDER) {
    const value = storedDurations[item];
    if (Number.isFinite(value) && value > 0) {
      durations[item] = Math.floor(value);
    }
  }

  let remaining = Number.isFinite(raw.remaining)
    ? Math.max(0, Math.round(raw.remaining))
    : durations[mode];

  let endsAt =
    Number.isFinite(raw.endsAt) && raw.endsAt > 0 ? Math.floor(raw.endsAt) : null;
  let isRunning = Boolean(raw.isRunning) && Boolean(endsAt);

  if (isRunning) {
    remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  } else {
    endsAt = null;
  }

  const today = toDateKey();
  const sessionDate =
    typeof raw.sessionDate === 'string' ? raw.sessionDate : today;
  let sessionCount = Number.isFinite(raw.sessionCount)
    ? Math.max(0, Math.floor(raw.sessionCount))
    : 0;

  if (sessionDate !== today) {
    sessionCount = 0;
  }

  return {
    mode,
    durations,
    remaining,
    isRunning,
    endsAt,
    sessionCount,
    sessionDate: today,
    cycleLength: POMODORO_CYCLE_LENGTH,
    currentTaskId:
      typeof raw.currentTaskId === 'string' ? raw.currentTaskId : null,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso(),
  };
}

function withCurrentDay(state) {
  const today = toDateKey();
  if (state.sessionDate === today) return state;
  return { ...state, sessionDate: today, sessionCount: 0 };
}

export function PomodoroProvider({ children }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { showToast } = useToast();
  const storageKey = STORAGE_KEYS.pomodoro(user.userId);
  const [state, setState] = useState(() => readState(storageKey));
  const stateRef = useRef(state);
  const warnedStorage = useRef(false);
  const completionRef = useRef(false);

  stateRef.current = state;

  const commit = useCallback(
    (next) => {
      stateRef.current = next;
      setState(next);
      if (!writeJSON(storageKey, next) && !warnedStorage.current) {
        warnedStorage.current = true;
        showToast(
          'Não foi possível salvar o timer no navegador.',
          'error',
          { duration: 6000 },
        );
      }
    },
    [showToast, storageKey],
  );

  const completeSession = useCallback(() => {
    if (completionRef.current) return;

    const current = withCurrentDay(stateRef.current);
    if (!current.isRunning) return;

    completionRef.current = true;

    const finishedFocus = current.mode === POMODORO_MODES.FOCUS;
    const sessionCount = finishedFocus
      ? current.sessionCount + 1
      : current.sessionCount;
    const nextMode = finishedFocus
      ? sessionCount % current.cycleLength === 0
        ? POMODORO_MODES.LONG
        : POMODORO_MODES.SHORT
      : POMODORO_MODES.FOCUS;

    const next = {
      ...current,
      mode: nextMode,
      remaining: current.durations[nextMode],
      isRunning: false,
      endsAt: null,
      sessionCount,
      sessionDate: toDateKey(),
      updatedAt: nowIso(),
    };

    commit(next);
    playChime();

    if (finishedFocus) {
      showToast(
        nextMode === POMODORO_MODES.LONG
          ? 'Ciclo concluído! Pausa longa de 15 minutos.'
          : 'Sessão de foco concluída! Faça uma pausa curta.',
        'success',
        { duration: 6000 },
      );
    } else {
      showToast('Pausa concluída. Hora de voltar ao foco.', 'info', {
        duration: 6000,
      });
    }
  }, [commit, showToast]);

  const start = useCallback(() => {
    completionRef.current = false;
    unlockAudio();
    const current = withCurrentDay(stateRef.current);
    const remaining =
      current.remaining > 0
        ? current.remaining
        : current.durations[current.mode];

    commit({
      ...current,
      remaining,
      isRunning: true,
      endsAt: Date.now() + remaining * 1000,
      updatedAt: nowIso(),
    });
  }, [commit]);

  const pause = useCallback(() => {
    const current = stateRef.current;
    if (!current.isRunning) return;

    const remaining = Math.max(
      0,
      Math.ceil(((current.endsAt ?? Date.now()) - Date.now()) / 1000),
    );

    commit({
      ...current,
      remaining,
      isRunning: false,
      endsAt: null,
      updatedAt: nowIso(),
    });
  }, [commit]);

  const reset = useCallback(() => {
    completionRef.current = false;
    const current = withCurrentDay(stateRef.current);
    commit({
      ...current,
      remaining: current.durations[current.mode],
      isRunning: false,
      endsAt: null,
      updatedAt: nowIso(),
    });
  }, [commit]);

  const setMode = useCallback(
    (mode) => {
      if (!MODE_SET.has(mode)) return;
      completionRef.current = false;
      const current = withCurrentDay(stateRef.current);
      commit({
        ...current,
        mode,
        remaining: current.durations[mode],
        isRunning: false,
        endsAt: null,
        updatedAt: nowIso(),
      });
    },
    [commit],
  );

  const selectTask = useCallback(
    (taskId) => {
      const nextId = typeof taskId === 'string' ? taskId : null;
      const current = stateRef.current;
      if (current.currentTaskId === nextId) return;

      commit({
        ...current,
        currentTaskId: nextId,
        updatedAt: nowIso(),
      });
    },
    [commit],
  );

  // Relógio: recalcula o restante a partir de endsAt a cada 250 ms.
  useEffect(() => {
    if (!state.isRunning || !state.endsAt) return undefined;

    function tick() {
      const current = stateRef.current;
      if (!current.isRunning || !current.endsAt) return;

      const remaining = Math.max(
        0,
        Math.ceil((current.endsAt - Date.now()) / 1000),
      );

      if (remaining <= 0) {
        completeSession();
        return;
      }

      if (remaining !== current.remaining) {
        const next = { ...current, remaining };
        stateRef.current = next;
        setState(next);
      }
    }

    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [state.isRunning, state.endsAt, completeSession]);

  // Virada do dia: zera a contagem de sessões sem interromper o timer.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = stateRef.current;
      if (current.sessionDate !== toDateKey()) {
        commit({
          ...current,
          sessionDate: toDateKey(),
          sessionCount: 0,
          updatedAt: nowIso(),
        });
      }
    }, 60000);
    return () => window.clearInterval(timer);
  }, [commit]);

  // Tarefa concluída/excluída deixa de ser a tarefa atual.
  useEffect(() => {
    const id = stateRef.current.currentTaskId;
    if (!id) return;

    const available = tasks.some(
      (task) => task.id === id && task.status !== TASK_STATUS.DONE,
    );

    if (!available) {
      commit({
        ...stateRef.current,
        currentTaskId: null,
        updatedAt: nowIso(),
      });
    }
  }, [tasks, commit]);

  const duration = state.durations[state.mode];
  const currentTask = useMemo(
    () =>
      tasks.find(
        (task) =>
          task.id === state.currentTaskId && task.status !== TASK_STATUS.DONE,
      ) ?? null,
    [tasks, state.currentTaskId],
  );

  const value = useMemo(
    () => ({
      mode: state.mode,
      duration,
      remaining: state.remaining,
      progress:
        duration > 0
          ? Math.min(1, Math.max(0, state.remaining / duration))
          : 0,
      isRunning: state.isRunning,
      formattedTime: formatTimer(state.remaining),
      sessionCount: state.sessionCount,
      cycleLength: state.cycleLength,
      currentTask,
      setMode,
      start,
      pause,
      reset,
      selectTask,
    }),
    [
      state.mode,
      duration,
      state.remaining,
      state.isRunning,
      state.sessionCount,
      state.cycleLength,
      state.currentTaskId,
      currentTask,
      setMode,
      start,
      pause,
      reset,
      selectTask,
    ],
  );

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error(
      'usePomodoro deve ser usado dentro de <PomodoroProvider>.',
    );
  }
  return context;
}
