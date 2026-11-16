import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';
import {
  ALL_WEEK_DAYS,
  HABIT_CATEGORIES,
  HABIT_CATEGORY_ORDER,
  LIMITS,
  STORAGE_KEYS,
} from '../utils/constants.js';
import { createHabitId } from '../utils/ids.js';
import { readCollection, writeCollection } from '../utils/storage.js';
import {
  addDays,
  diffCalendarDays,
  getWeekDates,
  isDateKey,
  toDateKey,
} from '../utils/date.js';

const HabitsContext = createContext(null);
const CATEGORY_SET = new Set(HABIT_CATEGORY_ORDER);
const MAX_STREAK_DAYS = 3660;

function normalizeHabit(raw, index) {
  if (!raw || typeof raw.id !== 'string') return null;
  if (typeof raw.name !== 'string' || !raw.name.trim()) return null;

  const days = Array.isArray(raw.days)
    ? [...new Set(raw.days.filter((day) => ALL_WEEK_DAYS.includes(day)))]
    : [...ALL_WEEK_DAYS];

  return {
    id: raw.id,
    name: raw.name.trim().slice(0, LIMITS.habitNameMax),
    category: CATEGORY_SET.has(raw.category)
      ? raw.category
      : HABIT_CATEGORIES.HEALTH,
    days: days.length > 0 ? days : [...ALL_WEEK_DAYS],
    goal:
      Number.isInteger(raw.goal) && raw.goal >= 1 && raw.goal <= 5
        ? raw.goal
        : 1,
    history:
      raw.history && typeof raw.history === 'object' && !Array.isArray(raw.history)
        ? raw.history
        : {},
    createdAt:
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : new Date(Date.now() + index).toISOString(),
    archived: Boolean(raw.archived),
  };
}

function readHabits(key) {
  return readCollection(key)
    .map(normalizeHabit)
    .filter(Boolean)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

function isDone(habit, dateKey) {
  return habit.history?.[dateKey] === true;
}

/** Sequência conforme RN-22: ignora hoje não concluído, pula dias não agendados. */
export function streakFor(habit, reference = new Date()) {
  if (!habit || !Array.isArray(habit.days) || habit.days.length === 0) return 0;

  let streak = 0;
  let cursor = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
  );

  // Hoje agendado e ainda não concluído não quebra a sequência.
  if (habit.days.includes(cursor.getDay()) && !isDone(habit, toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  for (let index = 0; index < MAX_STREAK_DAYS; index += 1) {
    if (!habit.days.includes(cursor.getDay())) {
      cursor = addDays(cursor, -1);
      continue;
    }

    if (isDone(habit, toDateKey(cursor))) {
      streak += 1;
      cursor = addDays(cursor, -1);
      continue;
    }

    break;
  }

  return streak;
}

export function HabitsProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const storageKey = STORAGE_KEYS.habits(user.userId);
  const [habits, setHabits] = useState(() => readHabits(storageKey));
  const [todayKey, setTodayKey] = useState(() => toDateKey());

  useEffect(() => {
    if (!writeCollection(storageKey, habits)) {
      showToast(
        'Não foi possível salvar seus hábitos no navegador.',
        'error',
        { duration: 6000 },
      );
    }
  }, [storageKey, habits, showToast]);

  // Detecta a virada do dia sem exigir recarregar a página.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextKey = toDateKey();
      setTodayKey((current) => (current === nextKey ? current : nextKey));
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const weekDates = useMemo(() => getWeekDates(), [todayKey]);
  const todayWeekday = useMemo(() => {
    const [year, month, day] = todayKey.split('-').map(Number);
    return new Date(year, month - 1, day).getDay();
  }, [todayKey]);

  const todayHabits = useMemo(
    () =>
      habits.filter(
        (habit) => !habit.archived && habit.days.includes(todayWeekday),
      ),
    [habits, todayWeekday],
  );

  const dailyConsistency = useMemo(() => {
    const total = todayHabits.length;
    const completed = todayHabits.filter((habit) =>
      isDone(habit, todayKey),
    ).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { percent, completed, total };
  }, [todayHabits, todayKey]);

  const streakOf = useCallback(
    (id) => {
      const habit = habits.find((entry) => entry.id === id);
      return habit ? streakFor(habit) : 0;
    },
    [habits],
  );

  const currentStreak = useMemo(() => {
    const values = todayHabits
      .map((habit) => streakFor(habit))
      .filter((value) => value > 0);
    return values.length > 0 ? Math.max(...values) : 0;
  }, [todayHabits]);

  const addHabit = useCallback(
    ({ name, category, days, goal }) => {
      const safeDays = Array.isArray(days)
        ? [...new Set(days.filter((day) => ALL_WEEK_DAYS.includes(day)))]
        : [...ALL_WEEK_DAYS];
      const now = new Date().toISOString();

      const habit = {
        id: createHabitId(),
        name: String(name ?? '').trim().slice(0, LIMITS.habitNameMax),
        category: CATEGORY_SET.has(category)
          ? category
          : HABIT_CATEGORIES.HEALTH,
        days: safeDays.length > 0 ? safeDays : [...ALL_WEEK_DAYS],
        goal: Number.isInteger(goal) && goal >= 1 && goal <= 5 ? goal : 1,
        history: {},
        createdAt: now,
        archived: false,
      };

      setHabits((current) =>
        [...current, habit].sort((a, b) =>
          String(a.createdAt).localeCompare(String(b.createdAt)),
        ),
      );
      return habit;
    },
    [],
  );

  const updateHabit = useCallback((id, patch = {}) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;

        const next = { ...habit, ...patch };
        if (patch.name !== undefined) {
          next.name = String(patch.name).trim().slice(0, LIMITS.habitNameMax);
        }
        if (patch.category !== undefined && !CATEGORY_SET.has(patch.category)) {
          next.category = habit.category;
        }
        if (Array.isArray(patch.days)) {
          const days = [
            ...new Set(patch.days.filter((day) => ALL_WEEK_DAYS.includes(day))),
          ];
          next.days = days.length > 0 ? days : habit.days;
        }
        if (patch.goal !== undefined) {
          next.goal =
            Number.isInteger(patch.goal) && patch.goal >= 1 && patch.goal <= 5
              ? patch.goal
              : habit.goal;
        }
        return next;
      }),
    );
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }, []);

  const toggleDay = useCallback(
    (id, dateKey) => {
      if (!isDateKey(dateKey) || !weekDates.includes(dateKey)) return;
      if (diffCalendarDays(dateKey, todayKey) < 0) return;

      setHabits((current) =>
        current.map((habit) => {
          if (habit.id !== id) return habit;

          const weekday = new Date(
            Number(dateKey.slice(0, 4)),
            Number(dateKey.slice(5, 7)) - 1,
            Number(dateKey.slice(8, 10)),
          ).getDay();

          if (!habit.days.includes(weekday)) return habit;

          return {
            ...habit,
            history: {
              ...habit.history,
              [dateKey]: habit.history?.[dateKey] !== true,
            },
          };
        }),
      );
    },
    [todayKey, weekDates],
  );

  const value = useMemo(
    () => ({
      habits,
      weekDates,
      todayKey,
      todayHabits,
      dailyConsistency,
      currentStreak,
      streakOf,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleDay,
    }),
    [
      habits,
      weekDates,
      todayKey,
      todayHabits,
      dailyConsistency,
      currentStreak,
      streakOf,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleDay,
    ],
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits deve ser usado dentro de <HabitsProvider>.');
  }
  return context;
}
