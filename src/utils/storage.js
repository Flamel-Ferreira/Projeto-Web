import { SCHEMA_VERSION } from './constants.js';

/**
 * Camada de persistência tolerante a falhas.
 * - Usa localStorage quando disponível.
 * - Cai para memória (Map) quando o storage está bloqueado/indisponível.
 * - Toda leitura é segura contra JSON inválido.
 */

const memory = new Map();
let persistent = null;

function hasWindow() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function isStoragePersistent() {
  if (persistent !== null) return persistent;

  if (!hasWindow()) {
    persistent = false;
    return persistent;
  }

  try {
    const probe = '__lifepulse_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    persistent = true;
  } catch {
    persistent = false;
  }

  return persistent;
}

function getRaw(key) {
  if (isStoragePersistent()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  }

  return memory.get(key) ?? null;
}

function setRaw(key, value) {
  if (isStoragePersistent()) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      // Quota excedida ou bloqueio momentâneo: mantém em memória.
      memory.set(key, value);
      return false;
    }
  }

  memory.set(key, value);
  return true;
}

function removeRaw(key) {
  memory.delete(key);

  if (isStoragePersistent()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignora
    }
  }
}

/** Lê e desserializa um valor. Retorna fallback em caso de ausência/erro. */
export function readJSON(key, fallback = null) {
  const raw = getRaw(key);
  if (raw === null || raw === undefined) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    removeRaw(key);
    return fallback;
  }
}

/** Serializa e persiste. Retorna false se não foi possível persistir. */
export function writeJSON(key, value) {
  try {
    return setRaw(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function removeKey(key) {
  removeRaw(key);
}

/** Lê `{ schemaVersion, items }` e devolve apenas o array. */
export function readCollection(key) {
  const data = readJSON(key, null);
  if (!data || !Array.isArray(data.items)) return [];
  if (data.schemaVersion !== SCHEMA_VERSION) return [];
  return data.items;
}

/** Grava uma coleção versionada. */
export function writeCollection(key, items) {
  return writeJSON(key, {
    schemaVersion: SCHEMA_VERSION,
    items: Array.isArray(items) ? items : [],
  });
}

/** Remove uma coleção inteira. */
export function removeCollection(key) {
  removeRaw(key);
}

/** Apenas para testes/QA: limpa o fallback em memória. */
export function __clearMemoryStorage() {
  memory.clear();
}
