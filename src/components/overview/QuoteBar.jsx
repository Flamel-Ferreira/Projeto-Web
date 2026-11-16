export default function QuoteBar({ quote, author, version }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm italic leading-relaxed text-text-secondary">
          “{quote}”
        </p>
        <p className="mt-1 text-[11px] text-text-muted">— {author}</p>
      </div>
      <p className="shrink-0 text-[11px] text-text-muted">{version}</p>
    </div>
  );
}
