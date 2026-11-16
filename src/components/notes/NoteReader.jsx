import { ArrowLeft, FileText, Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import MarkdownView from './MarkdownView.jsx';
import NoteEditorForm from './NoteEditorForm.jsx';
import {
  NOTEBOOK_DETAIL_LABELS,
  NOTEBOOKS,
} from '../../utils/constants.js';

export default function NoteReader({
  note,
  wordCount,
  updatedLabel,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onBack,
}) {
  if (!note) {
    return (
      <section
        aria-label="Leitor de nota"
        className="flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-surface"
      >
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={FileText}
            title="Selecione uma nota"
            description="Escolha uma nota na lista ao lado ou crie uma nova para começar."
            className="border-white/[0.06] bg-transparent"
          />
        </div>
      </section>
    );
  }

  if (editing) {
    return (
      <section
        aria-label="Edição de nota"
        className="flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-surface"
      >
        {onBack && (
          <div className="border-b border-border px-4 py-2 min-[900px]:hidden">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Voltar
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1">
          <NoteEditorForm
            note={note}
            onSave={onSave}
            onCancel={onCancelEdit}
          />
        </div>
      </section>
    );
  }

  const notebookLabel =
    NOTEBOOK_DETAIL_LABELS[note.notebook] ?? NOTEBOOKS.FOCUS;
  const empty = !note.content || !note.content.trim();

  return (
    <section
      aria-label="Leitor de nota"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-start justify-between gap-3 px-6 pt-5">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text min-[900px]:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Voltar
            </button>
          ) : (
            <span />
          )}

          <Button
            variant="ghost"
            size="sm"
            icon={Pencil}
            onClick={onEdit}
            className="shrink-0"
          >
            Editar
          </Button>
        </div>

        <div className="px-6 pb-8 pt-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
            Caderno / {notebookLabel}
          </p>
          <h2 className="mt-2 text-[34px] font-light leading-[1.1] tracking-tight text-text sm:text-[44px]">
            {note.title}
          </h2>
          <p className="mt-3 text-xs text-text-muted">
            Última edição {updatedLabel} • {wordCount}{' '}
            {wordCount === 1 ? 'palavra' : 'palavras'}
          </p>

          <div className="mt-7">
            {empty ? (
              <EmptyState
                icon={FileText}
                title="Esta nota está vazia"
                description="Use o botão Editar para adicionar conteúdo em Markdown."
                action={
                  <Button size="sm" icon={Pencil} onClick={onEdit}>
                    Editar nota
                  </Button>
                }
                className="border-white/[0.06] bg-transparent"
              />
            ) : (
              <MarkdownView content={note.content} />
            )}
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-border px-4 py-2.5">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Excluir nota
        </button>
      </footer>
    </section>
  );
}
