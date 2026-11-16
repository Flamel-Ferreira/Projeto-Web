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
  LIMITS,
  STORAGE_KEYS,
  TASK_CATEGORIES,
  TASK_CATEGORY_ORDER,
  TASK_PRIORITIES,
  TASK_PRIORITY_ORDER,
  TASK_PRIORITY_RANK,
  TASK_STATUS,
  TASK_STATUS_ORDER,
} from '../utils/constants.js';
import { createTaskId } from '../utils/ids.js';
import { readCollection, writeCollection } from '../utils/storage.js';

const TasksContext = createContext(null);

const STATUS_SET = new Set(TASK_STATUS_ORDER);
const CATEGORY_SET = new Set(TASK_CATEGORY_ORDER);
const PRIORITY_SET = new Set(TASK_PRIORITY_ORDER);

function nowIso() {
  return new Date().toISOString();
}

function byOrder(a, b) {
  if (a.order !== b.order) return a.order - b.order;
  return String(a.createdAt).localeCompare(String(b.createdAt));
}

function normalizeTask(raw, index) {
  if (!raw || typeof raw.id !== 'string') return null;
  if (typeof raw.title !== 'string' || !raw.title.trim()) return null;

  const now = nowIso();
  const status = STATUS_SET.has(raw.status) ? raw.status : TASK_STATUS.TODO;

  return {
    id: raw.id,
    title: raw.title.trim().slice(0, LIMITS.taskTitleMax),
    status,
    category: CATEGORY_SET.has(raw.category)
      ? raw.category
      : TASK_CATEGORIES.WORK,
    priority: PRIORITY_SET.has(raw.priority)
      ? raw.priority
      : TASK_PRIORITIES.MEDIUM,
    order:
      Number.isFinite(raw.order) && raw.order >= 0
        ? Math.floor(raw.order)
        : index,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
    completedAt:
      typeof raw.completedAt === 'string' ? raw.completedAt : null,
  };
}

function readTasks(key) {
  return readCollection(key)
    .map(normalizeTask)
    .filter(Boolean);
}

function sortPriority(a, b) {
  const rankA = TASK_PRIORITY_RANK[a.priority] ?? 1;
  const rankB = TASK_PRIORITY_RANK[b.priority] ?? 1;
  if (rankA !== rankB) return rankA - rankB;
  return byOrder(a, b);
}

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const storageKey = STORAGE_KEYS.tasks(user.userId);
  const [tasks, setTasks] = useState(() => readTasks(storageKey));

  useEffect(() => {
    if (!writeCollection(storageKey, tasks)) {
      showToast(
        'Não foi possível salvar suas tarefas no navegador.',
        'error',
        { duration: 6000 },
      );
    }
  }, [storageKey, tasks, showToast]);

  const byStatus = useCallback(
    (status) =>
      tasks
        .filter((task) => task.status === status)
        .sort(byOrder),
    [tasks],
  );

  const counts = useMemo(() => {
    const result = {
      todo: 0,
      in_progress: 0,
      done: 0,
      total: tasks.length,
      completed: 0,
      pending: 0,
    };

    for (const task of tasks) {
      result[task.status] = (result[task.status] ?? 0) + 1;
    }

    result.completed = result.done;
    result.pending = result.total - result.completed;
    return result;
  }, [tasks]);

  const priorityTasks = useCallback(
    (limit = 3) =>
      tasks
        .filter((task) => task.status !== TASK_STATUS.DONE)
        .sort(sortPriority)
        .slice(0, Math.max(0, limit)),
    [tasks],
  );

  const addTask = useCallback(
    ({ title, status = TASK_STATUS.TODO, category, priority }) => {
      const safeStatus = STATUS_SET.has(status) ? status : TASK_STATUS.TODO;
      const now = nowIso();
      const order = tasks.filter((task) => task.status === safeStatus).length;

      const task = {
        id: createTaskId(),
        title: String(title ?? '').trim().slice(0, LIMITS.taskTitleMax),
        status: safeStatus,
        category: CATEGORY_SET.has(category) ? category : TASK_CATEGORIES.WORK,
        priority: PRIORITY_SET.has(priority)
          ? priority
          : TASK_PRIORITIES.MEDIUM,
        order,
        createdAt: now,
        updatedAt: now,
        completedAt: safeStatus === TASK_STATUS.DONE ? now : null,
      };

      setTasks((current) => [...current, task]);
      return task;
    },
    [tasks],
  );

  const updateTask = useCallback((id, patch = {}) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;

        const next = { ...task, ...patch, updatedAt: nowIso() };
        if (patch.title !== undefined) {
          next.title = String(patch.title).trim().slice(0, LIMITS.taskTitleMax);
        }
        if (task.status === TASK_STATUS.DONE && next.status !== TASK_STATUS.DONE) {
          next.completedAt = null;
        }
        if (task.status !== TASK_STATUS.DONE && next.status === TASK_STATUS.DONE) {
          next.completedAt = task.completedAt ?? nowIso();
        }
        return next;
      }),
    );
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((current) => {
      const target = current.find((task) => task.id === id);
      if (!target) return current;

      const completed = target.status !== TASK_STATUS.DONE;
      const nextStatus = completed ? TASK_STATUS.DONE : TASK_STATUS.TODO;
      const order = current.filter(
        (task) => task.status === nextStatus && task.id !== id,
      ).length;

      return current.map((task) =>
        task.id === id
          ? {
              ...task,
              status: nextStatus,
              order,
              completedAt: completed ? nowIso() : null,
              updatedAt: nowIso(),
            }
          : task,
      );
    });
  }, []);

  const moveTask = useCallback((id, toStatus, toIndex = 0) => {
    if (!STATUS_SET.has(toStatus)) return;

    setTasks((current) => {
      const active = current.find((task) => task.id === id);
      if (!active) return current;

      const now = nowIso();
      const clamp = (value, max) =>
        Math.max(0, Math.min(Number.isFinite(value) ? value : 0, max));

      if (active.status === toStatus) {
        const column = current
          .filter((task) => task.status === toStatus && task.id !== id)
          .sort(byOrder);

        const index = clamp(toIndex, column.length);
        column.splice(index, 0, {
          ...active,
          status: toStatus,
          updatedAt: now,
        });

        const reordered = new Map(
          column.map((task, order) => [task.id, { ...task, order }]),
        );

        return current.map((task) => reordered.get(task.id) ?? task);
      }

      const sourceColumn = current
        .filter((task) => task.status === active.status && task.id !== id)
        .sort(byOrder)
        .map((task, order) => ({ ...task, order }));

      const targetColumn = current
        .filter((task) => task.status === toStatus)
        .sort(byOrder);

      const moved = {
        ...active,
        status: toStatus,
        completedAt:
          toStatus === TASK_STATUS.DONE
            ? active.completedAt ?? now
            : null,
        updatedAt: now,
      };

      const index = clamp(toIndex, targetColumn.length);
      targetColumn.splice(index, 0, moved);

      const nextColumns = new Map();
      targetColumn.forEach((task, order) => {
        nextColumns.set(task.id, { ...task, order });
      });
      sourceColumn.forEach((task, order) => {
        nextColumns.set(task.id, { ...task, order });
      });

      return current.map((task) => nextColumns.get(task.id) ?? task);
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      counts,
      byStatus,
      priorityTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      moveTask,
    }),
    [
      tasks,
      counts,
      byStatus,
      priorityTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      moveTask,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de <TasksProvider>.');
  }
  return context;
}
