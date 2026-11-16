import { FileText, Plus } from 'lucide-react';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import NoteListItem from './NoteListItem.jsx';
import { getNotePreview } from '../../utils/markdown.js';
import { formatNoteTimestamp } from '../../utils/date.js';

export default function NotesPanel({ notes, selectedId, onSelect, onCreate }) {
  const countLabel =
    notes.length === 1
      ? '1 nota guardada'
      : `${notes.length} notas guardadas`;

  return (
    <section
      aria-label="Lista de notas"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="border-b border-border p-3">
        <Button
          fullWidth
          icon={Plus}
          onClick={onCreate}
          className="!bg-[#A9A2FB] !text-[#1B1733] !shadow-none hover:!bg-[#B9B3FC] active:!bg-[#9C94F0]"
        >
          Nova Nota
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-3">
            <EmptyState
              icon={FileText}
              title="Nenhuma nota ainda"
              description="Crie sua primeira nota para guardar ideias, referências e planos."
              className="border-white/[0.06] bg-transparent px-4 py-8"
            />
          </div>
        ) : (
          notes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              active={note.id === selectedId}
              preview={getNotePreview(note.content, 2)}
              timeLabel={formatNoteTimestamp(note.updatedAt)}
              onClick={() => onSelect(note.id)}
            />
          ))
        )}
      </div>

      <footer className="border-t border-border px-4 py-3 text-[11px] text-text-muted">
        {countLabel}
      </footer>
    </section>
  );
}
