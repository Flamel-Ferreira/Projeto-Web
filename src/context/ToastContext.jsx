import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createId } from '../utils/ids.js';

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 4;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', options = {}) => {
    if (!message) return null;

    const id = createId('toast');
    const duration =
      typeof options.duration === 'number' ? options.duration : DEFAULT_DURATION;

    setToasts((current) => {
      const next = [...current, { id, message, type, duration }];
      return next.slice(-MAX_TOASTS);
    });

    if (duration > 0) {
      const timer = window.setTimeout(() => {
        timers.current.delete(id);
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, duration);
      timers.current.set(id, timer);
    }

    return id;
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
  }
  return context;
}
