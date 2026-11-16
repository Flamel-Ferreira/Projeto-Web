import {
  GREETINGS,
  MONTHS_LONG,
  MONTHS_SHORT,
  PERIOD_MESSAGES,
  WEEK_DAYS,
} from './constants.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function capitalize(value = '') {
  const text = String(value);
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateKey(value) {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function parseDateKey(key) {
  if (!isDateKey(key)) return null;
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function coerceDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string' && isDateKey(input)) return parseDateKey(input);
  if (typeof input === 'string' || typeof input === 'number') {
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return new Date();
}

export function addDays(date, amount) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
}

/** Segunda-feira da semana da data informada, à meia-noite. */
export function startOfWeek(input = new Date()) {
  const date = coerceDate(input) ?? new Date();
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - offset);
  return result;
}

/** Sete chaves `YYYY-MM-DD`, sempre Seg → Dom. */
export function getWeekDates(reference = new Date()) {
  const monday = startOfWeek(reference);
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(monday, index)));
}

export function getWeekdayMeta(dayIndex) {
  return WEEK_DAYS.find((day) => day.value === dayIndex) ?? null;
}

export function getWeekdayShort(input) {
  const date = coerceDate(input);
  if (!date) return '';
  return getWeekdayMeta(date.getDay())?.short ?? '';
}

export function getWeekdayLong(input) {
  const date = coerceDate(input);
  if (!date) return '';
  return getWeekdayMeta(date.getDay())?.long ?? '';
}

export function formatClock(input = new Date()) {
  const date = coerceDate(input);
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Diferença em dias de calendário: `toKey - fromKey`. */
export function diffCalendarDays(fromKey, toKey) {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  if (!from || !to) return Number.NaN;

  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / DAY_MS);
}

/**
 * Tempo relativo dos cards de nota (D9):
 * hoje → 14:32 · ontem → Ontem · 2–6 dias → quinta-feira · ≥ 7 dias → 21 Out
 */
export function formatNoteTimestamp(input) {
  const date = coerceDate(input);
  if (!date) return '';

  const todayKey = toDateKey(new Date());
  const key = toDateKey(date);

  if (key === todayKey) return formatClock(date);

  const daysAgo = diffCalendarDays(key, todayKey);
  if (daysAgo === 1) return 'Ontem';
  if (daysAgo >= 2 && daysAgo <= 6) return getWeekdayLong(date);

  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** "hoje às 14:32" / "ontem às 09:10" / "21 Out às 10:00" */
export function formatLastEdited(input) {
  const date = coerceDate(input);
  if (!date) return '';

  const todayKey = toDateKey(new Date());
  const key = toDateKey(date);
  const clock = formatClock(date);

  if (key === todayKey) return `hoje às ${clock}`;

  const daysAgo = diffCalendarDays(key, todayKey);
  if (daysAgo === 1) return `ontem às ${clock}`;

  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} às ${clock}`;
}

/** "Quarta-feira, 24 de Outubro" */
export function formatLongDate(input = new Date()) {
  const date = coerceDate(input);
  if (!date) return '';

  const weekday = capitalize(getWeekdayLong(date));
  const month = MONTHS_LONG[date.getMonth()];
  return `${weekday}, ${date.getDate()} de ${month}`;
}

export function getPeriod(input = new Date()) {
  const date = coerceDate(input) ?? new Date();
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

export function getGreeting(input = new Date()) {
  return GREETINGS[getPeriod(input)];
}

export function getPeriodMessage(input = new Date()) {
  return PERIOD_MESSAGES[getPeriod(input)];
}

/** Segundos → "25:00". */
export function formatTimer(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function isTodayKey(key) {
  return isDateKey(key) && key === toDateKey(new Date());
}

export function isFutureDateKey(key) {
  if (!isDateKey(key)) return false;
  return diffCalendarDays(toDateKey(new Date()), key) > 0;
}

export function getMonthShort(monthIndex) {
  return MONTHS_SHORT[((monthIndex % 12) + 12) % 12];
}

export function getMonthLong(monthIndex) {
  return MONTHS_LONG[((monthIndex % 12) + 12) % 12];
}
