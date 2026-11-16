/**
 * Geração de identificadores legíveis: usr_9f3c1a2b, tsk_..., hab_..., note_...
 * Usa crypto.randomUUID quando disponível e cai para getRandomValues/Math.random.
 */

export const ID_PREFIXES = {
  user: 'usr',
  task: 'tsk',
  habit: 'hab',
  note: 'note',
};

function randomChunk() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return Math.random().toString(16).slice(2).padEnd(16, '0');
}

export function createId(prefix) {
  const safePrefix = prefix || 'id';
  return `${safePrefix}_${randomChunk().slice(0, 10)}`;
}

export const createUserId = () => createId(ID_PREFIXES.user);
export const createTaskId = () => createId(ID_PREFIXES.task);
export const createHabitId = () => createId(ID_PREFIXES.habit);
export const createNoteId = () => createId(ID_PREFIXES.note);
