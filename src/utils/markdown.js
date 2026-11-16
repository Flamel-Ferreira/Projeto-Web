/**
 * Utilitários de Markdown para os cards e metadados das notas.
 * Não renderiza HTML: apenas limpa a sintaxe para previews e contagens.
 */

function stripInline(line) {
  return line
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLine(line) {
  return stripInline(
    line
      .replace(/^\s{0,3}#{1,6}\s+/, '')
      .replace(/^\s{0,3}>\s?/, '')
      .replace(/^\s*([-*+]|\d+\.)\s+/, '')
      .replace(/^\s*([-*_])\1{2,}\s*$/, ''),
  );
}

/** Remove a sintaxe Markdown e devolve texto corrido. */
export function stripMarkdown(markdown = '') {
  const source = String(markdown)
    .replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1')
    .replace(/~~~[^\n]*\n?([\s\S]*?)~~~/g, '$1');

  return source
    .split(/\r?\n/)
    .map(stripLine)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Duas primeiras linhas não vazias, sem sintaxe, para o card da lista. */
export function getNotePreview(content = '', maxLines = 2) {
  if (typeof content !== 'string' || !content.trim()) return '';

  const lines = content
    .split(/\r?\n/)
    .map(stripLine)
    .filter(Boolean);

  return lines.slice(0, maxLines).join(' ');
}

/** Contagem no padrão do SPEC (RN-36). */
export function countWords(content = '') {
  const text = String(content ?? '').trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function hasContent(content = '') {
  return typeof content === 'string' && content.trim().length > 0;
}
