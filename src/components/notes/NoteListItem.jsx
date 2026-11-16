import { cn } from '../../utils/cn.js';

export default function NoteListItem({ note, active, preview, timeLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full border-l-[3px] border-b border-b-white/5 px-3.5 py-3.5 text-left transition',
        active
          ? 'border-l-primary-light bg-[#1B1B1D]'
          : 'border-l-transparent hover:bg-white/[0.025]',
      )}
    >
      <span className="flex items-baseline gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text">
          {note.title}
        </span>
        <span className="shrink-0 text-[11px] text-text-muted">{timeLabel}</span>
      </span>
      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-text-secondary">
        {preview || 'Nota sem conteúdo.'}
      </span>
    </button>
  );
}
