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
  NOTEBOOK_ORDER,
  NOTEBOOKS,
  STORAGE_KEYS,
} from '../utils/constants.js';
import { createNoteId } from '../utils/ids.js';
import { readCollection, writeCollection } from '../utils/storage.js';
import { countWords } from '../utils/markdown.js';

const NotesContext = createContext(null);
const NOTEBOOK_SET = new Set(NOTEBOOK_ORDER);

function normalizeNote(raw, index) {
  if (!raw || typeof raw.id !== 'string') return null;
  if (typeof raw.title !== 'string' || !raw.title.trim()) return null;

  const now = new Date(Date.now() + index).toISOString();

  return {
    id: raw.id,
    title: raw.title.trim().slice(0, LIMITS.noteTitleMax),
    notebook: NOTEBOOK_SET.has(raw.notebook) ? raw.notebook : NOTEBOOKS.FOCUS,
    content: typeof raw.content === 'string' ? raw.content : '',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
  };
}

function sortNotes(notes) {
  return [...notes].sort((a, b) =>
    String(b.updatedAt).localeCompare(String(a.updatedAt)),
  );
}

function readNotes(key) {
  return sortNotes(readCollection(key).map(normalizeNote).filter(Boolean));
}

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const storageKey = STORAGE_KEYS.notes(user.userId);
  const [notes, setNotes] = useState(() => readNotes(storageKey));
  const [selectedId, setSelectedId] = useState(() => {
    const initial = readNotes(storageKey);
    return initial[0]?.id ?? null;
  });

  useEffect(() => {
    if (!writeCollection(storageKey, notes)) {
      showToast(
        'Não foi possível salvar suas notas no navegador.',
        'error',
        { duration: 6000 },
      );
    }
  }, [storageKey, notes, showToast]);

  // Mantém uma seleção válida quando a nota ativa deixa de existir.
  useEffect(() => {
    if (selectedId && notes.some((note) => note.id === selectedId)) return;
    setSelectedId(notes[0]?.id ?? null);
  }, [notes, selectedId]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) ?? null,
    [notes, selectedId],
  );

  const selectNote = useCallback((id) => {
    setSelectedId(typeof id === 'string' ? id : null);
  }, []);

  const addNote = useCallback(
    ({ title, notebook, content }) => {
      const now = new Date().toISOString();
      const note = {
        id: createNoteId(),
        title: String(title ?? '').trim().slice(0, LIMITS.noteTitleMax),
        notebook: NOTEBOOK_SET.has(notebook) ? notebook : NOTEBOOKS.FOCUS,
        content: typeof content === 'string' ? content : '',
        createdAt: now,
        updatedAt: now,
      };

      setNotes((current) => sortNotes([...current, note]));
      setSelectedId(note.id);
      return note;
    },
    [],
  );

  const updateNote = useCallback((id, patch = {}) => {
    const now = new Date().toISOString();

    setNotes((current) =>
      sortNotes(
        current.map((note) => {
          if (note.id !== id) return note;

          const next = { ...note, ...patch, updatedAt: now };
          if (patch.title !== undefined) {
            next.title = String(patch.title)
              .trim()
              .slice(0, LIMITS.noteTitleMax);
          }
          if (patch.notebook !== undefined && !NOTEBOOK_SET.has(patch.notebook)) {
            next.notebook = note.notebook;
          }
          if (patch.content !== undefined && typeof patch.content !== 'string') {
            next.content = note.content;
          }
          return next;
        }),
      ),
    );
  }, []);

  const deleteNote = useCallback(
    (id) => {
      const remaining = notes.filter((note) => note.id !== id);
      setNotes(remaining);
      if (selectedId === id) {
        setSelectedId(remaining[0]?.id ?? null);
      }
    },
    [notes, selectedId],
  );

  const wordCountOf = useCallback((note) => {
    if (typeof note === 'string') return countWords(note);
    return countWords(note?.content ?? '');
  }, []);

  const value = useMemo(
    () => ({
      notes,
      selectedNote,
      selectNote,
      addNote,
      updateNote,
      deleteNote,
      wordCountOf,
    }),
    [
      notes,
      selectedNote,
      selectNote,
      addNote,
      updateNote,
      deleteNote,
      wordCountOf,
    ],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes deve ser usado dentro de <NotesProvider>.');
  }
  return context;
}
