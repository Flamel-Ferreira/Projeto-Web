import { useState } from 'react';
import NotesPanel from '../components/notes/NotesPanel.jsx';
import NoteReader from '../components/notes/NoteReader.jsx';
import NoteModal from '../components/notes/NoteModal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatLastEdited } from '../utils/date.js';
import { cn } from '../utils/cn.js';

export default function NotesPage() {
  const {
    notes,
    selectedNote,
    selectNote,
    addNote,
    updateNote,
    deleteNote,
    wordCountOf,
  } = useNotes();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [mobileReader, setMobileReader] = useState(false);

  const showReader = Boolean(selectedNote) && mobileReader;

  function handleSelect(id) {
    selectNote(id);
    setEditing(false);
    setMobileReader(true);
  }

  function handleCreate(values) {
    addNote(values);
    setModalOpen(false);
    setEditing(false);
    setMobileReader(true);
    showToast('Nota criada com sucesso.', 'success');
  }

  function handleSave(patch) {
    if (!selectedNote) return;
    updateNote(selectedNote.id, patch);
    setEditing(false);
    showToast('Nota atualizada.', 'success');
  }

  function handleDelete() {
    if (!pendingDelete) return;
    const remaining = notes.length - 1;
    deleteNote(pendingDelete.id);
    setPendingDelete(null);
    setEditing(false);
    if (remaining === 0) setMobileReader(false);
    showToast('Nota excluída.', 'info');
  }

  return (
    <div className="space-y-4">
      <h1 tabIndex={-1} className="sr-only">
        Anotações
      </h1>

      <div className="grid h-[calc(100vh-9rem)] min-h-[480px] grid-cols-1 gap-4 min-[900px]:grid-cols-[340px_minmax(0,1fr)]">
        <div className={cn('min-h-0', showReader && 'hidden min-[900px]:block')}>
          <NotesPanel
            notes={notes}
            selectedId={selectedNote?.id ?? null}
            onSelect={handleSelect}
            onCreate={() => setModalOpen(true)}
          />
        </div>

        <div
          className={cn(
            'min-h-0',
            !showReader && 'hidden min-[900px]:block',
          )}
        >
          <NoteReader
            note={selectedNote}
            wordCount={selectedNote ? wordCountOf(selectedNote) : 0}
            updatedLabel={
              selectedNote ? formatLastEdited(selectedNote.updatedAt) : ''
            }
            editing={editing}
            onEdit={() => setEditing(true)}
            onCancelEdit={() => setEditing(false)}
            onSave={handleSave}
            onDelete={() => selectedNote && setPendingDelete(selectedNote)}
            onBack={() => {
              setEditing(false);
              setMobileReader(false);
            }}
          />
        </div>
      </div>

      <NoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir nota?"
        description={
          pendingDelete
            ? `A nota “${pendingDelete.title}” será removida permanentemente.`
            : ''
        }
        confirmLabel="Excluir nota"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
