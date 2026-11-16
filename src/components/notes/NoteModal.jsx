import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import {
  LIMITS,
  NOTEBOOK_LABELS,
  NOTEBOOK_ORDER,
  NOTEBOOKS,
} from '../../utils/constants.js';

const NOTEBOOK_OPTIONS = NOTEBOOK_ORDER.map((value) => ({
  value,
  label: NOTEBOOK_LABELS[value],
}));

export default function NoteModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [notebook, setNotebook] = useState(NOTEBOOKS.FOCUS);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setNotebook(NOTEBOOKS.FOCUS);
    setContent('');
    setError('');
  }, [open]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();

    if (!value) {
      setError('Informe o título da nota.');
      return;
    }

    onSubmit?.({ title: value, notebook, content });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova Nota"
      description="Escolha um caderno e registre a ideia. O conteúdo aceita Markdown."
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="note-form" icon={Plus}>
            Criar Nota
          </Button>
        </div>
      }
    >
      <form id="note-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="note-title"
          label="Título"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
          placeholder="Ex.: Ideias para o projeto"
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
            name="note-notebook"
            ariaLabel="Caderno da nota"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="note-content"
            className="text-xs font-medium text-text-secondary"
          >
            Conteúdo (opcional)
          </label>
          <textarea
            id="note-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escreva em Markdown..."
            className="min-h-[180px] w-full resize-y rounded-field border border-[#26262A] bg-[#0F0F10] px-3.5 py-3 font-mono text-[13px] leading-relaxed text-text transition placeholder:text-text-muted focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </form>
    </Modal>
  );
}
