import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import {
  LIMITS,
  NOTEBOOK_DETAIL_LABELS,
  NOTEBOOK_LABELS,
  NOTEBOOK_ORDER,
  NOTEBOOKS,
} from '../../utils/constants.js';

const NOTEBOOK_OPTIONS = NOTEBOOK_ORDER.map((value) => ({
  value,
  label: NOTEBOOK_LABELS[value],
}));

export default function NoteEditorForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title);
  const [notebook, setNotebook] = useState(note.notebook);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(note.title);
    setNotebook(note.notebook);
    setContent(note.content);
    setError('');
  }, [note]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) {
      setError('Informe o título da nota.');
      return;
    }

    onSave?.({
      title: value.slice(0, LIMITS.noteTitleMax),
      notebook,
      content,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-light">
          Editando nota
        </p>

        <Input
          id="note-editor-title"
          label="Título"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
          error={error}
          hint={`${title.length}/${LIMITS.noteTitleMax}`}
          maxLength={LIMITS.noteTitleMax}
          autoFocus
          required
        />

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Caderno</p>
          <SegmentedControl
            options={NOTEBOOK_OPTIONS}
            value={notebook}
            onChange={setNotebook}
            columns={3}
            size="sm"
            name="note-editor-notebook"
            ariaLabel="Caderno da nota"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="note-editor-content"
            className="text-xs font-medium text-text-secondary"
          >
            Conteúdo (Markdown)
          </label>
          <textarea
            id="note-editor-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escreva em Markdown..."
            className="min-h-[240px] w-full resize-y rounded-field border border-[#26262A] bg-[#0F0F10] px-3.5 py-3 font-mono text-[13px] leading-relaxed text-text transition placeholder:text-text-muted focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          <p className="text-[11px] text-text-muted">
            Caderno: {NOTEBOOK_DETAIL_LABELS[notebook] ?? NOTEBOOKS.FOCUS}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
        <Button variant="ghost" icon={X} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" icon={Save}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
